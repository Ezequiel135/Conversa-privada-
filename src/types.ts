export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  isGroup: boolean;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
}
