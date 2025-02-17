"use client";

import { useEffect, useState } from "react";
import { Bot, Eye, MessageSquare, LogOut, User, Trash } from "lucide-react";
import Link from "next/link";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Static menu items
const staticItems = [
  {
    title: "AI Assistant",
    url: "/chat",
    icon: Bot,
  },
  {
    title: "Vision AI",
    url: "/vision-ai",
    icon: Eye,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { user, logOut } = useAuth();
  const [chats, setChats] = useState<Array<{ id: string; title: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChats() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const chatsRef = collection(db, "chathistory");
        const q = query(chatsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedChats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "Untitled Chat",
        }));

        setChats(fetchedChats);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load chats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchChats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Sidebar className="border-gray-700">
      <SidebarContent className="bg-stone-800 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white text-xl font-black">
            VitaeAI
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="p-2">
              {staticItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Button onClick={()=> router.push(item.url)} className="py-5">
                      <item.icon />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-white">Your Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="p-2">
                {isLoading ? (
                  <SidebarMenuItem>
                    <span>Loading chats...</span>
                  </SidebarMenuItem>
                ) : error ? (
                  <SidebarMenuItem>
                    <span className="text-red-500">{error}</span>
                  </SidebarMenuItem>
                ) : chats.length === 0 ? (
                  <SidebarMenuItem>
                    <span>No chats found</span>
                  </SidebarMenuItem>
                ) : (
                  chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild>
                        <Link href={`/chat/${chat.id}`} className="py-2">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          <span className="truncate">{chat.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                await deleteDoc(doc(db, "chathistory", chat.id));
                                setChats((prevChats) => prevChats.filter((c) => c.id !== chat.id));
                              } catch (err) {
                                console.error("Error deleting chat:", err);
                                setError("Failed to delete chat. Please try again.");
                              }
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      {user ? (
        <SidebarFooter className="bg-stone-900 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={user.photoURL ?? undefined}
                  alt={user.displayName || "User"}
                />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </SidebarFooter>
      ) : null}
    </Sidebar>
  );
}
