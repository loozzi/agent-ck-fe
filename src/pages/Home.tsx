import { useAppSelector } from '@/app/hook'
import Header from '@/components/layouts/Header'
import HeroSection from '@/components/common/HeroSection'
import NewsSection from '@/components/common/NewsSection'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    const role = user?.role

    if (role === 'admin') {
      navigate('/admin/dashboard')
    } else if (role === 'trainer') {
      navigate('/trainer/dashboard')
    }
  }, [user, navigate])

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <main className='pt-14'>
        <div
          className='fixed bottom-4 right-4 z-50'
          dangerouslySetInnerHTML={{
            __html: `<div
          class="zalo-follow-button"
          data-oaid="4412053929170802954"
          data-cover="no"
          data-article=""
          data-width="350"
          data-height="420"
        ></div>`
          }}
        />
        <HeroSection />
        <NewsSection />
      </main>
    </div>
  )
}

export default Home
