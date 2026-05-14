/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaRepository } from '@api/repository/repository.service';
import { WAMonitoringService } from '@api/services/monitor.service';
import { Integration } from '@api/types/wa.types';
import { ConfigService, HttpServer } from '@config/env.config';
import { Higgsfield as HiggsfieldModel, IntegrationSession } from '@prisma/client';
import axios from 'axios';

import { BaseChatbotService } from '../../base-chatbot.service';
import { OpenaiService } from '../../openai/services/openai.service';

export class HiggsfieldService extends BaseChatbotService<HiggsfieldModel> {
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

  public async processBot(
    instance: any,
    remoteJid: string,
    bot: HiggsfieldModel,
    session: IntegrationSession,
    settings: any,
    content: string,
    pushName?: string,
    msg?: any,
  ) {
    await this.process(instance, remoteJid, bot, session, settings, content, pushName, msg);
  }

  protected async sendMessageToBot(
    instance: any,
    session: IntegrationSession,
    settings: any,
    bot: HiggsfieldModel,
    remoteJid: string,
    pushName: string,
    content: string,
    msg?: any,
  ): Promise<void> {
    const payload: any = {
      question: content,
      overrideConfig: {
        sessionId: remoteJid,
        vars: {
          messageId: msg?.key?.id,
          fromMe: msg?.key?.fromMe,
          remoteJid: remoteJid,
          pushName: pushName,
          instanceName: instance.instanceName,
          serverUrl: this.configService.get<HttpServer>('SERVER').URL,
          apiKey: instance.token,
        },
      },
    };

    if (this.isAudioMessage(content) && msg) {
      try {
        this.logger.debug(`[Higgsfield] Downloading audio for Whisper transcription`);
        const transcription = await this.openaiService.speechToText(msg, instance);
        if (transcription) {
          payload.question = `[audio] ${transcription}`;
        }
      } catch (err) {
        this.logger.error(`[Higgsfield] Failed to transcribe audio: ${err}`);
      }
    }

    if (this.isImageMessage(content)) {
      const media = content.split('|');

      if (msg.message.mediaUrl || msg.message.base64) {
        payload.uploads = [
          {
            data: msg.message.base64 || msg.message.mediaUrl,
            type: 'url',
            name: 'Higgsfield.png',
            mime: 'image/png',
          },
        ];
      } else {
        payload.uploads = [
          {
            data: media[1].split('?')[0],
            type: 'url',
            name: 'Higgsfield.png',
            mime: 'image/png',
          },
        ];
        payload.question = media[2] || content;
      }
    }

    if (instance.integration === Integration.WHATSAPP_BAILEYS) {
      await instance.client.presenceSubscribe(remoteJid);
      await instance.client.sendPresenceUpdate('composing', remoteJid);
    }

    let headers: any = {
      'Content-Type': 'application/json',
    };

    if (bot.apiKey) {
      headers = {
        ...headers,
        Authorization: `Bearer ${bot.apiKey}`,
      };
    }

    const endpoint = bot.apiUrl;

    if (!endpoint) {
      this.logger.error('No Higgsfield endpoint defined');
      return;
    }

    const response = await axios.post(endpoint, payload, { headers });

    if (instance.integration === Integration.WHATSAPP_BAILEYS) {
      await instance.client.sendPresenceUpdate('paused', remoteJid);
    }

    const message = response?.data?.text;

    if (message) {
      await this.sendMessageWhatsApp(instance, remoteJid, message, settings, true);
    }
  }
}
