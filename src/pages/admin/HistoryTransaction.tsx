import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { fetchHistoryTransaction } from '@/slices/subscription.slice'
import { useEffect, useState } from 'react'

const HistoryTransaction = () => {
  const dispatch = useAppDispatch()
  const { historyTransactions, isLoading } = useAppSelector((state) => state.subscription)
  const [page, setPage] = useState(1)
  const limit = 10

  useEffect(() => {
    dispatch(fetchHistoryTransaction({ userId: '', page, limit }))
  }, [dispatch, page])

  const transactions = historyTransactions?.data || []
  const pagination = historyTransactions?.pagination
  const stats = historyTransactions?.stats

  return (
    <div>
      <h2 className='text-lg font-bold mb-4'>Lịch sử giao dịch</h2>
      {stats && (
        <div className='mb-4 flex gap-4'>
          <span>
            Tổng tiền: <b>{stats.total_money_vnd.toLocaleString()} VND</b>
          </span>
          <span>
            Số user đã thanh toán: <b>{stats.paid_user_count}</b>
          </span>
          <span>
            Tổng số giao dịch: <b>{stats.total_purchase_count}</b>
          </span>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Tên gói</TableHead>
            <TableHead>Số tiền (VND)</TableHead>
            <TableHead>Ngày tạo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>Đang tải...</TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>Không có dữ liệu</TableCell>
            </TableRow>
          ) : (
            transactions.map((tx, idx) => (
              <TableRow key={idx}>
                <TableCell>{tx.email}</TableCell>
                <TableCell>{tx.full_name}</TableCell>
                <TableCell>{tx.subscription_name}</TableCell>
                <TableCell>{tx.price_paid_vnd.toLocaleString()}</TableCell>
                <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableCaption>Lịch sử giao dịch của người dùng</TableCaption>
      </Table>
      {pagination && pagination.total > 0 && (
        <div className='mt-4 flex justify-center gap-2 items-center'>
          <button
            disabled={pagination.page === 1}
            onClick={() => setPage(page - 1)}
            className='px-2 py-1 border rounded'
          >
            Trước
          </button>
          <span>
            Trang <b>{pagination.page}</b> / <b>{Math.max(1, Math.ceil(pagination.total / pagination.page_size))}</b>
          </span>
          <button
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.page_size)}
            onClick={() => setPage(page + 1)}
            className='px-2 py-1 border rounded'
          >
            Sau
          </button>
        </div>
      )}
    </div>
  )
}

export default HistoryTransaction
