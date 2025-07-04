import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Stock } from '@/types/stock'

interface StockCardProps {
  data: Stock
}

const StockCard = ({ data }: StockCardProps) => {
  // Tính toán % thay đổi (giả sử so với open price)
  const priceChange = data.close - data.open
  const priceChangePercent = ((priceChange / data.open) * 100).toFixed(2)
  const isPositive = priceChange > 0
  const isNeutral = priceChange === 0

  // Format số với dấu phẩy
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  // Format volume với đơn vị K, M
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toString()
  }

  // Format thời gian
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return (
        date.toLocaleDateString('vi-VN') +
        ' ' +
        date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      )
    } catch {
      return timeString
    }
  }

  return (
    <Card className='hover:shadow-md transition-shadow duration-200 cursor-pointer w-full'>
      <CardContent className='p-3'>
        {/* Header với ticker và exchange */}
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-bold text-base text-primary'>{data.ticker}</h3>
          <Badge variant='outline' className='text-xs px-1.5 py-0.5'>
            {data.exchange}
          </Badge>
        </div>

        {/* Tên công ty */}
        <p className='text-xs text-muted-foreground truncate mb-3'>{data.name}</p>

        {/* Giá hiện tại */}
        <div className='text-xl font-bold mb-1'>
          {formatNumber(data.close)}
          <span className='text-xs font-normal text-muted-foreground ml-1'>VNĐ</span>
        </div>

        {/* Biến động */}
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive
              ? 'text-green-600 dark:text-green-400'
              : isNeutral
                ? 'text-gray-600 dark:text-gray-400'
                : 'text-red-600 dark:text-red-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp className='w-3 h-3' />
          ) : isNeutral ? (
            <Minus className='w-3 h-3' />
          ) : (
            <TrendingDown className='w-3 h-3' />
          )}
          <span>
            {isPositive ? '+' : ''}
            {formatNumber(priceChange)}({isPositive ? '+' : ''}
            {priceChangePercent}%)
          </span>
        </div>

        {/* Volume - thông tin bổ sung nhỏ gọn */}
        <div className='mt-2 pt-2 border-t border-gray-100 dark:border-gray-800'>
          <div className='flex justify-between items-center text-xs text-muted-foreground'>
            <span>KL: {formatVolume(data.volume)}</span>
            <span>{formatTime(data.time).split(' ')[1]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StockCard
