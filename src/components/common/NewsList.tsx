import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { News } from '@/types/news'
import { Clock, TrendingUp } from 'lucide-react'
import NewsCard from './NewsCard'

interface NewsListProps {
  news: News[]
  title: string
  description?: string
  variant?: 'default' | 'compact' | 'featured'
  showViewMore?: boolean
  isLoading?: boolean
}

const NewsList = ({
  news,
  title,
  description,
  variant = 'default',
  showViewMore = false,
  isLoading = false
}: NewsListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className='p-4 sm:p-6'>
          <CardTitle className='flex items-center space-x-2 text-base sm:text-lg'>
            <TrendingUp className='h-4 w-4 sm:h-5 sm:w-5' />
            <span>{title}</span>
          </CardTitle>
          {description && <CardDescription className='text-sm mt-1'>{description}</CardDescription>}
        </CardHeader>
        <CardContent className='p-4 sm:p-6 pt-0'>
          <div className='space-y-3 sm:space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-1/2'></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (news.length === 0) {
    return (
      <Card>
        <CardHeader className='p-4 sm:p-6'>
          <CardTitle className='flex items-center space-x-2 text-base sm:text-lg'>
            <TrendingUp className='h-4 w-4 sm:h-5 sm:w-5' />
            <span>{title}</span>
          </CardTitle>
          {description && <CardDescription className='text-sm mt-1'>{description}</CardDescription>}
        </CardHeader>
        <CardContent className='p-4 sm:p-6 pt-0'>
          <div className='text-center py-8 text-gray-500'>
            <Clock className='h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300' />
            <p className='text-sm'>Không có tin tức nào</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='p-4 sm:p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center space-x-2 text-base sm:text-lg'>
              <TrendingUp className='h-4 w-4 sm:h-5 sm:w-5' />
              <span>{title}</span>
            </CardTitle>
            {description && <CardDescription className='text-sm mt-1'>{description}</CardDescription>}
          </div>
          <Badge variant='secondary' className='text-xs'>
            {news.length} tin
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='p-4 sm:p-6 pt-0'>
        <ScrollArea className={variant === 'compact' ? 'h-[350px] sm:h-[400px]' : 'h-[450px] sm:h-[500px]'}>
          <div className='space-y-3 sm:space-y-4'>
            {news.map((item, index) => (
              <div key={item.id || index} onClick={() => window.open(item.url, '_blank')}>
                <NewsCard news={item} variant={variant} />
              </div>
            ))}
          </div>
        </ScrollArea>
        {showViewMore && (
          <div className='mt-4 text-center'>
            <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>Xem thêm tin tức →</button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NewsList
