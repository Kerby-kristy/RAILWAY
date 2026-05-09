import { InstanceDto } from '@api/dto/instance.dto';
import { HiggsfieldDto } from '@api/integrations/chatbot/higgsfield/dto/higgsfield.dto';
import { HiggsfieldService } from '@api/integrations/chatbot/higgsfield/services/higgsfield.service';
import { PrismaRepository } from '@api/repository/repository.service';
import { WAMonitoringService } from '@api/services/monitor.service';
import { configService } from '@config/env.config';
import { Logger } from '@config/logger.config';
import { BadRequestException } from '@exceptions';
import { Higgsfield as HiggsfieldModel, IntegrationSession } from '@prisma/client';

import { BaseChatbotController } from '../../base-chatbot.controller';

export class HiggsfieldController extends BaseChatbotController<HiggsfieldModel, HiggsfieldDto> {
  constructor(
    private readonly higgsfieldService: HiggsfieldService,
    prismaRepository: PrismaRepository,
    waMonitor: WAMonitoringService,
  ) {
    super(prismaRepository, waMonitor);

    this.botRepository = this.prismaRepository.higgsfield;
    this.settingsRepository = this.prismaRepository.higgsfieldSetting;
    this.sessionRepository = this.prismaRepository.integrationSession;
  }

  public readonly logger = new Logger('HiggsfieldController');
  protected readonly integrationName = 'Higgsfield';

  integrationEnabled = configService.get('HIGGSFIELD').ENABLED;
  botRepository: any;
  settingsRepository: any;
  sessionRepository: any;
  userMessageDebounce: { [key: string]: { message: string; timeoutId: NodeJS.Timeout } } = {};

  protected getFallbackBotId(settings: any): string | undefined {
    return settings?.fallbackId;
  }

  protected getFallbackFieldName(): string {
    return 'higgsfieldIdFallback';
  }

  protected getIntegrationType(): string {
    return 'higgsfield';
  }

  protected getAdditionalBotData(data: HiggsfieldDto): Record<string, any> {
    return {
      serverUrl: data.serverUrl,
      apiKey: data.apiKey,
      toolName: data.toolName,
    };
  }

  protected getAdditionalUpdateFields(data: HiggsfieldDto): Record<string, any> {
    return {
      serverUrl: data.serverUrl,
      apiKey: data.apiKey,
      toolName: data.toolName,
    };
  }

  protected async validateNoDuplicatesOnUpdate(botId: string, instanceId: string, data: HiggsfieldDto): Promise<void> {
    const checkDuplicate = await this.botRepository.findFirst({
      where: {
        id: { not: botId },
        instanceId,
        serverUrl: data.serverUrl,
        apiKey: data.apiKey,
        toolName: data.toolName,
      },
    });

    if (checkDuplicate) {
      throw new Error('Higgsfield bot already exists');
    }
  }

  public async createBot(instance: InstanceDto, data: HiggsfieldDto) {
    if (!this.integrationEnabled) throw new BadRequestException('Higgsfield is disabled');

    const instanceId = await this.prismaRepository.instance
      .findFirst({ where: { name: instance.instanceName } })
      .then((i) => i.id);

    const checkDuplicate = await this.botRepository.findFirst({
      where: {
        instanceId,
        serverUrl: data.serverUrl,
        apiKey: data.apiKey,
        toolName: data.toolName,
      },
    });

    if (checkDuplicate) {
      throw new Error('Higgsfield bot already exists');
    }

    return super.createBot(instance, data);
  }

  protected async processBot(
    instance: any,
    remoteJid: string,
    bot: HiggsfieldModel,
    session: IntegrationSession,
    settings: any,
    content: string,
    pushName?: string,
    msg?: any,
  ) {
    await this.higgsfieldService.process(instance, remoteJid, bot, session, settings, content, pushName, msg);
  }
}
