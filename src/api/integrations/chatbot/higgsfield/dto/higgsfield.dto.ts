import { BaseChatbotDto, BaseChatbotSettingDto } from '../../base-chatbot.dto';

export class HiggsfieldDto extends BaseChatbotDto {
  serverUrl: string;
  apiKey?: string;
  toolName?: string;
}

export class HiggsfieldSettingDto extends BaseChatbotSettingDto {}
