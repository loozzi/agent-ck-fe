import { useAppSelector } from '@/app/hook'
import HeroSection from '@/components/common/HeroSection'
import NewsSection from '@/components/common/NewsSection'
import SubscriptionSection from '@/components/common/SubscriptionSection'
import Header from '@/components/layouts/Header'
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
        <HeroSection />
        <SubscriptionSection />
        <NewsSection />
      </main>
    </div>
  )
}

export default Home
