import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Phone, Video, MoreVertical } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";

const ConversationView = () => {
  const { currentChat, messages, sendMessage } = useChat();

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentChat.id}`}
            />
            <AvatarFallback>
              {(currentChat.name || "Chat").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {currentChat.name ||
                (currentChat.type === "personal"
                  ? "Personal Chat"
                  : "Group Chat")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentChat.participants?.length || 0} participants
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ConversationView;
