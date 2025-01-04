import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, Users } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

interface CreateChatDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreatePersonalChat?: (userId: string) => void;
  onCreateGroupChat?: (name: string, userIds: string[]) => void;
  users?: User[];
}

const defaultUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    email: "alice@example.com",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    email: "bob@example.com",
  },
  {
    id: "3",
    name: "Carol White",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    email: "carol@example.com",
  },
];

const CreateChatDialog = ({
  open = true,
  onOpenChange = () => {},
  onCreatePersonalChat = () => {},
  onCreateGroupChat = () => {},
  users = defaultUsers,
}: CreateChatDialogProps) => {
  const [selectedTab, setSelectedTab] = React.useState("personal");
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [groupName, setGroupName] = React.useState("");

  const handleUserSelect = (userId: string) => {
    if (selectedTab === "personal") {
      onCreatePersonalChat(userId);
      onOpenChange(false);
    } else {
      setSelectedUsers((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId],
      );
    }
  };

  const handleCreateGroup = () => {
    if (groupName && selectedUsers.length > 0) {
      onCreateGroupChat(groupName, selectedUsers);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>New Chat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="personal"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="group">Group</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 hover:bg-accent rounded-lg cursor-pointer"
                  onClick={() => handleUserSelect(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="group" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Members</Label>
              <ScrollArea className="h-[300px] pr-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 hover:bg-accent rounded-lg cursor-pointer"
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {selectedUsers.includes(user.id) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{selectedUsers.length} members selected</span>
              </div>
              <Button
                onClick={handleCreateGroup}
                disabled={!groupName || selectedUsers.length === 0}
              >
                Create Group
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatDialog;
