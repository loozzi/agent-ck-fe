import { useAppDispatch, useAppSelector } from '@/app/hook'
import ZaloIcon from '@/assets/zalo.png'
import { zaloSignInAction } from '@/slices/auth.slice'
import { useEffect } from 'react'

const ZaloCallback = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  useEffect(() => {
    if (error) {
      console.error('Zalo OAuth error:', error)
      return
    }

    if (code && state) {
      console.log('Zalo code:', code)
      console.log('Zalo state:', state)

      dispatch(zaloSignInAction({ code, state }))
    }
  }, [code, state, error])

  useEffect(() => {
    if (isAuthenticated && user?.onboarding_completed) {
      window.location.href = '/dashboard'
    } else if (isAuthenticated && !user?.onboarding_completed && user?.role === 'user') {
      window.location.href = '/survey'
    }
  }, [isAuthenticated, user])

  return (
    <div className='flex flex-col items-center justify-center min-h-[300px] py-12'>
      <img src={ZaloIcon} alt='Zalo Icon' className='h-12 w-12 mb-4' />
      <div className='flex items-center'>
        <svg
          className='animate-spin h-8 w-8 text-blue-600'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
        </svg>
        <span className='ml-4 text-blue-600 font-medium text-lg'>Đang xác thực tài khoản Zalo...</span>
      </div>
    </div>
  )
}

export default ZaloCallback
