export default function useLiveChat() {
  const currentConversationId = useState<number | null>('currentConversationId', () => null)

  return {
    currentConversationId,
  }
}
