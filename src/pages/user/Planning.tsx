import { useAppDispatch, useAppSelector } from '@/app/hook'
import SubscriptionSection from '@/components/common/SubscriptionSection'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  fetchNextTierInfo,
  fetchSubscriptionPricings,
  fetchSubscriptionPurchaseHistory,
  purchaseSubscription
} from '@/slices/subscription.slice'
import { useEffect, useState } from 'react'

const Planning = () => {
  const dispatch = useAppDispatch()
  const { nextTierInfo, purchaseHistory, isLoading } = useAppSelector((state) => state.subscription)
  const [selectedTier, setSelectedTier] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('bank')
  const [isPurchasing, setIsPurchasing] = useState(false)

  useEffect(() => {
    dispatch(fetchNextTierInfo())
    dispatch(fetchSubscriptionPurchaseHistory())
    dispatch(fetchSubscriptionPricings())
  }, [dispatch])

  const handlePurchase = async () => {
    if (!selectedTier) return
    setIsPurchasing(true)
    await dispatch(
      purchaseSubscription({
        pricing_tier_id: selectedTier
      })
    )
    setIsPurchasing(false)
    dispatch(fetchSubscriptionPurchaseHistory())
    dispatch(fetchNextTierInfo())
  }

  return (
    <div className='w-full mx-auto space-y-8 py-8 px-2 sm:px-4'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Quản lý gói thành viên</h1>

      {/* Next Tier Info */}
      {nextTierInfo && (
        <Card className='bg-gradient-to-br from-blue-50 to-white border-blue-100 w-full'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Badge variant='outline' className='text-blue-700 border-blue-300 bg-blue-50'>
                Cấp tiếp theo
              </Badge>
              Thông tin cấp độ tiếp theo
            </CardTitle>
            <CardDescription>{nextTierInfo.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-6 text-sm'>
              <div>
                <span className='font-semibold text-blue-700'>Tổng số lần mua:</span> {nextTierInfo.total_purchases}
              </div>
              <div>
                <span className='font-semibold text-blue-700'>Số lần mua trả phí:</span> {nextTierInfo.paid_purchases}
              </div>
              <div>
                <span className='font-semibold text-blue-700'>Lần mua trả phí tiếp theo:</span>{' '}
                {nextTierInfo.next_paid_purchase_count}
              </div>
              <div>
                <span className='font-semibold text-blue-700'>Đang có gói miễn phí:</span>{' '}
                {nextTierInfo.has_free_subscription ? 'Có' : 'Không'}
              </div>
            </div>
            {nextTierInfo.next_tier && nextTierInfo.next_tier.length > 0 && (
              <div className='mt-4'>
                <span className='font-semibold text-blue-700'>Cấp độ tiếp theo:</span>
                <ul className='list-disc ml-6 mt-1 text-blue-900'>
                  {nextTierInfo.next_tier.map((tier) => (
                    <li key={tier.id}>
                      <Badge variant='secondary' className='mr-2'>
                        {tier.tier_name}
                      </Badge>
                      {Math.round(tier.duration_days / 30)} tháng - {tier.price_vnd.toLocaleString()} VNĐ
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Purchase History */}
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Lịch sử mua gói</CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseHistory && purchaseHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày mua</TableHead>
                  <TableHead>Số tháng</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Phương thức</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.created_at).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{item.duration_days / 30}</TableCell>
                    <TableCell>{item.price_paid_vnd.toLocaleString()} VNĐ</TableCell>
                    <TableCell>
                      <Badge variant='secondary'>{item.payment_method}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className='text-gray-500 text-sm'>Chưa có lịch sử mua gói.</div>
          )}
        </CardContent>
      </Card>

      {/* Quick Action: Mua gói */}
      <Card className='bg-gradient-to-br from-green-50 to-white border-green-100 w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Badge variant='outline' className='text-green-700 border-green-300 bg-green-50'>
              Mua nhanh
            </Badge>
            Mua gói thành viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-6 md:gap-4 items-center md:items-end justify-center w-full px-0'>
            <div className='flex flex-col gap-2 w-full'>
              <Label htmlFor='tier-select' className='text-base'>
                Chọn gói
              </Label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger id='tier-select' className='w-full min-w-[140px] md:min-w-[200px]'>
                  <SelectValue placeholder='Chọn gói...' />
                </SelectTrigger>
                <SelectContent>
                  {nextTierInfo?.next_tier && nextTierInfo.next_tier.length > 0 ? (
                    nextTierInfo.next_tier.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.tier_name} - {tier.price_vnd.toLocaleString()} VNĐ
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='none' disabled>
                      Không có gói khả dụng
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <Label className='text-base'>Phương thức thanh toán</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className='flex flex-row gap-4'>
                <RadioGroupItem value='vnpay' id='vnpay' />
                <Label htmlFor='vnpay'>VNPay</Label>
              </RadioGroup>
            </div>
            <Button
              onClick={handlePurchase}
              disabled={!selectedTier || isPurchasing || isLoading}
              className='mt-4 md:mt-7 w-full py-3 text-base rounded-lg'
            >
              {isPurchasing ? 'Đang xử lý...' : 'Mua ngay'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bảng giá các gói */}
      <div className='w-full'>
        <SubscriptionSection purchaseHistory={purchaseHistory} />
      </div>
    </div>
  )
}

export default Planning
