import { PrismaRepository } from '@api/repository/repository.service';
import { WAMonitoringService } from '@api/services/monitor.service';
import { ConfigService } from '@config/env.config';
import { Higgsfield, HiggsfieldSetting, IntegrationSession } from '@prisma/client';
import axios from 'axios';

import { BaseChatbotService } from '../../base-chatbot.service';
import { OpenaiService } from '../../openai/services/openai.service';

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

      const toolName = bot.toolName || 'chat';

      // Handle audio transcription
      if (this.isAudioMessage(content) && msg) {
        try {
          this.logger.debug(`[Higgsfield] Downloading audio for Whisper transcription`);
          const transcription = await this.openaiService.speechToText(msg, instance);
          if (transcription) {
            content = `[audio] ${transcription}`;
          }
        } catch (err) {
          this.logger.error(`[Higgsfield] Failed to transcribe audio: ${err}`);
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      };

      if (bot.apiKey) {
        headers['Authorization'] = `Bearer ${bot.apiKey}`;
      }

      // JSON-RPC 2.0 tools/call request
      const rpcPayload = {
        jsonrpc: '2.0',
        id: session.sessionId,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: {
            message: content,
            sessionId: session.sessionId,
            remoteJid,
            pushName,
          },
        },
      };

      const response = await axios.post(bot.serverUrl, rpcPayload, { headers });

      const rpcResult = response?.data?.result;
      let message: string | undefined;

      if (rpcResult) {
        if (typeof rpcResult === 'string') {
          message = rpcResult;
        } else if (Array.isArray(rpcResult?.content)) {
          const textContent = rpcResult.content.find((c: any) => c.type === 'text');
          message = textContent?.text;
        } else if (rpcResult?.content) {
          message = String(rpcResult.content);
        } else {
          message = rpcResult?.output || rpcResult?.answer || rpcResult?.text;
        }
      }

      await this.sendMessageWhatsApp(instance, remoteJid, message, settings, true);

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
