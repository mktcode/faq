export default function useColorMode() {
  const colorMode = useState<'dark' | 'light'>(() => 'light' as const)

  const toggleColorMode = () => {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    colorMode,
    toggleColorMode
  }
}