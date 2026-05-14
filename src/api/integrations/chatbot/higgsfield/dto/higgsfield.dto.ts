import { BaseChatbotDto, BaseChatbotSettingDto } from '../../base-chatbot.dto';

export class HiggsfieldDto extends BaseChatbotDto {
  apiUrl: string;
  apiKey?: string;
}

export class HiggsfieldSettingDto extends BaseChatbotSettingDto {
  higgsfieldIdFallback?: string;
}
