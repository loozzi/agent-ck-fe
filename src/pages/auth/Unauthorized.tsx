import { useAppSelector } from '@/app/hook'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const Unauthorized = () => {
  const user = useAppSelector((state) => state.auth.user)
  const navigte = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigte('/admin')
      } else {
        navigte('/viewer')
      }
    }
  }, [user])

  return <div>Unauthorized</div>
}

export default Unauthorized
