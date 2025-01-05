import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, Plus, Settings } from "lucide-react";
import ChatList from "./ChatList";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";

interface ChatSidebarProps {
  onNewChat?: () => void;
}

const ChatSidebar = ({ onNewChat = () => {} }: ChatSidebarProps) => {
  const { profile, signOut } = useAuth();
  const { currentChat, setCurrentChat, chats } = useChat();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-[320px] h-full border-r flex flex-col bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
            <AvatarFallback>
              {profile?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{profile?.username}</span>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 border-b">
        <Button onClick={onNewChat} className="w-full">
          <Plus className="h-5 w-5 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatList
          chats={chats}
          onChatSelect={(chat) => setCurrentChat(chat)}
          selectedChatId={currentChat?.id}
        />
      </div>
    </div>
  );
};

export default ChatSidebar;
