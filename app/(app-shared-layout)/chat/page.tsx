import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const dynamic = 'force-dynamic'

export default function ChatPage() {
  const chatId = uuidv4();
  return redirect(`/chat/${chatId}`);
}
