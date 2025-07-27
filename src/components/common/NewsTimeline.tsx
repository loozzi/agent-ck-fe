import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { News } from '@/types/news'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Clock, ExternalLink } from 'lucide-react'

interface NewsTimelineProps {
  news: News[]
  isLoading?: boolean
  showImage?: boolean
}

const NewsTimeline = ({ news, isLoading, showImage = true }: NewsTimelineProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className='p-4 sm:p-6'>
          <CardTitle className='flex items-center space-x-2 text-base sm:text-lg'>
            <Clock className='h-4 w-4 sm:h-5 sm:w-5' />
            <span>Dòng thời gian tin tức</span>
          </CardTitle>
          <CardDescription className='text-sm'>Theo dõi tin tức theo thời gian thực</CardDescription>
        </CardHeader>
        <CardContent className='p-4 sm:p-6 pt-0'>
          <div className='space-y-3 sm:space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex space-x-3 sm:space-x-4 animate-pulse'>
                <div className='w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0'></div>
                <div className='flex-1 min-w-0'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort news by publish time (newest first)
  const sortedNews = [...news].sort((a, b) => new Date(b.publish_time).getTime() - new Date(a.publish_time).getTime())

  // Group news by date
  const groupedNews = sortedNews.reduce(
    (acc, item) => {
      const date = format(new Date(item.publish_time), 'yyyy-MM-dd')
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(item)
      return acc
    },
    {} as Record<string, News[]>
  )

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader className='p-4 sm:p-6'>
        <CardTitle className='flex items-center space-x-2 text-base sm:text-lg'>
          <Clock className='h-4 w-4 sm:h-5 sm:w-5' />
          <span>Dòng thời gian tin tức</span>
        </CardTitle>
        <CardDescription className='text-sm'>Theo dõi tin tức theo thời gian thực</CardDescription>
      </CardHeader>
      <CardContent className='p-4 sm:p-6 pt-0'>
        <ScrollArea className='h-[500px] sm:h-[600px]'>
          <div className='space-y-4 sm:space-y-6'>
            {Object.entries(groupedNews).map(([date, dayNews]) => (
              <div key={date} className='relative'>
                {/* Date Header */}
                <div className='sticky top-0 bg-background z-10 pb-2'>
                  <h3 className='text-sm font-semibold text-muted-foreground'>
                    {format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: vi })}
                  </h3>
                </div>

                {/* News Items */}
                <div className='space-y-3 sm:space-y-4 ml-3 sm:ml-4 border-l-2 border-muted pl-3 sm:pl-4'>
                  {dayNews.map((item, index) => (
                    <div key={item.id || index} className='relative'>
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-5 sm:-left-6 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getImportanceColor(item.importance)} ring-2 ring-background`}
                      />

                      {/* News Content */}
                      <div className='group cursor-pointer' onClick={() => window.open(item.url, '_blank')}>
                        <div className='flex items-start gap-3'>
                          {/* Image */}
                          {showImage && (
                            <div className='w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0'>
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.title}
                                  className='w-full h-full object-cover rounded-md'
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    const parent = target.parentElement
                                    if (parent) {
                                      parent.innerHTML =
                                        '<div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center"><svg class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>'
                                    }
                                  }}
                                />
                              ) : (
                                <div className='w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center'>
                                  <Clock className='h-4 w-4 text-blue-500' />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Content */}
                          <div className='flex items-start justify-between gap-2 flex-1 min-w-0'>
                            <div className='flex-1 min-w-0'>
                              <h4 className='text-sm font-medium line-clamp-2 group-hover:text-blue-600 leading-tight'>
                                {item.title}
                              </h4>
                              <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>{item.summary}</p>
                            </div>
                            <ExternalLink className='h-3 w-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0' />
                          </div>
                        </div>

                        <div className='flex flex-wrap items-center gap-1 sm:gap-2 mt-2'>
                          <Badge variant='outline' className='text-xs'>
                            {item.source}
                          </Badge>
                          <span className='text-xs text-muted-foreground'>
                            {format(new Date(item.publish_time), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default NewsTimeline
