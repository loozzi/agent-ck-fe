import { useAppDispatch } from '@/app/hook'
import { signOutAction } from '@/slices/auth.slice'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const SignOut = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(signOutAction())
    navigate('/')
  }, [])

  return <div>SignOut</div>
}

export default SignOut
