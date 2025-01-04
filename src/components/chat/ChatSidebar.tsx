import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Plus, Settings } from "lucide-react";
import ChatList from "./ChatList";

interface ChatSidebarProps {
  onNewChat?: () => void;
  onChatSelect?: (chatId: string) => void;
  selectedChatId?: string;
  userProfile?: {
    name: string;
    avatar: string;
  };
}

const defaultUserProfile = {
  name: "John Doe",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
};

const ChatSidebar = ({
  onNewChat = () => {},
  onChatSelect = () => {},
  selectedChatId = "",
  userProfile = defaultUserProfile,
}: ChatSidebarProps) => {
  return (
    <div className="w-[320px] h-full border-r flex flex-col bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback>
              {userProfile.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{userProfile.name}</span>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 border-b">
        <Button onClick={onNewChat} className="w-full">
          <Plus className="h-5 w-5 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatList onChatSelect={onChatSelect} selectedChatId={selectedChatId} />
      </div>
    </div>
  );
};

export default ChatSidebar;
