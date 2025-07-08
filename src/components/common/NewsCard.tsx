import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { News, NewsImportance } from '@/types/news'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ExternalLink, TrendingUp } from 'lucide-react'

interface NewsCardProps {
  news: News
  variant?: 'default' | 'compact' | 'featured'
}

const getImportanceBadge = (importance: NewsImportance) => {
  switch (importance) {
    case 'high':
      return <Badge variant='destructive'>Quan trọng</Badge>
    case 'medium':
      return <Badge variant='secondary'>Trung bình</Badge>
    case 'low':
      return <Badge variant='outline'>Thấp</Badge>
    default:
      return null
  }
}

const NewsCard = ({ news, variant = 'default' }: NewsCardProps) => {
  const publishTime = formatDistanceToNow(new Date(news.publish_time), {
    addSuffix: true,
    locale: vi
  })

  if (variant === 'compact') {
    return (
      <Card className='hover:shadow-md transition-shadow cursor-pointer'>
        <CardContent className='p-3 sm:p-4'>
          <div className='flex items-start space-x-2 sm:space-x-3'>
            {/* Image for compact variant */}
            <div className='flex-shrink-0'>
              {news.image_url ? (
                <img
                  src={news.image_url}
                  alt={news.title}
                  className='w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML =
                        '<div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center"><svg class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>'
                    }
                  }}
                />
              ) : (
                <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center'>
                  <TrendingUp className='h-4 w-4 text-blue-500' />
                </div>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-medium line-clamp-2 hover:text-blue-600 leading-tight'>{news.title}</h3>
              <div className='flex flex-wrap items-center gap-1 sm:gap-2 mt-2'>
                <Badge variant='outline' className='text-xs shrink-0'>
                  {news.source}
                </Badge>
                {getImportanceBadge(news.importance)}
                <span className='text-xs text-gray-500 hidden sm:inline'>{publishTime}</span>
              </div>
              <div className='sm:hidden mt-1'>
                <span className='text-xs text-gray-500'>{publishTime}</span>
              </div>
            </div>
            <ExternalLink className='h-4 w-4 text-gray-400 hover:text-blue-500 flex-shrink-0' />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className='hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500'>
        <div className='flex'>
          {/* Image for featured variant */}
          <div className='w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0'>
            {news.image_url ? (
              <img
                src={news.image_url}
                alt={news.title}
                className='w-full h-full object-cover rounded-l-lg'
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML =
                      '<div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-l-lg flex items-center justify-center"><svg class="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>'
                  }
                }}
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-l-lg flex items-center justify-center'>
                <TrendingUp className='h-6 w-6 sm:h-8 sm:w-8 text-blue-500' />
              </div>
            )}
          </div>
          <div className='flex-1'>
            <CardHeader className='pb-3 p-3 sm:p-6'>
              <div className='flex items-start justify-between gap-3'>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='text-base sm:text-lg line-clamp-2 hover:text-blue-600 leading-tight'>
                    {news.title}
                  </CardTitle>
                  <CardDescription className='mt-2 line-clamp-2 sm:line-clamp-3 text-sm'>
                    {news.summary}
                  </CardDescription>
                </div>
                <ExternalLink className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-blue-500 flex-shrink-0 mt-1' />
              </div>
            </CardHeader>
            <CardContent className='pt-0 px-3 pb-3 sm:px-6 sm:pb-4'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex flex-wrap items-center gap-1 sm:gap-2'>
                  <Badge variant='outline' className='text-xs'>
                    {news.source}
                  </Badge>
                  {getImportanceBadge(news.importance)}
                </div>
                <span className='text-xs sm:text-sm text-gray-500 whitespace-nowrap'>{publishTime}</span>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className='hover:shadow-md transition-shadow cursor-pointer'>
      <div className='flex'>
        {/* Image for default variant */}
        <div className='w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0'>
          {news.image_url ? (
            <img
              src={news.image_url}
              alt={news.title}
              className='w-full h-full object-cover rounded-l-lg'
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML =
                    '<div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-l-lg flex items-center justify-center"><svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>'
                }
              }}
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-l-lg flex items-center justify-center'>
              <TrendingUp className='h-5 w-5 sm:h-6 sm:w-6 text-blue-500' />
            </div>
          )}
        </div>
        <div className='flex-1'>
          <CardHeader className='p-3 sm:p-6'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex-1 min-w-0'>
                <CardTitle className='text-sm sm:text-base line-clamp-2 hover:text-blue-600 leading-tight'>
                  {news.title}
                </CardTitle>
                <CardDescription className='mt-1 line-clamp-2 text-sm'>{news.summary}</CardDescription>
              </div>
              <ExternalLink className='h-4 w-4 text-gray-400 hover:text-blue-500 flex-shrink-0 mt-1' />
            </div>
          </CardHeader>
          <CardContent className='pt-0 px-3 pb-3 sm:px-6 sm:pb-4'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <div className='flex flex-wrap items-center gap-1 sm:gap-2'>
                <Badge variant='outline' className='text-xs'>
                  {news.source}
                </Badge>
                {getImportanceBadge(news.importance)}
              </div>
              <span className='text-xs sm:text-sm text-gray-500 whitespace-nowrap'>{publishTime}</span>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export default NewsCard
