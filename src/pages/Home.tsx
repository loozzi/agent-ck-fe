import { useAppSelector } from '@/app/hook'
import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Home = () => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    const role = user?.role

    if (role === 'user') {
      navigate('/dashboard')
    } else if (role === 'admin') {
      navigate('/admin/dashboard')
    } else if (role === 'trainer') {
      navigate('/trainer/dashboard')
    }
  }, [user])

  return (
    <div>
      <NavLink to='/signin' className='text-blue-500 hover:underline'>
        Sign In
      </NavLink>
      <NavLink to={'/dashboard'} className='text-blue-500 hover:underline ml-4'>
        Dashboard
      </NavLink>
    </div>
  )
}

export default Home
