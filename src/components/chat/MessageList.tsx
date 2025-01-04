import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Check, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  isRead: boolean;
  isSent: boolean;
  isMine: boolean;
}

interface MessageListProps {
  messages?: Message[];
}

const defaultMessages: Message[] = [
  {
    id: "1",
    content: "Hey, how are you?",
    sender: {
      id: "1",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    timestamp: "9:41 AM",
    isRead: true,
    isSent: true,
    isMine: false,
  },
  {
    id: "2",
    content: "I'm doing great! How about you?",
    sender: {
      id: "2",
      name: "Current User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me",
    },
    timestamp: "9:42 AM",
    isRead: true,
    isSent: true,
    isMine: true,
  },
  {
    id: "3",
    content: "Just working on some new features. The weather is nice today!",
    sender: {
      id: "1",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    timestamp: "9:45 AM",
    isRead: false,
    isSent: true,
    isMine: false,
  },
];

const MessageList = ({ messages = defaultMessages }: MessageListProps) => {
  return (
    <div className="h-full w-full bg-background">
      <ScrollArea className="h-full w-full p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[70%] items-end space-x-2 
                  ${message.isMine ? "flex-row-reverse space-x-reverse" : "flex-row"}`}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={message.sender.avatar}
                          alt={message.sender.name}
                        />
                        <AvatarFallback>
                          {message.sender.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{message.sender.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex flex-col space-y-1">
                  <div
                    className={`rounded-lg p-3 
                      ${
                        message.isMine
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-xs text-muted-foreground
                      ${message.isMine ? "justify-end" : "justify-start"}`}
                  >
                    <span>{message.timestamp}</span>
                    {message.isMine && message.isSent && (
                      <span>
                        {message.isRead ? (
                          <CheckCheck className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
