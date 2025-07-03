import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createSubscriptionCode, fetchSubScriptionCodes } from '@/slices/subscription.slice'
import { ArrowUpDown, Check, ChevronDown, ChevronUp, Copy, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Subscription = () => {
  const { subscriptionCodes = [], isLoading } = useAppSelector((state) => state.subscription)
  const dispatch = useAppDispatch()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    user_email: '',
    duration_days: ''
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState<'all' | 'used' | 'unused'>('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none')
  const [sortField, setSortField] = useState<'created_at' | 'duration_days'>('created_at')
  const [emailFilter, setEmailFilter] = useState('')

  // Filter and sort subscription codes
  const filteredCodes = subscriptionCodes.filter((code) => {
    // Filter by status (client-side)
    if (statusFilter === 'used' && !code.is_used) return false
    if (statusFilter === 'unused' && code.is_used) return false

    // Filter by email (client-side)
    if (emailFilter && !code.user_email.toLowerCase().includes(emailFilter.toLowerCase())) return false

    return true
  })

  const sortedCodes = [...filteredCodes].sort((a, b) => {
    if (sortOrder === 'none') return 0

    let valueA: number
    let valueB: number

    if (sortField === 'created_at') {
      valueA = new Date(a.created_at).getTime()
      valueB = new Date(b.created_at).getTime()
    } else {
      valueA = a.duration_days
      valueB = b.duration_days
    }

    if (sortOrder === 'asc') return valueA - valueB
    return valueB - valueA
  })

  // Calculate pagination
  const totalItems = sortedCodes.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = sortedCodes.slice(startIndex, endIndex)

  // Initial load
  useEffect(() => {
    dispatch(
      fetchSubScriptionCodes({
        user_email: ''
      })
    )
  }, [dispatch])

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [subscriptionCodes.length])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleCreateCode = async () => {
    // Validation
    if (!formData.user_email.trim()) {
      toast.error('Vui lòng nhập email')
      return
    }

    const durationDays = parseInt(formData.duration_days, 10)
    if (!formData.duration_days || isNaN(durationDays) || durationDays < 1) {
      toast.error('Số ngày phải là số nguyên từ 1 trở lên')
      return
    }

    try {
      const payload = {
        user_email: formData.user_email.trim(),
        duration_days: durationDays
      }
      await dispatch(createSubscriptionCode(payload)).unwrap()
      setIsDialogOpen(false)
      setFormData({ user_email: '', duration_days: '' })
      toast.success('Tạo subscription code thành công!')
      // Refresh the list with current email filter
      dispatch(fetchSubScriptionCodes({ user_email: emailFilter.trim() }))
    } catch (error) {
      console.error('Failed to create subscription code:', error)
      toast.error('Có lỗi xảy ra khi tạo subscription code')
    }
  }

  const handleSortToggle = (field: 'created_at' | 'duration_days') => {
    if (sortField !== field) {
      // Nếu click vào field khác, set field mới và sort desc
      setSortField(field)
      setSortOrder('desc')
    } else {
      // Nếu click vào field hiện tại, cycle through các sort order
      if (sortOrder === 'none') {
        setSortOrder('desc')
      } else if (sortOrder === 'desc') {
        setSortOrder('asc')
      } else {
        setSortOrder('none')
      }
    }
    setCurrentPage(1) // Reset về trang đầu
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as 'all' | 'used' | 'unused')
    setCurrentPage(1) // Reset về trang đầu
  }

  const handleEmailFilterChange = (value: string) => {
    setEmailFilter(value)
    // Page sẽ được reset khi dữ liệu mới được load từ API
  }

  return (
    <div className='p-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Quản lý Subscription Codes</CardTitle>
              <CardDescription>
                Danh sách các mã subscription đã được tạo ({subscriptionCodes.length} mã)
                {totalItems !== subscriptionCodes.length && ` - Hiển thị: ${totalItems} mã`}
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className='cursor-pointer'>
                  <Plus className='h-4 w-4 mr-2' />
                  Tạo Code Mới
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo Subscription Code Mới</DialogTitle>
                  <DialogDescription>Nhập thông tin để tạo mã subscription mới</DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='user_email' className='text-right'>
                      Email <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='user_email'
                      placeholder='Nhập email người dùng'
                      className='col-span-3'
                      value={formData.user_email}
                      onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='duration_days' className='text-right'>
                      Số ngày <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='duration_days'
                      type='number'
                      placeholder='Nhập số ngày (ví dụ: 30)'
                      className='col-span-3'
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                      min='1'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant='outline' onClick={() => setIsDialogOpen(false)} className='cursor-pointer'>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateCode} disabled={isLoading} className='cursor-pointer'>
                    {isLoading ? 'Đang tạo...' : 'Tạo Code'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <div className='text-lg'>Đang tải dữ liệu...</div>
            </div>
          ) : (
            <>
              <div className='flex items-center gap-4 mb-4 flex-wrap'>
                <div className='flex items-center gap-2'>
                  <Label>Tìm kiếm theo email:</Label>
                  <Input
                    placeholder='Nhập email để tìm kiếm...'
                    value={emailFilter}
                    onChange={(e) => handleEmailFilterChange(e.target.value)}
                    className='w-[250px]'
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <Label>Lọc theo trạng thái:</Label>
                  <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className='w-[140px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Tất cả</SelectItem>
                      <SelectItem value='used'>Đã sử dụng</SelectItem>
                      <SelectItem value='unused'>Chưa sử dụng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {subscriptionCodes.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>Không có subscription codes nào</div>
              ) : totalItems === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  Không có subscription codes nào phù hợp với bộ lọc
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã Code</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>
                          <Button
                            variant='ghost'
                            className='h-auto p-0 font-semibold hover:bg-transparent'
                            onClick={() => handleSortToggle('duration_days')}
                          >
                            <div className='flex items-center gap-1'>
                              Thời hạn (ngày)
                              {sortField === 'duration_days' && sortOrder === 'none' && (
                                <ArrowUpDown className='h-4 w-4' />
                              )}
                              {sortField === 'duration_days' && sortOrder === 'asc' && (
                                <ChevronUp className='h-4 w-4' />
                              )}
                              {sortField === 'duration_days' && sortOrder === 'desc' && (
                                <ChevronDown className='h-4 w-4' />
                              )}
                              {sortField !== 'duration_days' && <ArrowUpDown className='h-4 w-4 opacity-40' />}
                            </div>
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant='ghost'
                            className='h-auto p-0 font-semibold hover:bg-transparent'
                            onClick={() => handleSortToggle('created_at')}
                          >
                            <div className='flex items-center gap-1'>
                              Ngày tạo
                              {sortField === 'created_at' && sortOrder === 'none' && (
                                <ArrowUpDown className='h-4 w-4' />
                              )}
                              {sortField === 'created_at' && sortOrder === 'asc' && <ChevronUp className='h-4 w-4' />}
                              {sortField === 'created_at' && sortOrder === 'desc' && (
                                <ChevronDown className='h-4 w-4' />
                              )}
                              {sortField !== 'created_at' && <ArrowUpDown className='h-4 w-4 opacity-40' />}
                            </div>
                          </Button>
                        </TableHead>
                        <TableHead>Ngày kích hoạt</TableHead>
                        <TableHead>Zalo ID sử dụng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell className='font-mono font-medium'>
                            <div className='flex items-center gap-2'>
                              <span>{code.code}</span>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-6 w-6 p-0 cursor-pointer'
                                onClick={() => copyToClipboard(code.code)}
                              >
                                {copiedCode === code.code ? (
                                  <Check className='h-3 w-3 text-green-600' />
                                ) : (
                                  <Copy className='h-3 w-3' />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{code.user_email}</TableCell>
                          <TableCell className='text-center'>{code.duration_days} ngày</TableCell>
                          <TableCell>{formatDate(code.created_at)}</TableCell>
                          <TableCell>{formatDate(code.activated_at)}</TableCell>
                          <TableCell className='font-mono text-xs'>{code.zalo_id_used || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={code.is_used ? 'secondary' : 'default'}>
                              {code.is_used ? 'Đã sử dụng' : 'Chưa sử dụng'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className='flex items-center justify-between mt-4'>
                      <div className='text-sm text-muted-foreground'>
                        Hiển thị {startIndex + 1} - {Math.min(endIndex, totalItems)} của {totalItems} items
                      </div>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className='cursor-pointer'
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              className={
                                currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Subscription
