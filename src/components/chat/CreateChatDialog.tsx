import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, Users } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
}

interface CreateChatDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateChatDialog = ({
  open = false,
  onOpenChange = () => {},
}: CreateChatDialogProps) => {
  const [selectedTab, setSelectedTab] = React.useState("personal");
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [groupName, setGroupName] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { createPersonalChat, createGroupChat } = useChat();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUser?.id);

      if (!error && data) {
        setUsers(data);
      }
      setLoading(false);
    };

    if (open) {
      fetchUsers();
    }
  }, [open, currentUser?.id]);

  const handleUserSelect = async (userId: string) => {
    if (selectedTab === "personal") {
      await createPersonalChat(userId);
      onOpenChange(false);
    } else {
      setSelectedUsers((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId],
      );
    }
  };

  const handleCreateGroup = async () => {
    if (groupName && selectedUsers.length > 0) {
      await createGroupChat(groupName, selectedUsers);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 hover:bg-accent rounded-lg cursor-pointer"
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={
                            user.avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                          }
                        />
                        <AvatarFallback>
                          {user.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.full_name || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 hover:bg-accent rounded-lg cursor-pointer"
                      onClick={() => handleUserSelect(user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              user.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                            }
                          />
                          <AvatarFallback>
                            {user.username?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.full_name || ""}
                          </p>
                        </div>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ))
                )}
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
