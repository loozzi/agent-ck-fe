import { useEffect } from 'react'

const ZaloCallback = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  useEffect(() => {
    if (error) {
      console.error('Zalo OAuth error:', error)
      return
    }

    if (code) {
      // Handle successful authorization code
      console.log('Authorization code:', code)
      console.log('State:', state)
    }
  }, [code, state, error])

  return <div>ZaloCallback</div>
}

export default ZaloCallback
