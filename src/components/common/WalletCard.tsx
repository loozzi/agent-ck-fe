import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react'

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
}

const WalletCard = ({ item }: WalletCardProps) => {
  const quantity = item.quantity || 0
  const avgPrice = item.avg_price || 0
  const currentPrice = item.current_price || 0
  
  const totalValue = quantity * currentPrice
  const profitLoss = (currentPrice - avgPrice) * quantity
  const profitLossPercentage = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0
  const isProfit = profitLoss >= 0

  return (
    <Card
      className={`border-l-4 relative ${
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
            <CardTitle className='text-lg font-bold text-gray-900 dark:text-gray-100'>{item.ticker}</CardTitle>
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
      <CardContent className='space-y-3'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Số lượng</p>
            <p className='font-semibold text-gray-900 dark:text-gray-100'>{quantity.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Giá trị</p>
            <p className='font-semibold text-gray-900 dark:text-gray-100'>${totalValue.toLocaleString()}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Giá TB</p>
            <p className='font-semibold text-gray-900 dark:text-gray-100'>${avgPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Giá hiện tại</p>
            <p
              className={`font-semibold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              ${currentPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-center'>
            <span className='text-gray-600 dark:text-gray-400 text-sm'>Lãi/Lỗ:</span>
            <span
              className={`font-bold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WalletCard
