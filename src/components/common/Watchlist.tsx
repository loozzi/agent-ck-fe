import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import type { WatchlistItem } from '@/types/watchlist'
import { ArrowDownRight, ArrowUpRight, BarChart3, Loader2, Plus, Star } from 'lucide-react'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'

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
  stockLoading: boolean
}

const Watchlist: React.FC<WatchlistProps> = ({
  search,
  setSearch,
  filteredWatchlistItems,
  watchlistLoading,
  handleTickerClick,
  handleRemoveWatchlistItem,
  formatCurrency,
  setAddToWatchlistQuery,
  handleAddToWatchlist,
  stocks,
  stockLoading
}) => {
  const [selectedStock, setSelectedStock] = useState<string>('')

  // Convert stocks to combobox options
  const stockOptions: ComboboxOption[] =
    stocks?.map((stock) => ({
      value: stock.ticker,
      label: stock.ticker,
      description: stock.name
    })) || []

  const handleStockSelect = (ticker: string) => {
    setSelectedStock(ticker)
  }

  const handleAddSelected = () => {
    if (selectedStock) {
      handleAddToWatchlist(selectedStock)
      setSelectedStock('')
    }
  }

  return (
    <div>
      <div className='space-y-1'>
        {/* Search input for existing watchlist */}
        <div className='mb-4'>
          <Input
            placeholder='Tìm kiếm trong danh mục theo dõi...'
            className='h-8 text-sm'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add to watchlist section */}
        <div className='mt-3'>
          <div className='space-y-2'>
            <div className='flex gap-2'>
              <Combobox
                options={stockOptions}
                value={selectedStock}
                onValueChange={handleStockSelect}
                onInputChange={setAddToWatchlistQuery}
                placeholder='Thêm mã cổ phiếu...'
                searchPlaceholder='Tìm mã hoặc tên...'
                emptyText='Không tìm thấy mã phù hợp'
                loading={stockLoading}
                className='flex-1 h-8 text-sm'
              />
              <Button
                className='bg-green-600 hover:bg-green-700 text-sm'
                onClick={handleAddSelected}
                disabled={!selectedStock}
              >
                <Plus className='w-3 h-3 mr-1' />
                Thêm vào danh mục theo dõi
              </Button>
            </div>
          </div>
        </div>
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
                  {/* TODO: Khi mở biểu đồ, truyền thêm dữ liệu dự đoán giá vào StockChart */}
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
              <div className='text-right w-16'>
                <p className='font-bold text-sm'>{formatCurrency(item.price_info.current_price)}</p>
                <p
                  className={`justify-end text-xs flex items-center gap-1 ${item.price_info.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}
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
    </div>
  )
}

export default Watchlist
