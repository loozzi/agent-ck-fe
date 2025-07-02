import { useAppDispatch, useAppSelector } from '@/app/hook'
import { fetchSubScriptionCodes } from '@/slices/subscription.slice'
import { useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

const Subscription = () => {
  const { subscriptionCodes, isLoading } = useAppSelector((state) => state.subscription)
  const dispatch = useAppDispatch()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    dispatch(
      fetchSubScriptionCodes({
        user_email: ''
      })
    )
  }, [dispatch])

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

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg'>Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Subscription Codes</CardTitle>
          <CardDescription>Danh sách các mã subscription đã được tạo ({subscriptionCodes.length} mã)</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptionCodes.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>Không có subscription codes nào</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Code</TableHead>
                  <TableHead>Thời hạn (ngày)</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Ngày kích hoạt</TableHead>
                  <TableHead>Zalo ID sử dụng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className='font-mono font-medium'>
                      <div className='flex items-center gap-2'>
                        <span>{code.code}</span>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-6 w-6 p-0'
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
                    <TableCell className='text-center'>{code.duration_days} ngày</TableCell>
                    <TableCell>
                      <Badge variant={code.is_used ? 'secondary' : 'default'}>
                        {code.is_used ? 'Đã sử dụng' : 'Chưa sử dụng'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(code.created_at)}</TableCell>
                    <TableCell>{formatDate(code.activated_at)}</TableCell>
                    <TableCell className='font-mono text-xs'>{code.zalo_id_used || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Subscription