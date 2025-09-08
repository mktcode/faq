export default function usePath() {
  const router = useRouter()

  const path = useState('websitePath', () => router.currentRoute.value.path)

  return {
    path,
  }
}
