import { useEffect } from 'react'
import { Calendar, Clock, TrendingUp, ExternalLink } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hook'
import { fetchLatestNews } from '@/slices/news.slice'
import type { News } from '@/types/news'

const NewsSection = () => {
  const dispatch = useAppDispatch()
  const { latestNews, isLoading, error } = useAppSelector((state) => state.news)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      // Dispatch fetchLatestNews action with limit parameter
      await dispatch(fetchLatestNews({ limit: 8 })).unwrap()
    } catch (err) {
      console.warn('Failed to fetch news from Redux:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Use data from Redux or fallback
  const displayNews = latestNews.length > 0 ? latestNews : []

  if (isLoading) {
    return (
      <section id='news-section' className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Đang tải tin tức...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='news-section' className='py-16 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center mb-4'>
            <TrendingUp className='h-8 w-8 text-blue-600 mr-2' />
            <h2 className='text-3xl font-bold text-gray-900'>Tin tức Chứng khoán</h2>
          </div>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Cập nhật những tin tức mới nhất về thị trường chứng khoán Việt Nam và thế giới
          </p>
        </div>

        {/* News Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {displayNews.map((article: News) => (
            <div
              key={article.id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
              {/* Clickable image for news articles */}
              <a
                href={article.url}
                target='_blank'
                rel='noopener noreferrer'
                className='block h-48 overflow-hidden hover:opacity-90 transition-opacity duration-200'
              >
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      // Fallback to default gradient background with icon if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.className =
                          'flex h-48 bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center hover:from-blue-200 hover:to-blue-300 transition-colors duration-200'
                        parent.innerHTML =
                          '<svg class="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>'
                      }
                    }}
                  />
                ) : (
                  <div className='flex h-48 bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center hover:from-blue-200 hover:to-blue-300 transition-colors duration-200'>
                    <TrendingUp className='h-12 w-12 text-blue-600' />
                  </div>
                )}
              </a>

              <div className='p-4'>
                <div className='flex items-center text-sm text-gray-500 mb-2'>
                  <Calendar className='h-4 w-4 mr-1' />
                  <span>{formatDate(article.publish_time)}</span>
                </div>

                <a
                  href={article.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block hover:text-blue-600 transition-colors duration-200'
                >
                  <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600'>{article.title}</h3>
                </a>

                <p className='text-gray-600 text-sm mb-3 line-clamp-3'>{article.summary}</p>

                <div className='flex items-center justify-between'>
                  <span className='text-xs text-blue-600 font-medium'>{article.source}</span>
                  <a
                    href={article.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:text-blue-800 transition-colors duration-200'
                  >
                    <ExternalLink className='h-4 w-4' />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className='text-center mt-12'>
          <button
            onClick={fetchNews}
            className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200'
          >
            <Clock className='h-5 w-5 mr-2' />
            Tải thêm tin tức
          </button>
        </div>

        {error && (
          <div className='mt-8 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-600'>Lỗi: {error}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default NewsSection
