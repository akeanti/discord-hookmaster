
export interface DiscordField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordFooter {
  text: string;
  icon_url?: string;
}

export interface DiscordImage {
  url: string;
}

export interface DiscordThumbnail {
  url: string;
}

export interface DiscordAuthor {
  name: string;
  url?: string;
  icon_url?: string;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  footer?: DiscordFooter;
  thumbnail?: DiscordThumbnail;
  image?: DiscordImage;
  author?: DiscordAuthor;
  fields?: DiscordField[];
}

export interface DiscordComponentEmoji {
  name?: string;
  id?: string;
  animated?: boolean;
}

export interface DiscordSelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: DiscordComponentEmoji;
  default?: boolean;
}

export interface DiscordComponent {
  type: number;
  style?: number;
  label?: string;
  emoji?: DiscordComponentEmoji;
  custom_id?: string;
  url?: string;
  disabled?: boolean;
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  options?: DiscordSelectOption[];
  components?: DiscordComponent[];
}

export interface AllowedMentions {
  parse: ('roles' | 'users' | 'everyone')[];
  roles?: string[];
  users?: string[];
  replied_user?: boolean;
}

export interface WebhookPayload {
  content?: string;
  username?: string;
  avatar_url?: string;
  tts?: boolean;
  embeds?: DiscordEmbed[];
  components?: DiscordComponent[];
  allowed_mentions?: AllowedMentions;
  thread_name?: string;
}

export interface SavedWebhook {
  id: string;
  name: string;
  url: string;
  avatar_url?: string;
}
