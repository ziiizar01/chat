import React from "react";
import ChatSidebar from "./chat/ChatSidebar";
import ConversationView from "./chat/ConversationView";
import CreateChatDialog from "./chat/CreateChatDialog";

interface HomeProps {
  onNewChat?: () => void;
  onChatSelect?: (chatId: string) => void;
  onSendMessage?: (message: string) => void;
  onAttachFile?: (file: File) => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  selectedChatId?: string;
}

const Home = ({
  onNewChat = () => {},
  onChatSelect = () => {},
  onSendMessage = () => {},
  onAttachFile = () => {},
  onCall = () => {},
  onVideoCall = () => {},
  selectedChatId = "",
}: HomeProps) => {
  const [isCreateChatOpen, setIsCreateChatOpen] = React.useState(false);

  const handleNewChat = () => {
    setIsCreateChatOpen(true);
    onNewChat();
  };

  const handleCreatePersonalChat = (userId: string) => {
    console.log("Creating personal chat with user:", userId);
    onChatSelect(userId);
  };

  const handleCreateGroupChat = (name: string, userIds: string[]) => {
    console.log("Creating group chat:", { name, userIds });
    onChatSelect(userIds.join("-"));
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <ChatSidebar
        onNewChat={handleNewChat}
        onChatSelect={onChatSelect}
        selectedChatId={selectedChatId}
      />

      <ConversationView
        onCall={onCall}
        onVideoCall={onVideoCall}
        onSendMessage={onSendMessage}
        onAttachFile={onAttachFile}
      />

      <CreateChatDialog
        open={isCreateChatOpen}
        onOpenChange={setIsCreateChatOpen}
        onCreatePersonalChat={handleCreatePersonalChat}
        onCreateGroupChat={handleCreateGroupChat}
      />
    </div>
  );
};

export default Home;
