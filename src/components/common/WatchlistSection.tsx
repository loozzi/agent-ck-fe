import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import WatchlistCard from './WatchlistCard'
import type { WatchlistDetailsResponse } from '@/types/watchlist'
import { Eye, Star, TrendingUp, TrendingDown, ListChecks } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface WatchlistSectionProps {
  watchlistDetail?: WatchlistDetailsResponse
  isLoading: boolean
  onViewChart?: (ticker: string) => void
  onToggleFavorite?: (itemId: string) => void
  onViewAll?: () => void
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({
  watchlistDetail,
  isLoading,
  onViewChart,
  onToggleFavorite,
  onViewAll
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <ListChecks className='h-5 w-5' />
            <span>Danh sách theo dõi</span>
          </CardTitle>
          <CardDescription>Cổ phiếu trong danh sách theo dõi của bạn</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='space-y-3'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-20 w-full' />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!watchlistDetail || !watchlistDetail.items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <ListChecks className='h-5 w-5' />
            <span>Danh sách theo dõi</span>
          </CardTitle>
          <CardDescription>Cổ phiếu trong danh sách theo dõi của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8 text-gray-500'>
            <ListChecks className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <p>Danh sách theo dõi trống</p>
            <p className='text-sm'>Thêm cổ phiếu để bắt đầu theo dõi</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get limited items for preview (first 4)
  const previewItems = watchlistDetail.items.slice(0, 4)
  const topPerformers = watchlistDetail.top_performers.slice(0, 2)
  const worstPerformers = watchlistDetail.worst_performers.slice(0, 2)

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center space-x-2 text-base'>
              <ListChecks className='h-4 w-4' />
              <span>Danh sách theo dõi</span>
            </CardTitle>
            <CardDescription className='text-xs'>
              {watchlistDetail.total_items} cổ phiếu • {watchlistDetail.favorites_count} yêu thích
            </CardDescription>
          </div>
          {watchlistDetail.total_items > 4 && (
            <Button variant='outline' size='sm' onClick={onViewAll} className='h-7 text-xs'>
              <Eye className='h-3 w-3 mr-1' />
              Xem tất cả
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Summary Stats */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='text-center p-2 bg-green-50 rounded-lg'>
            <div className='flex items-center justify-center gap-1 text-green-600 mb-1'>
              <TrendingUp className='h-3 w-3' />
              <span className='font-semibold text-xs'>Top</span>
            </div>
            <div className='text-xs text-muted-foreground'>
              {topPerformers.length > 0 ? topPerformers[0].ticker : 'N/A'}
            </div>
          </div>
          <div className='text-center p-2 bg-red-50 rounded-lg'>
            <div className='flex items-center justify-center gap-1 text-red-600 mb-1'>
              <TrendingDown className='h-3 w-3' />
              <span className='font-semibold text-xs'>Thấp nhất</span>
            </div>
            <div className='text-xs text-muted-foreground'>
              {worstPerformers.length > 0 ? worstPerformers[0].ticker : 'N/A'}
            </div>
          </div>
        </div>

        {/* Categories */}
        {watchlistDetail.categories.length > 0 && (
          <div className='space-y-2'>
            <h4 className='text-xs font-medium text-muted-foreground'>Danh mục:</h4>
            <div className='flex flex-wrap gap-1'>
              {watchlistDetail.categories.slice(0, 3).map((category, index) => (
                <Badge key={index} variant='secondary' className='text-xs px-1 py-0'>
                  {category}
                </Badge>
              ))}
              {watchlistDetail.categories.length > 3 && (
                <Badge variant='outline' className='text-xs px-1 py-0'>
                  +{watchlistDetail.categories.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Preview Items - Only show 2 items in compact mode */}
        <div className='space-y-2'>
          <h4 className='text-xs font-medium text-muted-foreground'>Cổ phiếu gần đây:</h4>
          <div className='grid gap-2'>
            {previewItems.slice(0, 2).map((item) => (
              <WatchlistCard key={item.id} item={item} onViewChart={onViewChart} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        </div>

        {/* Favorites Section */}
        {watchlistDetail.favorites_count > 0 && (
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <Star className='h-3 w-3 text-yellow-500' />
              <span className='text-xs font-medium text-muted-foreground'>
                {watchlistDetail.favorites_count} cổ phiếu yêu thích
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WatchlistSection
