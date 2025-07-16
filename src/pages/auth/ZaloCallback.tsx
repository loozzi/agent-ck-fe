import { useAppDispatch, useAppSelector } from '@/app/hook'
import { zaloCompleteLogin } from '@/slices/auth.slice'
import { getZaloData, sendZaloCode } from '@/slices/zalo.slice'
import { useEffect } from 'react'

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

  return <div>Đang xác thực tài khoản...</div>
}

export default ZaloCallback
