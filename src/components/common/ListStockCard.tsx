import type { StockResponse } from '@/types/response'
import StockCard from './StockCard'

interface ListStockCardProps {
  data: StockResponse[]
  loading?: boolean
  className?: string
}

const ListStockCard = ({ data, loading = false, className = '' }: ListStockCardProps) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className='animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-36 w-full' />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className='text-6xl mb-4'>📊</div>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>Không có dữ liệu chứng khoán</h3>
        <p className='text-gray-500 dark:text-gray-400 text-center max-w-md'>
          Hiện tại chưa có thông tin chứng khoán nào để hiển thị. Vui lòng thử lại sau.
        </p>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header với thống kê tổng quan */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>Danh sách cổ phiếu</h2>
          <div className='text-sm text-gray-500 dark:text-gray-400'>{data.length} mã chứng khoán</div>
        </div>

        {/* Thống kê nhanh */}
        <div className='flex gap-4 text-xs'>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            <span className='text-gray-600 dark:text-gray-400'>
              Tăng: {data.filter((stock) => stock.close > stock.open).length}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-red-500 rounded-full'></div>
            <span className='text-gray-600 dark:text-gray-400'>
              Giảm: {data.filter((stock) => stock.close < stock.open).length}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-gray-500 rounded-full'></div>
            <span className='text-gray-600 dark:text-gray-400'>
              Đứng giá: {data.filter((stock) => stock.close === stock.open).length}
            </span>
          </div>
        </div>
      </div>{' '}
      {/* Grid hiển thị các StockCard */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 auto-rows-max'>
        {data.map((stock, index) => (
          <div key={`${stock.ticker}-${index}`} className='transition-transform duration-200 hover:scale-105 w-full'>
            <StockCard data={stock} />
          </div>
        ))}
      </div>
      {/* Footer với thông tin cập nhật */}
      {data.length > 0 && (
        <div className='mt-8 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-xs text-gray-500 dark:text-gray-400 text-center'>
            Dữ liệu được cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
          </p>
        </div>
      )}
    </div>
  )
}

export default ListStockCard
