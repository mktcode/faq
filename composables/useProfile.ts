export const useProfile = () => {
  const username = useState<string | null>('username', () => null)
  const isSubscribed = useState<boolean>('isSubscribed', () => false)
  const isOwned = useState<boolean>('isOwned', () => false)
  const isPublic = useState<boolean>('isPublic', () => false)
  const design = useState<string>('design', () => 'default')

  return {
    username,
    isSubscribed,
    isOwned,
    isPublic,
    design,
  }
}
