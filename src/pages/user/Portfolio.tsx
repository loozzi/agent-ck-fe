import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Button } from '@/components/ui/button'
import { addTransaction, fetchTransactions, fetchWallet } from '@/slices/portfolio.slice'
import { useEffect } from 'react'

const Portfolio = () => {
  const wallet = useAppSelector((state) => state.portfolio.wallet)
  const transactions = useAppSelector((state) => state.portfolio.transactions)
  const dispatch = useAppDispatch()

  const loading = useAppSelector((state) => state.portfolio.loading)
  const error = useAppSelector((state) => state.portfolio.error)

  const addMoreTransaction = () => {
    dispatch(
      addTransaction({
        ticker: 'SA123',
        action: 'buy',
        quantity: 100,
        price: 100,
        tracsaction_time: new Date().toISOString(),
        note: 'nothing'
      })
    )
  }

  useEffect(() => {
    dispatch(fetchWallet())
    dispatch(fetchTransactions())
  }, [])

  return (
    <div>
      <h1>Wallet</h1>
      {wallet && wallet.length > 0 ? (
        <ul>
          {wallet.map((item) => (
            <li key={item.id}>
              <strong>{item.ticker}</strong> - Quantity: {item.quantity}, Avg Price: ${item.avg_price.toFixed(2)},
              Current Price: ${item.current_price.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No portfolio items found.</p>
      )}

      <h2>Transactions</h2>
      {transactions && transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <strong>{transaction.ticker}</strong> - Action: {transaction.action}, Quantity: {transaction.quantity},
              Price: ${transaction.price.toFixed(2)}, Time: {new Date(transaction.transaction_time).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
      <Button
        onClick={() => {
          dispatch(fetchWallet())
          dispatch(fetchTransactions())
        }}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Refresh Data'}
      </Button>

      {error && <p className='text-red-500'>Error: {error}</p>}
      <Button onClick={addMoreTransaction}>Add Transaction</Button>
    </div>
  )
}

export default Portfolio
