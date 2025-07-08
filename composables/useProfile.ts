export const useProfile = () => {
  const username = useState<string | null>('username', () => null)
  const isSubscribed = useState<boolean>('isSubscribed', () => false)
  const design = useState<string>('design', () => 'default')

  return {
    username,
    isSubscribed,
    design,
  }
}
