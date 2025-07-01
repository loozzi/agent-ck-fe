import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react'

interface Transaction {
  id: string
  ticker: string
  action?: string
  quantity?: number
  price?: number
  transaction_time: string
}

interface TransactionCardProps {
  transaction: Transaction
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isBuy = transaction.action?.toLowerCase() === 'buy'
  const quantity = transaction.quantity || 0
  const price = transaction.price || 0
  const totalValue = quantity * price

  return (
    <Card
      className={`border-l-4 ${isBuy ? 'border-l-green-500 bg-green-50 dark:bg-green-950/20' : 'border-l-red-500 bg-red-50 dark:bg-red-950/20'}`}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-bold text-gray-900 dark:text-gray-100'>{transaction.ticker}</CardTitle>
          <Badge variant={isBuy ? 'default' : 'destructive'} className='text-white'>
            {isBuy ? <ArrowDownCircle className='w-3 h-3 mr-1' /> : <ArrowUpCircle className='w-3 h-3 mr-1' />}
            {transaction.action ? (isBuy ? 'MUA' : 'BÁN') : 'N/A'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Số lượng</p>
            <p className='font-semibold text-gray-900 dark:text-gray-100'>{quantity.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-gray-600 dark:text-gray-400'>Giá</p>
            <p
              className={`font-semibold ${isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              ${price.toFixed(2)}
            </p>
          </div>
        </div>

        <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-gray-600 dark:text-gray-400 text-sm'>Tổng giá trị:</span>
            <span
              className={`font-bold ${isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              ${totalValue.toLocaleString()}
            </span>
          </div>
          <div className='flex items-center text-gray-500 dark:text-gray-400 text-xs'>
            <Clock className='w-3 h-3 mr-1' />
            {new Date(transaction.transaction_time).toLocaleString('vi-VN')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TransactionCard
