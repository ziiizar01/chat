import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Phone, Video, MoreVertical } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

interface ConversationViewProps {
  participant?: Participant;
  onCall?: () => void;
  onVideoCall?: () => void;
  onSendMessage?: (message: string) => void;
  onAttachFile?: (file: File) => void;
}

const defaultParticipant: Participant = {
  id: "1",
  name: "Alice Johnson",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  online: true,
};

const ConversationView = ({
  participant = defaultParticipant,
  onCall = () => {},
  onVideoCall = () => {},
  onSendMessage = () => {},
  onAttachFile = () => {},
}: ConversationViewProps) => {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback>
              {participant.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{participant.name}</h2>
            <p className="text-sm text-muted-foreground">
              {participant.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onCall}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onVideoCall}>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-hidden">
        <MessageList />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} onAttachFile={onAttachFile} />
    </div>
  );
};

export default ConversationView;
