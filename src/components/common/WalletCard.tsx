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
        <div className='absolute -top-2 -right-3 z-10'>
          <div className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-0.5 rounded-full shadow-md flex items-center gap-0.5'>
            <Sparkles className='w-2 h-2' />
            <span className='text-[12px] font-medium'>AI</span>
          </div>
        </div>
      )}
      <CardHeader className='pb-1 pt-2 px-3'>
        <div className='flex items-center justify-between mb-1'>
          <div className='flex items-center gap-1'>
            <CardTitle className='text-base font-bold text-gray-900 dark:text-gray-100'>{item.ticker}</CardTitle>
            {item.recommended && (
              <Badge
                variant='secondary'
                className='bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 text-[10px] px-1 py-0.5'
              >
                <Sparkles className='w-2 h-2 mr-0.5' />
                AI
              </Badge>
            )}
          </div>
          <Badge
            variant={isProfit ? 'default' : 'destructive'}
            className={`${isProfit ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white text-[10px] px-1 py-0.5`}
          >
            {isProfit ? <TrendingUp className='w-2 h-2 mr-0.5' /> : <TrendingDown className='w-2 h-2 mr-0.5' />}
            {profitLossPercentage.toFixed(1)}%
          </Badge>
        </div>

        {/* Compact info display */}
        <div className='grid grid-cols-2 gap-2 text-xs'>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>SL:</span>
            <span className='font-semibold'>{quantity.toLocaleString()}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>GT:</span>
            <span className='font-semibold'>{formatCurrency(totalValue)}</span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2 text-xs mt-0.5'>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>TB:</span>
            <span className='font-semibold'>{formatCurrency(avgPrice)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>HT:</span>
            <span
              className={`font-semibold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              {formatCurrency(currentPrice)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className='px-3 pb-2'>
        {/* Profit/Loss */}
        <div className='flex items-center justify-between mb-2'>
          <span className='text-gray-600 dark:text-gray-400 text-xs'>L/L:</span>
          <span
            className={`font-bold text-xs ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            {isProfit ? '+' : ''}
            {formatCurrency(profitLoss)}
          </span>
        </div>

        {/* Actions */}
        <div className='grid grid-cols-2 gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => onBuy?.(item.ticker)}
            className='cursor-pointer bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-800/60 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600 transition-all duration-200 flex items-center justify-center gap-0.5 h-6 px-1.5 rounded-md'
          >
            <Plus className='w-2.5 h-2.5' />
            <span className='text-[10px] font-medium'>Mua</span>
          </Button>

          <Button
            size='sm'
            variant='outline'
            onClick={() => onSell?.(item.ticker)}
            className='cursor-pointer bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/40 dark:hover:bg-orange-800/60 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-200 flex items-center justify-center gap-0.5 h-6 px-1.5 rounded-md'
          >
            <Minus className='w-2.5 h-2.5' />
            <span className='text-[10px] font-medium'>Bán</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WalletCard
