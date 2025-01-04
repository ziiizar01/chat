import React from "react";
import ChatSidebar from "./chat/ChatSidebar";
import ConversationView from "./chat/ConversationView";
import CreateChatDialog from "./chat/CreateChatDialog";
import { ChatProvider } from "@/contexts/ChatContext";

const Home = () => {
  const [isCreateChatOpen, setIsCreateChatOpen] = React.useState(false);

  return (
    <ChatProvider>
      <div className="flex h-screen w-full bg-background">
        <ChatSidebar onNewChat={() => setIsCreateChatOpen(true)} />
        <ConversationView />
        <CreateChatDialog
          open={isCreateChatOpen}
          onOpenChange={setIsCreateChatOpen}
        />
      </div>
    </ChatProvider>
  );
};

export default Home;
