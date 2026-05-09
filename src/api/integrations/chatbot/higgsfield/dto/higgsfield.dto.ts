import { BaseChatbotDto, BaseChatbotSettingDto } from '../../base-chatbot.dto';

export class HiggsfieldDto extends BaseChatbotDto {
  serverUrl: string;
  apiKey?: string;
  // generate_image_soul | generate_video_dop | generate_speech_video
  toolName?: string;
  // Default image/video quality: "720p" | "1080p"
  quality?: string;
}

export class HiggsfieldSettingDto extends BaseChatbotSettingDto {}
