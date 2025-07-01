import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Button } from '@/components/ui/button'
import { fetchTransactions, fetchWallet } from '@/slices/portfolio.slice'
import { useEffect, useState } from 'react'
import WalletCard from '@/components/common/WalletCard'
import TransactionCard from '@/components/common/TransactionCard'
import AddTransactionDialog from '@/components/common/AddTransactionDialog'
import StockDetailsDialog from '@/components/common/StockDetailsDialog'
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog'
import { RefreshCw, Wallet, Receipt } from 'lucide-react'

const Portfolio = () => {
  const wallet = useAppSelector((state) => state.portfolio.wallet)
  const transactions = useAppSelector((state) => state.portfolio.transactions)
  const dispatch = useAppDispatch()

  const loading = useAppSelector((state) => state.portfolio.loading)
  const error = useAppSelector((state) => state.portfolio.error)

  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [showStockDetails, setShowStockDetails] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [stockToDelete, setStockToDelete] = useState<any>(null)

  const handleTransactionSuccess = () => {
    dispatch(fetchWallet())
    dispatch(fetchTransactions())
  }

  const handleViewStock = (item: any) => {
    setSelectedStock(item)
    setShowStockDetails(true)
  }

  const handleEditStock = (item: any) => {
    // TODO: Implement edit stock functionality
    console.log('Edit stock:', item)
    // You can implement a separate edit dialog here
  }

  const handleBuyStock = (ticker: string) => {
    // TODO: Open buy transaction dialog with pre-filled ticker
    console.log('Buy more stock:', ticker)
    // This could open AddTransactionDialog with ticker pre-filled and action set to 'buy'
  }

  const handleSellStock = (ticker: string) => {
    // TODO: Open sell transaction dialog with pre-filled ticker
    console.log('Sell stock:', ticker)
    // This could open AddTransactionDialog with ticker pre-filled and action set to 'sell'
  }

  const handleDeleteStock = (item: any) => {
    setStockToDelete(item)
    setShowDeleteDialog(true)
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

  useEffect(() => {
    dispatch(fetchWallet())
    dispatch(fetchTransactions())
  }, [dispatch])

  return (
    <div className='container mx-auto p-6 max-w-7xl'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center'>
          <Wallet className='w-8 h-8 mr-3 text-blue-600' />
          Danh mục đầu tư
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
          className='flex items-center gap-2 cursor-pointer'
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {wallet.map((item) => (
              <WalletCard
                key={item.id}
                item={item}
                onView={handleViewStock}
                onEdit={handleEditStock}
                onBuy={handleBuyStock}
                onSell={handleSellStock}
                onDelete={handleDeleteStock}
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

      {/* Transactions Section */}
      <div>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center'>
          <Receipt className='w-6 h-6 mr-2 text-blue-600' />
          Lịch sử giao dịch
        </h2>
        {transactions && transactions.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className='text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg'>
            <Receipt className='w-12 h-12 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 dark:text-gray-400'>Chưa có giao dịch nào</p>
          </div>
        )}
      </div>

      {/* Stock Details Dialog */}
      <StockDetailsDialog item={selectedStock} open={showStockDetails} onOpenChange={setShowStockDetails} />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteStock}
        ticker={stockToDelete?.ticker || ''}
      />
    </div>
  )
}

export default Portfolio
