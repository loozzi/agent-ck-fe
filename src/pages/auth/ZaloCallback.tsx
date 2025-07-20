import { useAppDispatch, useAppSelector } from '@/app/hook'
import { zaloCompleteLogin } from '@/slices/auth.slice'
import { getZaloData, sendZaloCode } from '@/slices/zalo.slice'
import { useEffect } from 'react'
import ZaloIcon from '@/assets/zalo.png'

const ZaloCallback = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const { zaloResponse, userData } = useAppSelector((state) => state.zalo)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
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

      dispatch(sendZaloCode({ code, state }))
    }
  }, [code, state, error])

  useEffect(() => {
    if (zaloResponse) {
      const { client_api_info } = zaloResponse
      const { access_token } = client_api_info

      dispatch(getZaloData({ access_token }))
    }
  }, [zaloResponse])

  useEffect(() => {
    if (userData && state && code) {
      dispatch(
        zaloCompleteLogin({
          oauth_data: {
            authorization_code: code,
            state: state
          },
          user_info: userData
        })
      )
    }
  }, [userData])

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/'
    }
  }, [isAuthenticated])

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
