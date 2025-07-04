import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Minus, Plus, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface WalletItem {
  id: string
  ticker: string
  quantity?: number
  avg_price?: number
  current_price?: number
  recommended?: boolean
}

interface WalletCardProps {
  item: WalletItem
  onBuy?: (ticker: string) => void
  onSell?: (ticker: string) => void
}

const WalletCard = ({ item, onBuy, onSell }: WalletCardProps) => {
  const quantity = item.quantity || 0
  const avgPrice = item.avg_price || 0
  const currentPrice = item.current_price || 0

  const totalValue = quantity * currentPrice
  const profitLoss = (currentPrice - avgPrice) * quantity
  const profitLossPercentage = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0
  const isProfit = profitLoss >= 0

  // Format currency with ,000 suffix and đ symbol

  return (
    <Card
      className={`border-l-4 relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        isProfit
          ? 'border-l-green-500 bg-green-50 dark:bg-green-950/20'
          : 'border-l-red-500 bg-red-50 dark:bg-red-950/20'
      } ${
        item.recommended
          ? 'ring-2 ring-purple-200 dark:ring-purple-800 shadow-lg shadow-purple-100 dark:shadow-purple-900/20'
          : ''
      }`}
    >
      {/* AI Recommendation Corner Badge */}
      {item.recommended && (
        <div className='absolute -top-2 -right-2 z-10'>
          <div className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-md flex items-center gap-1'>
            <Sparkles className='w-3 h-3' />
            <span className='font-medium'>AI</span>
          </div>
        </div>
      )}
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text- font-bold text-gray-900 dark:text-gray-100'>{item.ticker}</CardTitle>
            {item.recommended && (
              <Badge
                variant='secondary'
                className='bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300'
              >
                <Sparkles className='w-3 h-3 mr-1' />
                AI Gợi ý
              </Badge>
            )}
          </div>
          <Badge
            variant={isProfit ? 'default' : 'destructive'}
            className={`${isProfit ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
          >
            {isProfit ? <TrendingUp className='w-3 h-3 mr-1' /> : <TrendingDown className='w-3 h-3 mr-1' />}
            {profitLossPercentage.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4 pb-2'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Số lượng</p>
            <p className='font-semibold text-gray-900 dark:text-gray-100'>{quantity.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Giá trị</p>
            <p className='font-semibold text-gray-900 dark:text-gray-100'>{formatCurrency(totalValue)}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Giá TB</p>
            <p className='font-semibold text-gray-900 dark:text-gray-100'>{formatCurrency(avgPrice)}</p>
          </div>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Giá hiện tại</p>
            <p
              className={`font-semibold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              {formatCurrency(currentPrice)}
            </p>
          </div>
        </div>

        <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-center'>
            <span className='text-gray-600 dark:text-gray-400 text-sm'>Lãi/Lỗ:</span>
            <span
              className={`font-bold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              {isProfit ? '+' : ''}
              {formatCurrency(profitLoss)}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='pt-4 border-t border-gray-200 dark:border-gray-700 mt-2'>
          <div className='grid grid-cols-2 gap-1.5 sm:gap-2'>
            {/* Buy Button */}
            <Button
              size='sm'
              variant='outline'
              onClick={() => onBuy?.(item.ticker)}
              className='cursor-pointer bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-800/60 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600 transition-all duration-200 flex flex-col items-center gap-1 h-11 sm:h-12 p-1.5 sm:p-2 rounded-md'
            >
              <Plus className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
              <span className='text-[10px] sm:text-xs font-medium'>Mua thêm</span>
            </Button>

            {/* Sell Button */}
            <Button
              size='sm'
              variant='outline'
              onClick={() => onSell?.(item.ticker)}
              className='cursor-pointer bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/40 dark:hover:bg-orange-800/60 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-200 flex flex-col items-center gap-1 h-11 sm:h-12 p-1.5 sm:p-2 rounded-md'
            >
              <Minus className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
              <span className='text-[10px] sm:text-xs font-medium'>Bán bớt</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WalletCard
