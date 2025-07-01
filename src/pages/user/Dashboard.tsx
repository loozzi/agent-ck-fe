import { useAppDispatch, useAppSelector } from '@/app/hook'
import { getSubscriptionStatus } from '@/slices/auth.slice'
import { useEffect } from 'react'

const UserDashboard = () => {
  const dispatch = useAppDispatch()
  const { subscription, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getSubscriptionStatus())
  }, [])

  return (
    <div>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Welcome, {user?.full_name || 'User'}</h1>
        <p className='text-gray-600'>Your subscription status: {subscription?.status || 'Inactive'}</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Dashboard cards or components can be added here */}
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-lg font-semibold'>Portfolio Overview</h2>
          <p className='text-gray-600'>Details about your portfolio will go here.</p>
        </div>
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-lg font-semibold'>Learning Resources</h2>
          <p className='text-gray-600'>Access your learning materials and courses.</p>
        </div>
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-lg font-semibold'>Payment History</h2>
          <p className='text-gray-600'>View your payment transactions and history.</p>
        </div>
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-lg font-semibold'>Subscription Management</h2>
          <p className='text-gray-600'>Manage your subscription plans and settings.</p>
        </div>
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-lg font-semibold'>Account Settings</h2>
          <p className='text-gray-600'>Update your account information and preferences.</p>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
