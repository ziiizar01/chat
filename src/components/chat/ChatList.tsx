import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface Chat {
  id: string;
  type: "personal" | "group";
  name: string | null;
  participants: any[];
  last_message?: {
    content: string;
    created_at: string;
    sender: {
      username: string;
    };
  };
}

interface ChatListProps {
  chats?: Chat[];
  onChatSelect?: (chat: Chat) => void;
  selectedChatId?: string;
}

const ChatList = ({
  chats = [],
  onChatSelect = () => {},
  selectedChatId = "",
}: ChatListProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="w-full h-full bg-background overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`flex items-center gap-3 p-4 hover:bg-accent cursor-pointer ${
            selectedChatId === chat.id ? "bg-accent" : ""
          }`}
          onClick={() => onChatSelect(chat)}
        >
          <div className="relative">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.id}`}
              />
              <AvatarFallback>
                {(chat.name || "Chat").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold truncate">
                {chat.name || chat.type === "personal"
                  ? "Personal Chat"
                  : "Group Chat"}
              </h3>
              {chat.last_message && (
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(chat.last_message.created_at)}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground truncate">
                {chat.last_message ? (
                  <>
                    <span className="font-medium">
                      {chat.last_message.sender.username}:{" "}
                    </span>
                    {chat.last_message.content}
                  </>
                ) : (
                  "No messages yet"
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
