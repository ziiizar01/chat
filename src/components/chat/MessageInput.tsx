import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Paperclip, Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  onAttachFile?: (file: File) => void;
  disabled?: boolean;
}

const MessageInput = ({
  onSendMessage = () => {},
  onAttachFile = () => {},
  disabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = React.useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttachFile(file);
    }
  };

  return (
    <div className="w-full h-[100px] bg-background border-t p-4 flex items-end gap-2">
      <div className="flex-1 flex items-center gap-2 rounded-lg border bg-background p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={disabled}
              >
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border-0 focus-visible:ring-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={disabled}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                  disabled={disabled}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  disabled={disabled}
                >
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-10 w-10 rounded-full p-2"
              onClick={handleSend}
              disabled={disabled || !message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send message</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MessageInput;
