import { useAppDispatch, useAppSelector } from '@/app/hook'
import AddTransactionDialog from '@/components/common/AddTransactionDialog'
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog'
import EditTransactionDialog from '@/components/common/EditTransactionDialog'
// import StockChart from '@/components/common/StockChart'
import NewsTimeline from '@/components/common/NewsTimeline'
import StockChart from '@/components/common/StockChart'
import TransactionHistory from '@/components/common/TransactionHistory'
import WalletCard from '@/components/common/WalletCard'
import { Button } from '@/components/ui/button'
import { deleteTransaction, fetchTransactions, fetchWallet } from '@/slices/portfolio.slice'
import { fetchPortfolioNewsCurrentUser } from '@/slices/portfolioNews.slice'
import { ChartLine, Receipt, RefreshCw, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'

const Portfolio = () => {
  const wallet = useAppSelector((state) => state.portfolio.wallet)
  const transactions = useAppSelector((state) => state.portfolio.transactions)
  const dispatch = useAppDispatch()

  const loading = useAppSelector((state) => state.portfolio.loading)
  const error = useAppSelector((state) => state.portfolio.error)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [stockToDelete, setStockToDelete] = useState<any>(null)
  const [showDeleteTransactionDialog, setShowDeleteTransactionDialog] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<any>(null)
  const [showEditTransactionDialog, setShowEditTransactionDialog] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null)
  const [showAddTransactionDialog, setShowAddTransactionDialog] = useState(false)
  const [prefilledTicker, setPrefilledTicker] = useState<string>('')
  const [prefilledAction, setPrefilledAction] = useState<'buy' | 'sell' | ''>('')

  // Portfolio News
  const news = useAppSelector((state) => state.portfolioNews.news)
  const newsLoading = useAppSelector((state) => state.portfolioNews.loading)
  const newsError = useAppSelector((state) => state.portfolioNews.error)

  const handleTransactionSuccess = () => {
    dispatch(fetchWallet())
    dispatch(fetchTransactions())
  }

  const handleBuyStock = (ticker: string) => {
    setPrefilledTicker(ticker)
    setPrefilledAction('buy')
    setShowAddTransactionDialog(true)
  }

  const handleSellStock = (ticker: string) => {
    setPrefilledTicker(ticker)
    setPrefilledAction('sell')
    setShowAddTransactionDialog(true)
  }

  const handleAddTransactionSuccess = () => {
    setShowAddTransactionDialog(false)
    setPrefilledTicker('')
    setPrefilledAction('')
    handleTransactionSuccess()
  }

  const confirmDeleteStock = () => {
    if (stockToDelete) {
      // TODO: Call API to delete stock from portfolio
      console.log('Deleting stock:', stockToDelete.ticker)
      // dispatch(deleteStockFromPortfolio(stockToDelete.id))
      setShowDeleteDialog(false)
      setStockToDelete(null)
    }
  }

  const handleDeleteTransaction = (transaction: any) => {
    setTransactionToDelete(transaction)
    setShowDeleteTransactionDialog(true)
  }

  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      dispatch(deleteTransaction(transactionToDelete.id)).then(() => {
        // Refresh data after successful deletion
        dispatch(fetchWallet())
        dispatch(fetchTransactions())
      })
      setShowDeleteTransactionDialog(false)
      setTransactionToDelete(null)
    }
  }

  const handleEditTransaction = (transaction: any) => {
    setTransactionToEdit(transaction)
    setShowEditTransactionDialog(true)
  }

  const handleEditTransactionSuccess = () => {
    // Refresh data after successful update
    dispatch(fetchWallet())
    dispatch(fetchTransactions())
  }

  const handleViewChart = () => {
    setTimeout(() => {
      const chartSection = document.getElementById('portfolio-chart-section')
      if (chartSection) {
        chartSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  useEffect(() => {
    dispatch(fetchWallet())
    dispatch(fetchTransactions())
    dispatch(fetchPortfolioNewsCurrentUser({ page: 1, per_page: 20 }))
  }, [dispatch])

  return (
    <div className='container mx-auto p-6 max-w-7xl'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center'>
          <Wallet className='w-8 h-8 mr-3 text-blue-600' />
          Ví của tôi
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>Quản lý danh mục và theo dõi giao dịch của bạn</p>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 mb-8'>
        <Button
          onClick={() => {
            dispatch(fetchWallet())
            dispatch(fetchTransactions())
          }}
          disabled={loading}
          className='flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-4 py-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Đang tải...' : 'Làm mới'}
        </Button>
        <AddTransactionDialog onSuccess={handleTransactionSuccess} />
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <p className='text-red-600 dark:text-red-400'>Lỗi: {error}</p>
        </div>
      )}

      {/* Wallet Section */}
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center'>
          <Wallet className='w-6 h-6 mr-2 text-green-600' />
          Danh mục cổ phiếu
        </h2>
        {wallet && wallet.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {wallet.map((item) => (
              <WalletCard
                key={item.id}
                item={item}
                onBuy={handleBuyStock}
                onSell={handleSellStock}
                onViewChart={handleViewChart}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg'>
            <Wallet className='w-12 h-12 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 dark:text-gray-400'>Chưa có cổ phiếu nào trong danh mục</p>
          </div>
        )}
      </div>

      {/* Portfolio News Section */}
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center'>
          <ChartLine className='w-6 h-6 mr-2 text-indigo-600' />
          Tin tức danh mục đầu tư
        </h2>
        {newsError ? (
          <div className='mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between'>
            <p className='text-red-600 dark:text-red-400'>Lỗi: {newsError}</p>
            <Button
              variant='outline'
              size='sm'
              onClick={() => dispatch(fetchPortfolioNewsCurrentUser({ page: 1, per_page: 20 }))}
              className='ml-4 text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950'
            >
              Tải lại
            </Button>
          </div>
        ) : news.length === 0 ? (
          <div className='bg-white dark:bg-gray-900 rounded-lg p-6 text-center min-h-[120px] flex flex-col items-center justify-center'>
            <ChartLine className='w-8 h-8 mx-auto text-indigo-300 mb-2' />
            <p className='text-gray-600 dark:text-gray-400'>Không có tin tức mới cho danh mục đầu tư</p>
          </div>
        ) : (
          <div className='bg-white dark:bg-gray-900 rounded-lg p-6'>
            <NewsTimeline
              news={news.map((item) => ({
                id: item.id,
                title: item.name || 'Tin tức danh mục',
                url: item.url,
                summary: '',
                content: '',
                image_url: '',
                source: item.related_stocks?.join(', ') || '',
                language: '',
                importance: 'low',
                publish_time: item.released_time || item.created_at,
                status: item.status || 'sent',
                created_at: item.created_at,
                updated_at: item.updated_at,
                sent_at: item.updated_at
              }))}
              isLoading={newsLoading}
              showImage={false}
            />
          </div>
        )}
      </div>

      {/* Transactions Section */}
      <div>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center'>
          <Receipt className='w-6 h-6 mr-2 text-blue-600' />
          Lịch sử giao dịch
        </h2>
        <TransactionHistory
          transactions={transactions || []}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {/* (Biểu đồ cổ phiếu section đã bị loại bỏ) */}
      {/* Stock Chart Section */}
      <div id='portfolio-chart-section' className='mt-8'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center'>
          <ChartLine className='w-6 h-6 mr-2 text-indigo-600' />
          Biểu đồ cổ phiếu
        </h2>
        {wallet && wallet.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {wallet.map((item) => (
              <div key={item.id} className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
                <StockChart ticker={item.ticker} />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg'>
            <ChartLine className='w-12 h-12 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 dark:text-gray-400'>Chưa có dữ liệu biểu đồ cho cổ phiếu nào</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteStock}
        ticker={stockToDelete?.ticker || ''}
      />

      {/* Delete Transaction Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteTransactionDialog}
        onOpenChange={setShowDeleteTransactionDialog}
        onConfirm={confirmDeleteTransaction}
        ticker={transactionToDelete?.ticker || ''}
      />

      {/* Edit Transaction Dialog */}
      <EditTransactionDialog
        transaction={transactionToEdit}
        open={showEditTransactionDialog}
        onOpenChange={setShowEditTransactionDialog}
        onSuccess={handleEditTransactionSuccess}
      />

      {/* Add Transaction Dialog (External Control) */}
      <AddTransactionDialog
        open={showAddTransactionDialog}
        onOpenChange={setShowAddTransactionDialog}
        onSuccess={handleAddTransactionSuccess}
        prefilledTicker={prefilledTicker}
        prefilledAction={prefilledAction as 'buy' | 'sell'}
      />
    </div>
  )
}

export default Portfolio
