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
            <div className='flex-shrink-0 mt-1 hidden sm:block'>
              <TrendingUp className='h-4 w-4 text-blue-500' />
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
        <CardHeader className='pb-3 p-3 sm:p-6'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex-1 min-w-0'>
              <CardTitle className='text-base sm:text-lg line-clamp-2 hover:text-blue-600 leading-tight'>
                {news.title}
              </CardTitle>
              <CardDescription className='mt-2 line-clamp-2 sm:line-clamp-3 text-sm'>{news.summary}</CardDescription>
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
      </Card>
    )
  }

  return (
    <Card className='hover:shadow-md transition-shadow cursor-pointer'>
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
    </Card>
  )
}

export default NewsCard
