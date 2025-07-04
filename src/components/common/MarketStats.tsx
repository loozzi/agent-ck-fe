import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { News, NewsImportance } from '@/types/news'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface MarketStatsProps {
  news: News[]
  isLoading?: boolean
}

const MarketStats = ({ news, isLoading }: MarketStatsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thống kê thị trường</CardTitle>
          <CardDescription>Phân tích xu hướng tin tức</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
              <div className='h-2 bg-gray-200 rounded'></div>
            </div>
            <div className='animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
              <div className='h-2 bg-gray-200 rounded'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalNews = news.length
  const importanceStats = news.reduce(
    (acc, item) => {
      acc[item.importance] = (acc[item.importance] || 0) + 1
      return acc
    },
    {} as Record<NewsImportance, number>
  )

  const sourceStats = news.reduce(
    (acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const topSources = Object.entries(sourceStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const highImportancePercentage = totalNews > 0 ? ((importanceStats.high || 0) / totalNews) * 100 : 0
  const mediumImportancePercentage = totalNews > 0 ? ((importanceStats.medium || 0) / totalNews) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê thị trường</CardTitle>
        <CardDescription>Phân tích xu hướng tin tức chứng khoán</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Importance Distribution */}
        <div>
          <h4 className='text-sm font-medium mb-3'>Phân bố mức độ quan trọng</h4>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <TrendingUp className='h-4 w-4 text-red-500' />
                <span className='text-sm'>Tin quan trọng</span>
              </div>
              <span className='text-sm font-medium'>{importanceStats.high || 0} tin</span>
            </div>
            <Progress value={highImportancePercentage} className='h-2' />

            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <TrendingDown className='h-4 w-4 text-blue-500' />
                <span className='text-sm'>Tin trung bình</span>
              </div>
              <span className='text-sm font-medium'>{importanceStats.medium || 0} tin</span>
            </div>
            <Progress value={mediumImportancePercentage} className='h-2' />
          </div>
        </div>

        {/* Top Sources */}
        <div>
          <h4 className='text-sm font-medium mb-3'>Nguồn tin hàng đầu</h4>
          <div className='space-y-2'>
            {topSources.map(([source, count]) => (
              <div key={source} className='flex items-center justify-between'>
                <span className='text-sm truncate'>{source}</span>
                <span className='text-sm font-medium text-muted-foreground'>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600'>{totalNews}</div>
            <div className='text-xs text-muted-foreground'>Tổng tin tức</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600'>{topSources.length}</div>
            <div className='text-xs text-muted-foreground'>Nguồn tin</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MarketStats
