import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

type Chat = {
  id: string;
  type: "personal" | "group";
  name: string | null;
  created_at: string;
  updated_at: string;
  participants: any[];
  last_message?: {
    content: string;
    created_at: string;
    sender: {
      username: string;
    };
  };
};

type Message = {
  id: string;
  content: string;
  sender_id: string;
  chat_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
};

type ChatContextType = {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  setCurrentChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => Promise<void>;
  createPersonalChat: (userId: string) => Promise<void>;
  createGroupChat: (name: string, userIds: string[]) => Promise<void>;
  loading: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [messageSubscription, setMessageSubscription] =
    useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat.id);
      subscribeToMessages(currentChat.id);
    }
    return () => {
      messageSubscription?.unsubscribe();
    };
  }, [currentChat]);

  const fetchChats = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        *,
        participants:chat_participants(user_id),
        messages:messages(content, created_at, sender:profiles(username))
      `,
      )
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setChats(
        data.map((chat) => ({
          ...chat,
          last_message: chat.messages?.[0],
        })),
      );
    }
    setLoading(false);
  };

  const fetchMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:profiles(username, avatar_url)
      `,
      )
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const subscribeToMessages = (chatId: string) => {
    const subscription = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          const { data, error } = await supabase
            .from("messages")
            .select(
              `
            *,
            sender:profiles(username, avatar_url)
          `,
            )
            .eq("id", payload.new.id)
            .single();

          if (!error && data) {
            setMessages((prev) => [...prev, data]);
          }
        },
      )
      .subscribe();

    setMessageSubscription(subscription);
  };

  const sendMessage = async (content: string) => {
    if (!currentChat || !user) return;

    const { error } = await supabase.from("messages").insert({
      chat_id: currentChat.id,
      sender_id: user.id,
      content,
    });

    if (error) throw error;
  };

  const createPersonalChat = async (userId: string) => {
    if (!user) return;

    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert({
        type: "personal",
      })
      .select()
      .single();

    if (chatError || !chat) throw chatError;

    const participants = [
      { chat_id: chat.id, user_id: user.id },
      { chat_id: chat.id, user_id: userId },
    ];

    const { error: participantsError } = await supabase
      .from("chat_participants")
      .insert(participants);

    if (participantsError) throw participantsError;

    await fetchChats();
    const newChat = chats.find((c) => c.id === chat.id);
    if (newChat) setCurrentChat(newChat);
  };

  const createGroupChat = async (name: string, userIds: string[]) => {
    if (!user) return;

    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert({
        type: "group",
        name,
      })
      .select()
      .single();

    if (chatError || !chat) throw chatError;

    const participants = [
      { chat_id: chat.id, user_id: user.id },
      ...userIds.map((userId) => ({
        chat_id: chat.id,
        user_id: userId,
      })),
    ];

    const { error: participantsError } = await supabase
      .from("chat_participants")
      .insert(participants);

    if (participantsError) throw participantsError;

    await fetchChats();
    const newChat = chats.find((c) => c.id === chat.id);
    if (newChat) setCurrentChat(newChat);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        setCurrentChat,
        sendMessage,
        createPersonalChat,
        createGroupChat,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
