import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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

interface StockDetailsDialogProps {
  item: WalletItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StockDetailsDialog = ({ item, open, onOpenChange }: StockDetailsDialogProps) => {
  if (!item) return null

  const quantity = item.quantity || 0
  const avgPrice = item.avg_price || 0
  const currentPrice = item.current_price || 0

  const totalValue = quantity * currentPrice
  const profitLoss = (currentPrice - avgPrice) * quantity
  const profitLossPercentage = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0
  const isProfit = profitLoss >= 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            {item.ticker}
            {item.recommended && (
              <Badge
                variant='secondary'
                className='bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300'
              >
                <Sparkles className='w-3 h-3 mr-1' />
                AI Gợi ý
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>Chi tiết thông tin cổ phiếu trong danh mục của bạn</DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Performance Badge */}
          <div className='flex justify-center'>
            <Badge
              variant={isProfit ? 'default' : 'destructive'}
              className={`${
                isProfit ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              } text-white text-lg py-2 px-4`}
            >
              {isProfit ? <TrendingUp className='w-4 h-4 mr-2' /> : <TrendingDown className='w-4 h-4 mr-2' />}
              {profitLossPercentage.toFixed(2)}%
            </Badge>
          </div>

          {/* Stock Information Grid */}
          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Số lượng cổ phiếu</p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{quantity.toLocaleString()}</p>
              </div>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Giá trung bình</p>
                <p className='text-xl font-semibold text-gray-900 dark:text-gray-100'>${avgPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Tổng giá trị</p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>${totalValue.toLocaleString()}</p>
              </div>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Giá hiện tại</p>
                <p
                  className={`text-xl font-semibold ${
                    isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  ${currentPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Profit/Loss Summary */}
          <div
            className={`p-4 rounded-lg border-2 ${
              isProfit
                ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
            }`}
          >
            <div className='flex justify-between items-center'>
              <span className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                {isProfit ? 'Lãi' : 'Lỗ'} tổng:
              </span>
              <span
                className={`text-2xl font-bold ${
                  isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
              </span>
            </div>
          </div>

          {/* AI Recommendation */}
          {item.recommended && (
            <div className='p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'>
                <Sparkles className='w-5 h-5 text-purple-600' />
                <span className='font-semibold text-purple-700 dark:text-purple-300'>Gợi ý từ AI</span>
              </div>
              <p className='text-sm text-purple-600 dark:text-purple-400'>
                Cổ phiếu này được AI khuyến nghị dựa trên phân tích thị trường và xu hướng hiện tại.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StockDetailsDialog
