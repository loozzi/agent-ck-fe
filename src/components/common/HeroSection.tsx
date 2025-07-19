import { useAppDispatch } from '@/app/hook'
import { fetchStockByTicker } from '@/slices/stock.slice'
import { ArrowRight, BarChart3, Shield, TrendingUp, Users } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const HeroSection = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Fetch VN-Index and HNX-Index data
    dispatch(fetchStockByTicker('VNINDEX'))
    dispatch(fetchStockByTicker('HNXINDEX'))
  }, [dispatch])

  const scrollToNews = () => {
    const newsSection = document.getElementById('news-section')
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className='relative bg-white text-gray-900 overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
        <div className='text-center'>
          {/* Main Heading */}
          <h1 className='text-4xl md:text-6xl font-bold mb-6 text-gray-900'>
            Đầu tư Chứng khoán
            <span className='block text-blue-600'>Thông minh & Hiệu quả</span>
          </h1>

          {/* Sub Heading */}
          <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto'>
            Nền tảng đầu tư chứng khoán hàng đầu với công cụ phân tích chuyên sâu, tin tức cập nhật và hệ thống đào tạo
            toàn diện
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-16'>
            <NavLink
              to='/dashboard'
              className='inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              Bắt đầu đầu tư
              <ArrowRight className='ml-2 h-5 w-5' />
            </NavLink>

            <button
              onClick={scrollToNews}
              className='inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200'
            >
              Xem tin tức
              <TrendingUp className='ml-2 h-5 w-5' />
            </button>
          </div>

          {/* Features */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4'>
                <BarChart3 className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900'>Phân tích Chuyên sâu</h3>
              <p className='text-gray-600'>Công cụ phân tích kỹ thuật và cơ bản hàng đầu</p>
            </div>

            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4'>
                <Shield className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900'>Bảo mật Tối đa</h3>
              <p className='text-gray-600'>Hệ thống bảo mật đa lớp, bảo vệ tài sản của bạn</p>
            </div>

            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4'>
                <Users className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold mb-2 text-gray-900'>Cộng đồng Chuyên gia</h3>
              <p className='text-gray-600'>Kết nối với cộng đồng nhà đầu tư chuyên nghiệp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
