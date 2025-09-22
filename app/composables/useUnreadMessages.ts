export default function useUnreadMessages() {
  const hasUnreadMessages = useState<boolean>('livechat.hasUnreadMessages', () => false)

  return {
    hasUnreadMessages,
  }
}