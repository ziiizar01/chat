import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
}

interface MessageListProps {
  messages?: Message[];
}

const MessageList = ({ messages = [] }: MessageListProps) => {
  const { user } = useAuth();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollArea ref={scrollRef} className="h-full w-full p-4">
      <div className="flex flex-col space-y-4">
        {messages.map((message) => {
          const isMine = message.sender_id === user?.id;

          return (
            <div
              key={message.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[70%] items-end space-x-2 
                  ${isMine ? "flex-row-reverse space-x-reverse" : "flex-row"}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={message.sender?.avatar_url}
                    alt={message.sender?.username}
                  />
                  <AvatarFallback>
                    {message.sender?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col space-y-1">
                  <div
                    className={`rounded-lg p-3 
                      ${
                        isMine
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-xs text-muted-foreground
                      ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <span>{message.sender?.username}</span>
                    <span>•</span>
                    <span>{formatTimestamp(message.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
