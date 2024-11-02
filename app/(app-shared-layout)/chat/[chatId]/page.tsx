import Chat from '@/components/Chat'

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return <Chat chatId={params.chatId} />
}