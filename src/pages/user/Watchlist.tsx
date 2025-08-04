import type { RootState } from '@/app/store'
import AIRecommendations from '@/components/common/AIRecommendations'
import '@/components/common/mobile-fixes.css'
import StockChartDialog from '@/components/common/StockChartDialog'
import WatchlistSection from '@/components/common/Watchlist'
import { Input } from '@/components/ui/input'
import { fetchAnalysis, fetchTickerAnalysis } from '@/slices/analysis.slice'
import { fetchListStocksByName } from '@/slices/stock.slice'
import { addToWatchlist, deleteWatchlistItem, fetchWatchlistDetail } from '@/slices/watchlist.slice'
import type { WatchlistItem } from '@/types/watchlist'
import { Activity, BarChart3, Loader2, Wallet } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Watchlist = () => {
  const dispatch = useDispatch()

  // Lấy state từ portfolio slice
  const { loading } = useSelector((state: RootState) => state.portfolio)
  const { stocks, loading: stockLoading } = useSelector((state: RootState) => state.stock)
  // Lấy state từ watchlist slice
  const { watchlistDetail, isLoading: watchlistLoading } = useSelector((state: RootState) => state.watchlist)

  // Lấy state từ analysis slice
  const {
    analyses,
    loading: analysisLoading,
    error: analysisError,
    tickerAnalysis
  } = useSelector((state: RootState) => state.analysis)

  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [addToWatchlistQuery, setAddToWatchlistQuery] = useState('')
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
  const [showChart, setShowChart] = useState(false)
  // State for which recommendation chart is open
  const [openRecChart, setOpenRecChart] = useState<string | null>(null)

  useEffect(() => {
    // dispatch(fetchWallet() as any)
    dispatch(fetchWatchlistDetail() as any)
  }, [dispatch])

  // Lấy phân tích AI khi vào trang
  useEffect(() => {
    dispatch(fetchAnalysis({ limit: 10 }) as any)
  }, [dispatch])

  // Debounce search for stocks
  useEffect(() => {
    if (!searchQuery.trim()) return
    const timeoutId = setTimeout(() => {
      dispatch(fetchListStocksByName({ q: searchQuery.trim(), limit: 10 }) as any)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, dispatch])

  // Debounce search for add to watchlist
  useEffect(() => {
    if (!addToWatchlistQuery.trim()) return
    const timeoutId = setTimeout(() => {
      dispatch(fetchListStocksByName({ q: addToWatchlistQuery.trim(), limit: 5 }) as any)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [addToWatchlistQuery, dispatch])

  // Filter watchlist items based on search
  const filteredWatchlistItems = useMemo(() => {
    if (!watchlistDetail?.items) return []

    let filtered = watchlistDetail.items

    // Filter by search
    if (search.trim()) {
      filtered = filtered.filter(
        (item: WatchlistItem) =>
          item.ticker.toLowerCase().includes(search.toLowerCase()) ||
          item.company_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return filtered
  }, [watchlistDetail?.items, search])

  // Handle remove watchlist item
  const handleRemoveWatchlistItem = async (itemId: string) => {
    try {
      await dispatch(deleteWatchlistItem(itemId) as any)
    } catch (error) {
      console.error('Error removing watchlist item:', error)
    }
  }

  // Handle add to watchlist
  const handleAddToWatchlist = async (ticker: string) => {
    if (!ticker.trim()) return

    try {
      await dispatch(
        addToWatchlist({
          ticker: ticker.toUpperCase()
        }) as any
      )
      setAddToWatchlistQuery('')
      // Refresh watchlist data
      dispatch(fetchWatchlistDetail() as any)
    } catch (error) {
      console.error('Error adding to watchlist:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value * 1000)
  }

  const handleTickerClick = async (ticker: string) => {
    setSelectedTicker(ticker)
    setShowChart(true)
    // Fetch ticker analysis for prediction lines
    await dispatch(fetchTickerAnalysis(ticker) as any)
  }

  const handleCloseChart = () => {
    setShowChart(false)
    setSelectedTicker(null)
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleCloseChart()
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showChart) {
        handleCloseChart()
      }
    }

    if (showChart) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showChart])

  return (
    <div className='h-screen -m-4 overflow-hidden'>
      {loading && (
        <div className='flex items-center justify-center h-64'>
          <Loader2 className='animate-spin w-8 h-8' />
        </div>
      )}
      {!loading && (
        <div className='h-full'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-0 h-full'>
            {/* Left Panel - Portfolio & Watchlist (White Background) */}
            <div
              className='lg:col-span-1 bg-white p-6 overflow-y-auto h-full flex flex-col'
              style={{ minHeight: '100%' }}
            >
              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-blue-500 rounded-lg'>
                    <Wallet className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h1 className='text-xl font-bold text-gray-900'>Danh mục theo dõi</h1>
                  </div>
                </div>
              </div>

              {/* Portfolio Summary Cards */}
              {/* {portfolioSummary && (
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6'>
                  <Card className='border-0 shadow-sm'>
                    <CardContent className='p-3'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-xs text-gray-500'>Tổng giá trị</p>
                          <p className='text-sm font-bold'>{formatCurrency(portfolioSummary.totalValue)}</p>
                        </div>
                        <DollarSign className='w-4 h-4 text-blue-500' />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='border-0 shadow-sm'>
                    <CardContent className='p-3'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-xs text-gray-500'>Tổng P&L</p>
                          <p
                            className={`text-sm font-bold ${portfolioSummary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {portfolioSummary.totalGainLoss >= 0 ? '+' : ''}
                            {formatCurrency(portfolioSummary.totalGainLoss)}
                          </p>
                        </div>
                        {portfolioSummary.totalGainLoss >= 0 ? (
                          <TrendingUp className='w-4 h-4 text-green-500' />
                        ) : (
                          <TrendingDown className='w-4 h-4 text-red-500' />
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='border-0 shadow-sm'>
                    <CardContent className='p-3'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-xs text-gray-500'>P&L %</p>
                          <p
                            className={`text-sm font-bold ${portfolioSummary.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {portfolioSummary.totalGainLossPercent >= 0 ? '+' : ''}
                            {portfolioSummary.totalGainLossPercent.toFixed(2)}%
                          </p>
                        </div>
                        <Target className='w-4 h-4 text-purple-500' />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='border-0 shadow-sm'>
                    <CardContent className='p-3'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-xs text-gray-500'>Vị thế</p>
                          <p className='text-sm font-bold'>{portfolioSummary.totalItems}</p>
                        </div>
                        <PieChart className='w-4 h-4 text-orange-500' />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )} */}

              {/* Portfolio Section */}
              {/* <Portfolio
                filteredWallet={filteredWallet}
                formatCurrency={formatCurrency}
                formatNumber={formatNumber}
                onTickerClick={handleTickerClick}
              /> */}

              {/* Watchlist Section */}
              <WatchlistSection
                search={search}
                setSearch={setSearch}
                filteredWatchlistItems={filteredWatchlistItems}
                watchlistLoading={watchlistLoading}
                handleTickerClick={handleTickerClick}
                handleRemoveWatchlistItem={handleRemoveWatchlistItem}
                formatCurrency={formatCurrency}
                addToWatchlistQuery={addToWatchlistQuery}
                setAddToWatchlistQuery={setAddToWatchlistQuery}
                handleAddToWatchlist={handleAddToWatchlist}
                stocks={stocks}
                stockLoading={stockLoading}
              />
            </div>

            {/* Right Panel - AI Recommendations (Purple Background) */}
            <div
              className='lg:col-span-1 bg-gradient-to-br from-purple-600 to-indigo-700 p-4 sm:p-6 text-white overflow-y-auto h-full flex flex-col pb-24'
              style={{ minHeight: '100%' }}
            >
              <div className='flex items-center gap-2 mb-4 justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='p-2 bg-white/20 rounded-lg'>
                    <Activity className='w-4 h-4' />
                  </div>
                  <div>
                    <h2 className='text-lg font-bold'>Gợi ý cổ phiếu AI</h2>
                    <p className='text-purple-100 text-xs'>Phân tích bởi AI</p>
                  </div>
                </div>
              </div>

              {/* Stock Chart Search */}
              <div className='space-y-3 mb-6'>
                <div className='bg-white/10 rounded-lg p-4 backdrop-blur-sm'>
                  <h3 className='text-white font-semibold mb-3 flex items-center gap-2'>
                    <BarChart3 className='w-4 h-4' />
                    Tìm kiếm biểu đồ giá
                  </h3>

                  <div className='space-y-3'>
                    <Input
                      placeholder='Tìm mã cổ phiếu theo ký hiệu hoặc tên...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='bg-white/20 border-white/30 text-white placeholder:text-white/70 h-8 text-sm'
                    />

                    {/* Search Results */}
                    {searchQuery && stocks && stocks.length > 0 && (
                      <div className='space-y-1 max-h-40 overflow-y-auto'>
                        {stocks.slice(0, 5).map((stock) => (
                          <button
                            key={stock.ticker}
                            onClick={() => handleTickerClick(stock.ticker)}
                            className='w-full text-left p-2 rounded bg-white/10 hover:bg-white/20 transition-colors'
                          >
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='font-semibold text-white text-sm'>{stock.ticker}</p>
                                <p className='text-xs text-white/80 truncate'>{stock.name}</p>
                              </div>
                              <BarChart3 className='w-4 h-4 text-white/60' />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchQuery && stockLoading && (
                      <div className='flex items-center justify-center p-4'>
                        <Loader2 className='w-4 h-4 animate-spin text-white' />
                        <span className='ml-2 text-sm text-white'>Đang tìm kiếm...</span>
                      </div>
                    )}

                    {searchQuery && !stockLoading && stocks && stocks.length === 0 && (
                      <p className='text-center text-white/70 text-sm p-4'>
                        Không tìm thấy mã phù hợp cho "{searchQuery}"
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Recommendations Content */}
              <AIRecommendations
                recommendations={analyses.filter((a) => a.source === 'recommendation')}
                recommendationLoading={analysisLoading}
                recommendationError={analysisError}
                openRecChart={openRecChart}
                setOpenRecChart={setOpenRecChart}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>

          {/* Stock Chart Dialog */}
          <StockChartDialog
            open={showChart}
            onOpenChange={handleDialogOpenChange}
            selectedTicker={selectedTicker}
            entryPrice={tickerAnalysis?.entry_price}
            takeProfit={tickerAnalysis?.take_profit}
            stopLoss={tickerAnalysis?.stop_loss}
          />
        </div>
      )}
    </div>
  )
}

export default Watchlist
