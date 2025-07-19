import { Star, Search, BarChart3, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { FaTrash } from 'react-icons/fa'
import React from 'react'
import type { WatchlistItem } from '@/types/watchlist'

interface WatchlistProps {
  search: string
  setSearch: (v: string) => void
  filteredWatchlistItems: WatchlistItem[]
  watchlistLoading: boolean
  handleTickerClick: (ticker: string) => void
  handleRemoveWatchlistItem: (id: string) => void
  formatCurrency: (value: number) => string
  addToWatchlistQuery: string
  setAddToWatchlistQuery: (v: string) => void
  handleAddToWatchlist: (ticker: string) => void
  stocks: any[]
}

const Watchlist: React.FC<WatchlistProps> = ({
  search,
  setSearch,
  filteredWatchlistItems,
  watchlistLoading,
  handleTickerClick,
  handleRemoveWatchlistItem,
  formatCurrency,
  addToWatchlistQuery,
  setAddToWatchlistQuery,
  handleAddToWatchlist,
  stocks
}) => (
  <div>
    <div className='flex items-center justify-between mb-3'>
      <h2 className='text-base font-semibold flex items-center gap-2'>
        <Star className='w-4 h-4' />
        Danh mục theo dõi
      </h2>
      <div className='flex gap-2'>
        <div className='relative'>
          <Search className='w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
          <Input
            placeholder='Tìm kiếm cổ phiếu...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-7 w-48 h-8 text-sm'
          />
        </div>
      </div>
    </div>
    <div className='space-y-1'>
      {watchlistLoading ? (
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='w-4 h-4 animate-spin mr-2' />
          <span className='text-sm text-gray-500'>Đang tải danh mục theo dõi...</span>
        </div>
      ) : filteredWatchlistItems.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <Star className='w-8 h-8 mx-auto mb-2 opacity-50' />
          <p className='text-sm'>
            {search.trim()
              ? 'Không tìm thấy cổ phiếu nào phù hợp với tìm kiếm của bạn.'
              : 'Danh mục theo dõi của bạn trống.'}
          </p>
          {!search.trim() && <p className='text-xs mt-1'>Thêm cổ phiếu bên dưới để bắt đầu theo dõi chúng.</p>}
        </div>
      ) : (
        filteredWatchlistItems.map((item) => (
          <div
            key={item.id}
            className='flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-gray-100'
          >
            <div className='flex items-center gap-2 justify-between flex-1 mr-2'>
              <div className='flex-1'>
                <button
                  onClick={() => handleTickerClick(item.ticker)}
                  className='font-bold text-blue-600 text-sm hover:text-blue-800 hover:underline cursor-pointer'
                >
                  {item.ticker}
                </button>
                <p className='text-xs text-gray-500'>{item.company_name}</p>
              </div>
              <div className='flex items-center gap-2'>
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
                  <FaTrash className='w-3 h-3' />
                </Button>
              </div>
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
    <div className='mt-3'>
      <div className='space-y-2'>
        <div className='flex gap-2'>
          <Input
            placeholder='Mã hoặc tên...'
            className='flex-1 h-8 text-sm'
            value={addToWatchlistQuery}
            onChange={(e) => setAddToWatchlistQuery(e.target.value)}
          />
          <Button
            className='bg-green-600 hover:bg-green-700 text-sm'
            onClick={() => handleAddToWatchlist(addToWatchlistQuery)}
            disabled={!addToWatchlistQuery.trim()}
          >
            <Plus className='w-3 h-3 mr-1' />
            Thêm vào danh mục theo dõi
          </Button>
        </div>
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
)

export default Watchlist
