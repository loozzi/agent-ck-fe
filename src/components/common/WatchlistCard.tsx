import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { WatchlistItem } from '@/types/watchlist'
import { ArrowUpRight, ArrowDownRight, Star, TrendingUp, TrendingDown, Eye } from 'lucide-react'
import React from 'react'

interface WatchlistCardProps {
  item: WatchlistItem
  onViewChart?: (ticker: string) => void
  onToggleFavorite?: (itemId: string) => void
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({ item, onViewChart, onToggleFavorite }) => {
  const isPositive = item.performance_since_added >= 0
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
  const changeIcon = isPositive ? ArrowUpRight : ArrowDownRight

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-base font-bold flex items-center gap-2'>
              {item.ticker}
              {item.is_favorite && (
                <Star
                  className='h-3 w-3 text-yellow-500 fill-current cursor-pointer'
                  onClick={() => onToggleFavorite?.(item.id)}
                />
              )}
            </CardTitle>
            <CardDescription className='text-xs line-clamp-1'>{item.company_name}</CardDescription>
          </div>
          <div className='text-right'>
            <div className='font-semibold text-sm'>{formatCurrency(item.price_info.current_price)}</div>
            <div className={`flex items-center gap-1 text-xs font-medium ${changeColor}`}>
              {React.createElement(changeIcon, { className: 'h-3 w-3' })}
              {formatPercent(item.price_info.change_percent)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-2 pt-0'>
        {/* Price Information */}
        <div className='grid grid-cols-2 gap-2 text-xs'>
          <div>
            <span className='text-muted-foreground'>Giá thêm:</span>
            <div className='font-medium'>{formatCurrency(item.added_price)}</div>
          </div>
          <div>
            <span className='text-muted-foreground'>Mục tiêu:</span>
            <div className='font-medium'>{formatCurrency(item.target_price)}</div>
          </div>
        </div>

        {/* Performance */}
        <div className='p-2 bg-muted/50 rounded-lg'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Hiệu suất:</span>
            <div className={`flex items-center gap-1 font-semibold text-xs ${changeColor}`}>
              {isPositive ? <TrendingUp className='h-3 w-3' /> : <TrendingDown className='h-3 w-3' />}
              {formatPercent(item.performance_since_added)}
            </div>
          </div>
        </div>

        {/* Tags and Category - Simplified */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            {item.category && (
              <Badge variant='secondary' className='text-xs px-1 py-0'>
                {item.category}
              </Badge>
            )}
            {item.tags.length > 0 && (
              <Badge variant='outline' className='text-xs px-1 py-0'>
                {item.tags.length} tags
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <div className='text-xs text-muted-foreground'>{item.days_in_watchlist}d</div>
            <Button variant='ghost' size='sm' onClick={() => onViewChart?.(item.ticker)} className='h-6 text-xs px-2'>
              <Eye className='h-3 w-3' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WatchlistCard
