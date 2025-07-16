import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { ArrowDownCircle, ArrowUpCircle, Edit, Receipt, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'
import { useState } from 'react'

import type { TransactionItem } from '@/types/portfolio'

interface TransactionHistoryProps {
  transactions: TransactionItem[]
  onEdit?: (transaction: TransactionItem) => void
  onDelete?: (transaction: TransactionItem) => void
}

const TransactionHistory = ({ transactions, onEdit, onDelete }: TransactionHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = transactions.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Render pagination numbers with ellipsis for better UX
  const renderPaginationNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i} className='cursor-pointer'>
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Show first page
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1} className='cursor-pointer'>
            1
          </PaginationLink>
        </PaginationItem>
      )

      // Show ellipsis if needed
      if (currentPage > 3) {
        pages.push(
          <PaginationItem key='ellipsis1'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className='cursor-pointer'
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key='ellipsis2'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className='cursor-pointer'
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }

    return pages
  }

  return (
    <div>
      {transactions && transactions.length > 0 ? (
        <>
          {/* Record count info */}
          <div className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
            Hiển thị {startIndex + 1}-{Math.min(endIndex, transactions.length)} của {transactions.length} giao dịch
          </div>

          {/* Desktop Table View */}
          <div className='hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-semibold'>Mã cổ phiếu</TableHead>
                  <TableHead className='font-semibold'>Loại giao dịch</TableHead>
                  <TableHead className='font-semibold text-right'>Số lượng</TableHead>
                  <TableHead className='font-semibold text-right'>Giá</TableHead>
                  <TableHead className='font-semibold text-right'>Tổng giá trị</TableHead>
                  <TableHead className='font-semibold'>Thời gian</TableHead>
                  <TableHead className='font-semibold text-center'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => {
                  const isBuy = transaction?.action?.toLowerCase() === 'buy'
                  const quantity = transaction.quantity || 0
                  const price = transaction.price || 0
                  const totalValue = quantity * price

                  return (
                    <TableRow key={transaction.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                      <TableCell className='font-medium text-gray-900 dark:text-gray-100'>
                        {transaction.ticker}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isBuy ? 'default' : 'destructive'} className='text-white'>
                          {isBuy ? (
                            <>
                              <ArrowDownCircle className='w-3 h-3 mr-1' />
                              MUA
                            </>
                          ) : (
                            <>
                              <ArrowUpCircle className='w-3 h-3 mr-1' />
                              BÁN
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right font-medium'>{quantity.toLocaleString()}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {formatCurrency(price)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                      >
                        {formatCurrency(totalValue)}
                      </TableCell>
                      <TableCell className='text-gray-600 dark:text-gray-400'>
                        {new Date(transaction.transaction_time).toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell className='text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onEdit!(transaction)}
                            className='text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/20'
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onDelete!(transaction)}
                            className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20'
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination for Desktop */}
          {totalPages > 1 && (
            <div className='hidden md:flex justify-center mt-4'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {renderPaginationNumbers()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Mobile Card View */}
          <div className='md:hidden space-y-4'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-semibold'>Danh sách lịch sử</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => {
                  const isBuy = transaction.action?.toLowerCase() === 'buy'
                  const quantity = transaction.quantity || 0
                  const price = transaction.price || 0
                  const totalValue = quantity * price

                  return (
                    <TableRow key={transaction.id} className='hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                      <TableCell className='text-center'>
                        <div className='flex flex-col gap-2 py-2'>
                          <div className='flex flex-row gap-2'>
                            <div className='flex flex-col flex-1 items-start justify-between'>
                              <span>
                                Mã cổ phiếu:{' '}
                                <span className='font-medium text-gray-900 dark:text-gray-100'>
                                  {transaction.ticker}
                                </span>
                              </span>
                              <span>
                                Số lượng:{' '}
                                <span className='font-medium text-gray-900 dark:text-gray-100'>
                                  {quantity.toLocaleString()}
                                </span>
                              </span>
                              <span>
                                Giá:{' '}
                                <span
                                  className={`font-medium ${
                                    isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                  }`}
                                >
                                  {formatCurrency(price)}
                                </span>
                              </span>
                            </div>
                            <div className='flex flex-col flex-1 items-start justify-between'>
                              <span className='text-right font-bold'>
                                Tổng giá trị:{' '}
                                <span
                                  className={`${
                                    isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                  }`}
                                >
                                  {formatCurrency(totalValue)}
                                </span>
                              </span>
                              <span className='text-gray-600 dark:text-gray-400'>
                                Thời gian: {new Date(transaction.transaction_time).toLocaleString('vi-VN')}
                              </span>
                              <Badge variant={isBuy ? 'default' : 'destructive'} className='text-white'>
                                {isBuy ? (
                                  <>
                                    <ArrowDownCircle className='w-3 h-3 mr-1' />
                                    MUA
                                  </>
                                ) : (
                                  <>
                                    <ArrowUpCircle className='w-3 h-3 mr-1' />
                                    BÁN
                                  </>
                                )}
                              </Badge>
                            </div>
                          </div>
                          <div className='flex items-center justify-start gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => onEdit!(transaction)}
                              className='text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/20'
                            >
                              <Edit className='w-4 h-4' />
                              Chỉnh sửa
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => onDelete!(transaction)}
                              className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20'
                            >
                              <Trash2 className='w-4 h-4' />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination for Mobile */}
          {totalPages > 1 && (
            <div className='md:hidden flex justify-center mt-4'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {renderPaginationNumbers()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className='text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg'>
          <Receipt className='w-12 h-12 mx-auto text-gray-400 mb-4' />
          <p className='text-gray-600 dark:text-gray-400'>Chưa có giao dịch nào</p>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory
