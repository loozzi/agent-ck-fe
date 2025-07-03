import { NavLink } from 'react-router-dom'

const Home = () => {
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
