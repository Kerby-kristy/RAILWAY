import { PrismaRepository } from '@api/repository/repository.service';
import { WAMonitoringService } from '@api/services/monitor.service';
import { ConfigService } from '@config/env.config';
import { Higgsfield, HiggsfieldSetting, IntegrationSession } from '@prisma/client';
import axios from 'axios';

import { BaseChatbotService } from '../../base-chatbot.service';
import { OpenaiService } from '../../openai/services/openai.service';

const DEFAULT_SERVER_URL = 'https://mcp.higgsfield.ai/mcp';
const DEFAULT_TOOL = 'generate_image_soul';
const JOB_POLL_INTERVAL_MS = 3000;
const JOB_POLL_MAX_ATTEMPTS = 40; // ~2 minutes

export class HiggsfieldService extends BaseChatbotService<Higgsfield, HiggsfieldSetting> {
  private openaiService: OpenaiService;

  constructor(
    waMonitor: WAMonitoringService,
    prismaRepository: PrismaRepository,
    configService: ConfigService,
    openaiService: OpenaiService,
  ) {
    super(waMonitor, prismaRepository, 'HiggsfieldService', configService);
    this.openaiService = openaiService;
  }

  protected getBotType(): string {
    return 'higgsfield';
  }

  private buildHeaders(apiKey?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    return headers;
  }

  private async callMcpTool(serverUrl: string, apiKey: string | undefined, toolName: string, args: Record<string, any>): Promise<any> {
    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name: toolName, arguments: args },
    };
    const response = await axios.post(serverUrl, payload, { headers: this.buildHeaders(apiKey) });
    const result = response?.data?.result;
    if (response?.data?.error) {
      throw new Error(`MCP error: ${JSON.stringify(response.data.error)}`);
    }
    return result;
  }

  private extractContent(result: any): { text?: string; url?: string } {
    if (!result) return {};
    // MCP content array format
    if (Array.isArray(result?.content)) {
      const textItem = result.content.find((c: any) => c.type === 'text');
      const imageItem = result.content.find((c: any) => c.type === 'image');
      return {
        text: textItem?.text,
        url: imageItem?.url || imageItem?.data,
      };
    }
    // Flat object
    return {
      text: result?.text || result?.output || result?.answer,
      url: result?.url || result?.image_url || result?.video_url || result?.media_url,
    };
  }

  private async pollJobStatus(serverUrl: string, apiKey: string | undefined, jobSetId: string): Promise<any> {
    for (let attempt = 0; attempt < JOB_POLL_MAX_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, JOB_POLL_INTERVAL_MS));
      const result = await this.callMcpTool(serverUrl, apiKey, 'get_job_status', { job_set_id: jobSetId });
      const content = this.extractContent(result);

      let parsed: any = {};
      try {
        parsed = content.text ? JSON.parse(content.text) : result;
      } catch {
        parsed = result;
      }

      const status: string = parsed?.status || parsed?.state || '';
      if (status === 'completed') return parsed;
      if (status === 'failed' || status === 'nsfw') {
        throw new Error(`Higgsfield job ${status}: ${JSON.stringify(parsed)}`);
      }
    }
    throw new Error('Higgsfield job timed out');
  }

  private extractMediaUrl(jobResult: any): string | undefined {
    if (!jobResult) return undefined;
    // Standard fields returned by various Higgsfield tools
    const candidates = [
      jobResult?.url,
      jobResult?.image_url,
      jobResult?.video_url,
      jobResult?.media_url,
      jobResult?.output_url,
      jobResult?.result_url,
      jobResult?.generations?.[0]?.url,
      jobResult?.images?.[0]?.url,
      jobResult?.videos?.[0]?.url,
    ];
    return candidates.find(Boolean);
  }

  protected async sendMessageToBot(
    instance: any,
    session: IntegrationSession,
    settings: HiggsfieldSetting,
    bot: Higgsfield,
    remoteJid: string,
    pushName: string,
    content: string,
    msg?: any,
  ) {
    try {
      if (!session) {
        this.logger.error('Session is null in sendMessageToBot');
        return;
      }

      const serverUrl = bot.serverUrl || DEFAULT_SERVER_URL;
      const toolName = bot.toolName || DEFAULT_TOOL;
      const quality = (bot as any).quality || '720p';

      // Transcribe audio if needed
      if (this.isAudioMessage(content) && msg) {
        try {
          const transcription = await this.openaiService.speechToText(msg, instance);
          if (transcription) content = transcription;
        } catch (err) {
          this.logger.error(`[Higgsfield] Audio transcription failed: ${err}`);
        }
      }

      // Build tool arguments based on selected tool
      const toolArgs: Record<string, any> = { prompt: content, quality };
      if (toolName === 'generate_video_dop' && msg?.imageUrl) {
        toolArgs.input_image_url = msg.imageUrl;
      }

      this.logger.debug(`[Higgsfield] Calling tool="${toolName}" prompt="${content}"`);
      const initialResult = await this.callMcpTool(serverUrl, bot.apiKey, toolName, toolArgs);
      const initialContent = this.extractContent(initialResult);

      // If the tool returns a job_set_id, poll for completion
      let finalContent = initialContent;
      let jobResult: any = null;
      try {
        const parsed = initialContent.text ? JSON.parse(initialContent.text) : initialResult;
        const jobSetId: string | undefined = parsed?.job_set_id || parsed?.jobSetId || parsed?.id;

        if (jobSetId) {
          this.logger.debug(`[Higgsfield] Polling job_set_id=${jobSetId}`);
          jobResult = await this.pollJobStatus(serverUrl, bot.apiKey, jobSetId);
          finalContent = { url: this.extractMediaUrl(jobResult), text: jobResult?.message };
        }
      } catch (parseErr) {
        // Not a job-based response — use initialContent directly
        if (initialContent.url || initialContent.text) {
          finalContent = initialContent;
        } else {
          throw parseErr;
        }
      }

      if (finalContent.url) {
        // Send as media message to WhatsApp
        await instance.sendMessage(remoteJid, { url: finalContent.url }, {});
      } else {
        const text = finalContent.text || 'Higgsfield generation completed.';
        await this.sendMessageWhatsApp(instance, remoteJid, text, settings, true);
      }

      await this.prismaRepository.integrationSession.update({
        where: { id: session.id },
        data: { status: 'opened', awaitUser: true },
      });
    } catch (error) {
      this.logger.error(error.response?.data || error);
      return;
    }
  }
}
