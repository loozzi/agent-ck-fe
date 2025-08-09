import { BarChart3, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StockChart from '@/components/common/StockChart'
import { useMemo } from 'react'
import React from 'react'

import type { Analysis } from '@/types/analysis.types'

interface AIRecommendationsProps {
  recommendations: Analysis[]
  recommendationLoading: boolean
  recommendationError: string | null
  openRecChart: string | null
  setOpenRecChart: (ticker: string | null) => void
  formatCurrency?: (value: number) => string
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  recommendationLoading,
  recommendationError,
  openRecChart,
  setOpenRecChart,
  formatCurrency
}) => {
  // Default currency formatter if not provided
  const currencyFormatter = useMemo(
    () => formatCurrency || ((value: number) => `${value.toLocaleString('vi-VN')}đ`),
    [formatCurrency]
  )
  return (
    <div className='space-y-3 pb-12'>
      <div className='bg-white/10 rounded-lg p-4 backdrop-blur-sm'>
        {recommendationLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='w-4 h-4 animate-spin mr-2' />
            <span className='text-sm text-purple-100'>Đang tải gợi ý AI...</span>
          </div>
        ) : recommendationError ? (
          <div className='text-center py-8 text-purple-100'>
            <p className='text-sm'>Không thể tải gợi ý AI: {recommendationError}</p>
          </div>
        ) : !recommendations || recommendations.length === 0 ? (
          <div className='text-center py-8 text-purple-100'>
            <p className='text-sm'>Chưa có gợi ý AI nào cho bạn.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {recommendations.slice(0, 5).map((rec, idx) => (
              <div
                key={rec.id || rec.ticker + idx}
                className='bg-white/10 rounded-xl p-4 flex flex-col gap-2 shadow-sm'
              >
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='font-bold text-lg text-white'>{rec.ticker}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${rec.signal === 'BUY' ? 'bg-green-600' : rec.signal === 'SELL' ? 'bg-red-600' : 'bg-yellow-400 text-gray-900'}`}
                    >
                      {rec.signal === 'BUY' ? 'MUA' : rec.signal === 'SELL' ? 'BÁN' : 'GIỮ'}
                    </span>
                    <span className='ml-2 text-xs text-white/80'>Độ tin cậy: {rec.confidence ?? '-'}</span>
                  </div>
                  <div className='flex flex-col sm:items-end items-start'>
                    <span className='font-bold text-xl text-white'>
                      {rec.entry_price ? currencyFormatter(rec.entry_price) : '-'}
                    </span>
                  </div>
                </div>
                <div className='flex flex-wrap gap-2 text-xs text-white/80'>
                  <span>
                    Giá vào lệnh:{' '}
                    <span className='font-bold text-white'>
                      {rec.entry_price ? currencyFormatter(rec.entry_price) : '-'}
                    </span>
                  </span>
                  <span>
                    Chốt lời:{' '}
                    <span className='font-bold text-white'>
                      {rec.take_profit ? currencyFormatter(rec.take_profit) : '-'}
                    </span>
                  </span>
                  <span>
                    Cắt lỗ:{' '}
                    <span className='font-bold text-white'>
                      {rec.stop_loss ? currencyFormatter(rec.stop_loss) : '-'}
                    </span>
                  </span>
                  <span>
                    Lý do: <span className='font-bold text-white'>{rec.reasoning ?? '-'}</span>
                  </span>
                  <span>
                    Thời gian đưa ra phân tích:{' '}
                    <span className='font-bold text-white'>
                      {rec.created_at ? new Date(rec.created_at).toLocaleString('vi-VN') : '-'}
                    </span>
                  </span>
                </div>
                <div className='flex justify-end'>
                  {openRecChart === rec.ticker ? (
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-purple-700 border-purple-300'
                      onClick={() => setOpenRecChart(null)}
                    >
                      Đóng biểu đồ
                    </Button>
                  ) : (
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-purple-700 border-purple-300'
                      onClick={() => setOpenRecChart(rec.ticker)}
                    >
                      <BarChart3 className='w-4 h-4 mr-1' /> Xem biểu đồ
                    </Button>
                  )}
                </div>
                {openRecChart === rec.ticker && (
                  <div className='w-full' style={{ height: '100%' }}>
                    <StockChart
                      ticker={rec.ticker}
                      className='w-full h-full'
                      entryPrice={rec.entry_price ? rec.entry_price / 1000 : undefined}
                      takeProfit={rec.take_profit ? rec.take_profit / 1000 : undefined}
                      stopLoss={rec.stop_loss ? rec.stop_loss / 1000 : undefined}
                      entryTime={rec.created_at}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIRecommendations
