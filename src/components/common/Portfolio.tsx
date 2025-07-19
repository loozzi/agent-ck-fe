import { Activity, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { WalletItem } from '@/types/portfolio'
import React from 'react'

interface PortfolioProps {
  filteredWallet: WalletItem[]
  formatCurrency: (value: number) => string
  formatNumber: (value: number) => string
  onTickerClick: (ticker: string) => void
}

const Portfolio: React.FC<PortfolioProps> = ({ filteredWallet, formatCurrency, formatNumber, onTickerClick }) => (
  <div className='mb-6'>
    <div className='flex items-center mb-3'>
      <h2 className='text-base font-semibold flex items-center gap-2'>
        <Activity className='w-4 h-4' />
        Danh mục đầu tư của bạn
      </h2>
    </div>
    <div className='space-y-2'>
      {filteredWallet.map((stock: WalletItem) => {
        const performance = ((stock.current_price - stock.avg_price) / stock.avg_price) * 100
        return (
          <div
            key={stock.id}
            className='flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-gray-100'
          >
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <div>
                  <button
                    onClick={() => onTickerClick(stock.ticker)}
                    className='font-bold text-blue-600 text-sm hover:text-blue-800 hover:underline cursor-pointer'
                  >
                    {stock.ticker}
                  </button>
                  <p className='text-xs text-gray-500'>{formatNumber(stock.quantity)} cổ phiếu</p>
                </div>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onTickerClick(stock.ticker)}
                  className='ml-2 p-1 h-6 w-6'
                >
                  <BarChart3 className='w-3 h-3' />
                </Button>
              </div>
            </div>
            <div className='text-right'>
              <p className='font-bold text-sm'>{formatCurrency(stock.current_price)}</p>
              <p className={`text-xs flex items-center gap-1 ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performance >= 0 ? <ArrowUpRight className='w-3 h-3' /> : <ArrowDownRight className='w-3 h-3' />}
                {performance >= 0 ? '+' : ''}
                {performance.toFixed(2)}%
              </p>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

export default Portfolio
