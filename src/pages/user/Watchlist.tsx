import type { RootState } from '@/app/store'
import '@/components/common/mobile-fixes.css'
import StockChart from '@/components/common/StockChart'
import Header from '@/components/layouts/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { fetchWallet } from '@/slices/portfolio.slice'
import { fetchListStocksByName } from '@/slices/stock.slice'
import { addToWatchlist, deleteWatchlistItem, fetchWatchlistDetail } from '@/slices/watchlist.slice'
import type { WalletItem } from '@/types/portfolio'
import type { WatchlistItem } from '@/types/watchlist'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Filter,
  Loader2,
  PieChart,
  Plus,
  Search,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Watchlist = () => {
  const dispatch = useDispatch()

  // Lấy state từ portfolio slice
  const { wallet, loading } = useSelector((state: RootState) => state.portfolio)
  const { stocks, loading: stockLoading } = useSelector((state: RootState) => state.stock)
  // Lấy state từ watchlist slice
  const { watchlistDetail, isLoading: watchlistLoading } = useSelector((state: RootState) => state.watchlist)

  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [addToWatchlistQuery, setAddToWatchlistQuery] = useState('')
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
  const [showChart, setShowChart] = useState(false)
  const sortBy = 'performance'

  useEffect(() => {
    dispatch(fetchWallet() as any)
    dispatch(fetchWatchlistDetail() as any)
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

  // Filter và sort wallet items
  const filteredWallet = useMemo(() => {
    if (!wallet) return []
    let filtered = wallet

    // Filter by search
    if (search.trim()) {
      filtered = filtered.filter((item: WalletItem) => item.ticker.toLowerCase().includes(search.toLowerCase()))
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const aPerformance = ((a.current_price - a.avg_price) / a.avg_price) * 100
      const bPerformance = ((b.current_price - b.avg_price) / b.avg_price) * 100

      return bPerformance - aPerformance
    })

    return filtered
  }, [wallet, search, sortBy])

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
          ticker: ticker.toUpperCase(),
          notes: '',
          tags: [],
          category: 'General',
          target_price: 0
        }) as any
      )
      setAddToWatchlistQuery('')
      // Refresh watchlist data
      dispatch(fetchWatchlistDetail() as any)
    } catch (error) {
      console.error('Error adding to watchlist:', error)
    }
  }

  // Calculate portfolio summary
  const portfolioSummary = useMemo(() => {
    if (!wallet || wallet.length === 0) return null

    const totalValue = wallet.reduce((sum, item) => sum + item.current_value, 0)
    const totalCost = wallet.reduce((sum, item) => sum + item.avg_price * item.quantity, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0

    const winnersCount = wallet.filter((item) => {
      const performance = ((item.current_price - item.avg_price) / item.avg_price) * 100
      return performance > 0
    }).length

    const losersCount = wallet.filter((item) => {
      const performance = ((item.current_price - item.avg_price) / item.avg_price) * 100
      return performance < 0
    }).length

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      winnersCount,
      losersCount,
      totalItems: wallet.length
    }
  }, [wallet])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value)
  }

  const handleTickerClick = (ticker: string) => {
    setSelectedTicker(ticker)
    setShowChart(true)
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
    <div className='h-screen w-screen bg-gray-50 overflow-hidden'>
      <Header />
      {loading && (
        <div className='flex items-center justify-center h-64'>
          <Loader2 className='animate-spin w-8 h-8' />
        </div>
      )}
      {!loading && (
        <div className='h-full w-full mt-14'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-0 h-full'>
            {/* Left Panel - Portfolio & Watchlist (White Background) */}
            <div className='lg:col-span-1 bg-white p-6 overflow-y-auto h-full'>
              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-blue-500 rounded-lg'>
                    <Wallet className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h1 className='text-xl font-bold text-gray-900'>Your Portfolio & Watchlist</h1>
                    <p className='text-sm text-gray-600'>
                      Portfolio Value: {portfolioSummary ? formatCurrency(portfolioSummary.totalValue) : '₫142,830,750'}
                      <span className='text-green-600 ml-2'>(+15.2%)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Portfolio Summary Cards */}
              {portfolioSummary && (
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6'>
                  <Card className='border-0 shadow-sm'>
                    <CardContent className='p-3'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-xs text-gray-500'>Total Value</p>
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
                          <p className='text-xs text-gray-500'>Total P&L</p>
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
                          <p className='text-xs text-gray-500'>Positions</p>
                          <p className='text-sm font-bold'>{portfolioSummary.totalItems}</p>
                        </div>
                        <PieChart className='w-4 h-4 text-orange-500' />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Portfolio Section */}
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-3'>
                  <h2 className='text-base font-semibold flex items-center gap-2'>
                    <Activity className='w-4 h-4' />
                    Your Portfolio
                  </h2>
                  <Button size='sm' className='bg-blue-600 hover:bg-blue-700'>
                    <Plus className='w-3 h-3 mr-1' />
                    Add
                  </Button>
                </div>

                {/* Portfolio Stock List */}
                <div className='space-y-2'>
                  {filteredWallet.map((stock: WalletItem) => {
                    const performance = ((stock.current_price - stock.avg_price) / stock.avg_price) * 100
                    const gainLoss = stock.current_value - stock.avg_price * stock.quantity

                    return (
                      <div
                        key={stock.id}
                        className='flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-gray-100'
                      >
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <div>
                              <button
                                onClick={() => handleTickerClick(stock.ticker)}
                                className='font-bold text-blue-600 text-sm hover:text-blue-800 hover:underline cursor-pointer'
                              >
                                {stock.ticker}
                              </button>
                              <p className='text-xs text-gray-500'>{formatNumber(stock.quantity)} shares</p>
                            </div>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() => handleTickerClick(stock.ticker)}
                              className='ml-2 p-1 h-6 w-6'
                            >
                              <BarChart3 className='w-3 h-3' />
                            </Button>
                          </div>
                        </div>

                        <div className='text-right'>
                          <p className='font-bold text-sm'>{formatCurrency(stock.current_price)}</p>
                          <p
                            className={`text-xs flex items-center gap-1 ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {performance >= 0 ? (
                              <ArrowUpRight className='w-3 h-3' />
                            ) : (
                              <ArrowDownRight className='w-3 h-3' />
                            )}
                            {performance >= 0 ? '+' : ''}
                            {performance.toFixed(2)}%
                          </p>
                        </div>

                        <div className='text-right ml-3'>
                          <p className='font-bold text-sm'>{formatCurrency(stock.current_value)}</p>
                          <p className={`text-xs ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {gainLoss >= 0 ? '+' : ''}
                            {formatCurrency(gainLoss)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Watchlist Section */}
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <h2 className='text-base font-semibold flex items-center gap-2'>
                    <Star className='w-4 h-4' />
                    Your Watchlist
                  </h2>

                  <div className='flex gap-2'>
                    <div className='relative'>
                      <Search className='w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
                      <Input
                        placeholder='Search stocks...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='pl-7 w-48 h-8 text-sm'
                      />
                    </div>
                    <Button variant='outline' size='sm'>
                      <Filter className='w-3 h-3' />
                    </Button>
                  </div>
                </div>

                {/* Watchlist Items */}
                <div className='space-y-1'>
                  {watchlistLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      <span className='text-sm text-gray-500'>Loading watchlist...</span>
                    </div>
                  ) : filteredWatchlistItems.length === 0 ? (
                    <div className='text-center py-8 text-gray-500'>
                      <Star className='w-8 h-8 mx-auto mb-2 opacity-50' />
                      <p className='text-sm'>
                        {search.trim() ? 'No stocks found matching your search.' : 'Your watchlist is empty.'}
                      </p>
                      {!search.trim() && <p className='text-xs mt-1'>Add stocks below to start tracking them.</p>}
                    </div>
                  ) : (
                    filteredWatchlistItems.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-gray-100'
                      >
                        <div className='flex items-center gap-2'>
                          <div>
                            <button
                              onClick={() => handleTickerClick(item.ticker)}
                              className='font-bold text-blue-600 text-sm hover:text-blue-800 hover:underline cursor-pointer'
                            >
                              {item.ticker}
                            </button>
                            <p className='text-xs text-gray-500'>{item.company_name}</p>
                          </div>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleTickerClick(item.ticker)}
                            className='ml-2 p-1 h-6 w-6'
                          >
                            <BarChart3 className='w-3 h-3' />
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-red-500 hover:text-red-700 text-xs'
                            onClick={() => handleRemoveWatchlistItem(item.id)}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className='text-right'>
                          <p className='font-bold text-sm'>{formatCurrency(item.price_info.current_price)}</p>
                          <p
                            className={`text-xs flex items-center gap-1 ${item.price_info.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {item.price_info.change_percent >= 0 ? (
                              <ArrowUpRight className='w-3 h-3' />
                            ) : (
                              <ArrowDownRight className='w-3 h-3' />
                            )}
                            {item.price_info.change_percent >= 0 ? '+' : ''}
                            {item.price_info.change_percent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add to Watchlist */}
                <div className='mt-3'>
                  <div className='space-y-2'>
                    <div className='flex gap-2'>
                      <Input
                        placeholder='Search stocks by symbol or name...'
                        className='flex-1 h-8 text-sm'
                        value={addToWatchlistQuery}
                        onChange={(e) => setAddToWatchlistQuery(e.target.value)}
                      />
                      <Button
                        className='bg-green-600 hover:bg-green-700 text-sm'
                        onClick={() => handleAddToWatchlist(addToWatchlistQuery)}
                        disabled={!addToWatchlistQuery.trim()}
                      >
                        Add
                      </Button>
                    </div>

                    {/* Add to Watchlist Search Suggestions */}
                    {addToWatchlistQuery && stocks && stocks.length > 0 && (
                      <div className='space-y-1 max-h-32 overflow-y-auto border border-gray-200 rounded-lg bg-white'>
                        {stocks.slice(0, 3).map((stock) => (
                          <button
                            key={stock.ticker}
                            onClick={() => handleAddToWatchlist(stock.ticker)}
                            className='w-full text-left p-2 hover:bg-gray-50 transition-colors border-b last:border-b-0'
                          >
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='font-semibold text-gray-900 text-sm'>{stock.ticker}</p>
                                <p className='text-xs text-gray-600 truncate'>{stock.name}</p>
                              </div>
                              <Plus className='w-4 h-4 text-green-600' />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - AI Recommendations (Purple Background) */}
            <div className='lg:col-span-1 bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white overflow-y-auto h-full'>
              <div className='flex items-center gap-2 mb-4'>
                <div className='p-2 bg-white/20 rounded-lg'>
                  <Activity className='w-4 h-4' />
                </div>
                <div>
                  <h2 className='text-lg font-bold'>AI Stock Recommendations</h2>
                  <p className='text-purple-100 text-xs'>AI-Powered Analysis</p>
                </div>
              </div>

              {/* Stock Chart Search */}
              <div className='space-y-3 mb-6'>
                <div className='bg-white/10 rounded-lg p-4 backdrop-blur-sm'>
                  <h3 className='text-white font-semibold mb-3 flex items-center gap-2'>
                    <BarChart3 className='w-4 h-4' />
                    Search Stock Charts
                  </h3>

                  <div className='space-y-3'>
                    <Input
                      placeholder='Search stocks by symbol or name...'
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
                        <span className='ml-2 text-sm text-white'>Searching...</span>
                      </div>
                    )}

                    {searchQuery && !stockLoading && stocks && stocks.length === 0 && (
                      <p className='text-center text-white/70 text-sm p-4'>No stocks found for "{searchQuery}"</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Placeholder for AI content - will be filled later */}
              <div className='space-y-3'>
                <div className='bg-white/10 rounded-lg p-4 backdrop-blur-sm'>
                  <p className='text-purple-100 text-center py-8 text-sm'>
                    AI Recommendations
                    <br />
                    Coming Soon...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Chart Dialog */}
          <Dialog open={showChart} onOpenChange={handleDialogOpenChange}>
            <DialogContent className='max-w-7xl max-h-[95vh] w-[95vw] sm:w-[90vw] md:w-[85vw] p-0 m-4'>
              <DialogHeader className='p-4 sm:p-6 pb-0'>
                <DialogTitle className='flex items-center gap-2 text-sm sm:text-base'>
                  <BarChart3 className='w-4 h-4 sm:w-5 sm:h-5' />
                  {selectedTicker} - Stock Chart
                </DialogTitle>
              </DialogHeader>
              <div className='px-4 sm:px-6 pb-4 sm:pb-6'>
                {selectedTicker ? (
                  <div className='w-full'>
                    <StockChart
                      ticker={selectedTicker}
                      className='w-full h-[50vh] sm:h-[60vh] min-h-[300px] sm:min-h-[400px]'
                    />
                  </div>
                ) : (
                  <div className='flex items-center justify-center h-64 sm:h-96'>
                    <div className='text-center'>
                      <Loader2 className='w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-2' />
                      <p className='text-sm text-gray-500'>Loading chart...</p>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

export default Watchlist
