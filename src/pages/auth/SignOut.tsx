import { useAppDispatch } from '@/app/hook'
import { authActions } from '@/slices/auth.slice'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const SignOut = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(authActions.signOut())
    navigate('/signin')
  }, [])

  return <div>SignOut</div>
}

export default SignOut
