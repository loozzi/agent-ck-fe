import { useEffect, useState, useCallback } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import stockService from '@/services/stock.service'
import type { StockHistory, StockInterval, Daum } from '@/types/stock'
import { formatCurrency } from '@/utils/currency'
import { cn } from '@/lib/utils'

interface StockChartProps {
  ticker: string
  className?: string
  entryPrice?: number
  takeProfit?: number
  stopLoss?: number
  entryTime?: string // ISO date string
}

interface TimeRange {
  label: string
  interval: StockInterval
  days: number
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    payload: Daum
  }>
  label?: string
}

const timeRanges: TimeRange[] = [
  { label: '1D', interval: '1H', days: 1 },
  { label: '1W', interval: '1D', days: 7 },
  { label: '1M', interval: '1D', days: 30 },
  { label: '3M', interval: '1D', days: 90 },
  { label: '6M', interval: '1W', days: 180 },
  { label: 'YTD', interval: '1D', days: -1 } // -1 means from start of year
]

const StockChart = ({ ticker, className, entryPrice, takeProfit, stopLoss, entryTime }: StockChartProps) => {
  const [chartData, setChartData] = useState<Daum[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRange, setSelectedRange] = useState<TimeRange>(timeRanges[5]) // Default to YTD
  const [stockInfo, setStockInfo] = useState<StockHistory | null>(null)

  const getDateRange = (range: TimeRange) => {
    const endDate = new Date()
    let startDate: Date

    if (range.days === -1) {
      // Year to date - from January 1, 2025
      startDate = new Date('2025-01-01')
    } else {
      startDate = new Date()
      startDate.setDate(endDate.getDate() - range.days)
    }

    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    }
  }

  const fetchStockHistory = useCallback(
    async (range: TimeRange) => {
      setLoading(true)
      setError(null)

      try {
        const { start_date, end_date } = getDateRange(range)

        const response = await stockService.getHistory({
          ticker,
          start_date,
          end_date,
          interval: range.interval
        })

        setStockInfo(response.data)
        setChartData(response.data.data || [])
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu biểu đồ'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [ticker]
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (selectedRange.label === '1D') {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' })
  }

  const formatTooltipDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(selectedRange.label === '1D' && {
        hour: '2-digit',
        minute: '2-digit'
      })
    })
  }

  const calculatePriceChange = () => {
    if (chartData.length < 2) return { change: 0, changePercent: 0 }

    const firstPrice = chartData[0].close
    const lastPrice = chartData[chartData.length - 1].close
    const change = lastPrice - firstPrice
    const changePercent = (change / firstPrice) * 100

    return { change, changePercent }
  }

  const { change, changePercent } = calculatePriceChange()
  const isPositive = change > 0
  const isNegative = change < 0

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className='bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg'>
          <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>{formatTooltipDate(label || '')}</p>
          <div className='space-y-1 mt-2'>
            <p className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>Mở cửa: </span>
              <span className='font-medium'>{formatCurrency(data.open)}</span>
            </p>
            <p className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>Cao nhất: </span>
              <span className='font-medium text-green-600'>{formatCurrency(data.high)}</span>
            </p>
            <p className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>Thấp nhất: </span>
              <span className='font-medium text-red-600'>{formatCurrency(data.low)}</span>
            </p>
            <p className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>Đóng cửa: </span>
              <span className='font-medium'>{formatCurrency(data.close)}</span>
            </p>
            <p className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>Khối lượng: </span>
              <span className='font-medium'>{data.volume?.toLocaleString()}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  useEffect(() => {
    if (ticker) {
      fetchStockHistory(selectedRange)
    }
  }, [ticker, selectedRange, fetchStockHistory])

  return (
    <Card className={cn('w-full h-full', className)}>
      <CardHeader className='pb-2 px-3 sm:px-6'>
        <div className='flex flex-col gap-2 sm:gap-4'>
          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4'>
            <div className='min-w-0 flex-1'>
              <CardTitle className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 truncate'>
                <TrendingUp className='w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0' />
                <span className='truncate'>{ticker} - Biểu đồ giá</span>
              </CardTitle>
              {stockInfo && (
                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate'>{stockInfo.name}</p>
              )}
            </div>

            {/* Price Change Info */}
            {chartData.length > 0 && (
              <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>
                <div className='text-right'>
                  <p className='text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
                    {formatCurrency(chartData[chartData.length - 1]?.close || 0)}
                  </p>
                  <div className='flex items-center gap-1 sm:gap-2 justify-end'>
                    {isPositive && <TrendingUp className='w-3 h-3 sm:w-4 sm:h-4 text-green-600' />}
                    {isNegative && <TrendingDown className='w-3 h-3 sm:w-4 sm:h-4 text-red-600' />}
                    {!isPositive && !isNegative && <Minus className='w-3 h-3 sm:w-4 sm:h-4 text-gray-400' />}
                    <Badge
                      variant={isPositive ? 'default' : isNegative ? 'destructive' : 'secondary'}
                      className={cn(
                        'text-xs',
                        isPositive && 'bg-green-100 text-green-800 hover:bg-green-100',
                        isNegative && 'bg-red-100 text-red-800 hover:bg-red-100'
                      )}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrency(change)} ({isPositive ? '+' : ''}
                      {changePercent.toFixed(2)}%)
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Time Range Buttons */}
          <div className='flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-4'>
            {timeRanges.map((range) => (
              <Button
                key={range.label}
                variant={selectedRange.label === range.label ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedRange(range)}
                disabled={loading}
                className='text-xs px-2 py-1 sm:px-3 sm:py-2 h-7 sm:h-8'
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-2 px-3 sm:px-6'>
        {loading && (
          <div className='flex items-center justify-center h-32 sm:h-64'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-2'></div>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {error && (
          <div className='flex items-center justify-center h-32 sm:h-64'>
            <div className='text-center text-red-600 dark:text-red-400'>
              <Calendar className='w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2' />
              <p className='text-xs sm:text-sm'>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && chartData.length === 0 && (
          <div className='flex items-center justify-center h-32 sm:h-64'>
            <div className='text-center text-gray-600 dark:text-gray-400'>
              <Calendar className='w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2' />
              <p className='text-xs sm:text-sm'>Không có dữ liệu biểu đồ</p>
            </div>
          </div>
        )}

        {!loading && !error && chartData.length > 0 && (
          <div className='h-64 sm:h-80 md:h-96 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 15,
                  left: 10,
                  bottom: 5
                }}
              >
                {/* ...removed entry time line and dot... */}
                <defs>
                  <linearGradient id='colorPrice' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset='5%'
                      stopColor={isPositive ? '#10B981' : isNegative ? '#EF4444' : '#6B7280'}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset='95%'
                      stopColor={isPositive ? '#10B981' : isNegative ? '#EF4444' : '#6B7280'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' className='stroke-gray-200 dark:stroke-gray-700' />
                <XAxis
                  dataKey='time'
                  tickFormatter={formatDate}
                  className='text-xs text-gray-600 dark:text-gray-400'
                  tick={{ fontSize: 10 }}
                  interval={'preserveStartEnd'}
                />
                <YAxis
                  domain={([dataMin, dataMax]) => {
                    let min = dataMin
                    let max = dataMax
                    if (typeof takeProfit === 'number') max = Math.max(max, takeProfit)
                    if (typeof stopLoss === 'number') min = Math.min(min, stopLoss)
                    if (typeof entryPrice === 'number') {
                      min = Math.min(min, entryPrice)
                      max = Math.max(max, entryPrice)
                    }
                    // Add some padding
                    const padding = (max - min) * 0.05
                    return [min - padding, max + padding]
                  }}
                  tickFormatter={(value) => formatCurrency(value)}
                  className='text-xs text-gray-600 dark:text-gray-400'
                  tick={{ fontSize: 10 }}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* Đường kẻ ngang cho Entry, TP, SL */}
                {entryPrice && (
                  <ReferenceLine
                    y={entryPrice}
                    stroke='#2563eb'
                    strokeDasharray='4 2'
                    strokeWidth={2}
                    label={{ value: 'Giá vào', position: 'left', fill: '#2563eb', fontSize: 10, fontWeight: 'bold' }}
                  />
                )}
                {/* Đường kẻ dọc cho thời điểm vào lệnh (entryTime) - line liền, màu giống entry price */}
                {entryTime &&
                  chartData.length > 0 &&
                  (() => {
                    const entryDate = new Date(entryTime)
                    let closestIdx = 0
                    let minDiff = Infinity
                    chartData.forEach((d, idx) => {
                      const dDate = new Date(d.time)
                      const diff = Math.abs(dDate.getTime() - entryDate.getTime())
                      if (diff < minDiff) {
                        minDiff = diff
                        closestIdx = idx
                      }
                    })
                    const entryX = chartData[closestIdx]?.time
                    const entryPriceColor = '#2563eb'
                    return <ReferenceLine x={entryX} stroke={entryPriceColor} strokeWidth={2} ifOverflow='hidden' />
                  })()}
                {takeProfit && (
                  <ReferenceLine
                    y={takeProfit}
                    stroke='#22c55e'
                    strokeDasharray='4 2'
                    strokeWidth={2}
                    label={{ value: 'Chốt lời', position: 'left', fill: '#22c55e', fontSize: 10, fontWeight: 'bold' }}
                  />
                )}
                {stopLoss && (
                  <ReferenceLine
                    y={stopLoss}
                    stroke='#ef4444'
                    strokeDasharray='4 2'
                    strokeWidth={2}
                    label={{ value: 'Cắt lỗ', position: 'left', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }}
                  />
                )}
                <Area
                  type='monotone'
                  dataKey='close'
                  stroke={isPositive ? '#10B981' : isNegative ? '#EF4444' : '#6B7280'}
                  strokeWidth={2}
                  fill='url(#colorPrice)'
                  dot={false}
                  activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart Info */}
        {stockInfo && !loading && (
          <div className='mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm'>
            <div>
              <p className='text-gray-600 dark:text-gray-400'>Khoảng thời gian</p>
              <p className='font-medium'>{selectedRange.label}</p>
            </div>
            <div>
              <p className='text-gray-600 dark:text-gray-400'>Chu kỳ</p>
              <p className='font-medium'>{stockInfo.interval}</p>
            </div>
            <div>
              <p className='text-gray-600 dark:text-gray-400'>Điểm dữ liệu</p>
              <p className='font-medium'>{chartData.length}</p>
            </div>
            <div>
              <p className='text-gray-600 dark:text-gray-400'>Từ ngày</p>
              <p className='font-medium'>{new Date(stockInfo.start_date).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StockChart
