import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatarUrl?: string;
  online?: boolean;
}

interface ChatListProps {
  chats?: ChatPreview[];
  onChatSelect?: (chatId: string) => void;
  selectedChatId?: string;
}

const defaultChats: ChatPreview[] = [
  {
    id: "1",
    name: "Alice Johnson",
    lastMessage: "Hey, how are you doing?",
    timestamp: "2:30 PM",
    unreadCount: 3,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    online: true,
  },
  {
    id: "2",
    name: "Team Project",
    lastMessage: "Meeting at 3 PM tomorrow",
    timestamp: "11:20 AM",
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Team",
    online: false,
  },
  {
    id: "3",
    name: "Bob Smith",
    lastMessage: "Thanks for the update!",
    timestamp: "Yesterday",
    unreadCount: 1,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    online: true,
  },
];

const ChatList = ({
  chats = defaultChats,
  onChatSelect = () => {},
  selectedChatId = "",
}: ChatListProps) => {
  return (
    <div className="w-full h-full bg-background overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`flex items-center gap-3 p-4 hover:bg-accent cursor-pointer ${
            selectedChatId === chat.id ? "bg-accent" : ""
          }`}
          onClick={() => onChatSelect(chat.id)}
        >
          <div className="relative">
            <Avatar>
              <AvatarImage src={chat.avatarUrl} />
              <AvatarFallback>
                {chat.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold truncate">{chat.name}</h3>
              <span className="text-xs text-muted-foreground">
                {chat.timestamp}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground truncate">
                {chat.lastMessage}
              </p>
              {chat.unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {chat.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
