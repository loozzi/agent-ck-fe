import { useAppDispatch, useAppSelector } from '@/app/hook'
import { fetchSubscriptionPricings } from '@/slices/subscription.slice'
import { useEffect } from 'react'
import { formatCurrencyVN } from '@/utils/currency'

const SubscriptionSection = () => {
  const dispatch = useAppDispatch()
  const { listPricings, isLoading, error } = useAppSelector((state) => state.subscription)

  useEffect(() => {
    dispatch(fetchSubscriptionPricings())
  }, [dispatch])

  if (isLoading) {
    return <div>Đang tải dữ liệu gói...</div>
  }

  if (error) {
    return <div>Lỗi: {error}</div>
  }

  // Xử lý dữ liệu để tạo bảng: cột là thời hạn (tháng), hàng là lần mua
  const pricings = Array.isArray(listPricings) ? listPricings : []
  const purchaseCounts = Array.from(
    new Set(
      pricings.map((p) => {
        const match = p.tier_name.match(/Lần mua thứ (\d+)/)
        return match ? Number(match[1]) : 1
      })
    )
  ).sort((a, b) => a - b)
  const durationMonths = Array.from(new Set(pricings.map((p) => Math.round(p.duration_days / 30)))).sort(
    (a, b) => a - b
  )
  const priceTable: Record<number, Record<number, number>> = {}
  pricings.forEach((p) => {
    const match = p.tier_name.match(/Lần mua thứ (\d+)/)
    const purchaseCount = match ? Number(match[1]) : 1
    const months = Math.round(p.duration_days / 30)
    if (!priceTable[months]) priceTable[months] = {}
    priceTable[months][purchaseCount] = p.price_vnd
  })

  return (
    <section className='max-w-[900px] w-full mx-auto my-6 bg-white rounded-xl shadow-lg px-2 sm:px-6 py-4 box-border'>
      <h2 className='text-center mb-4 text-[20px] font-bold tracking-wide'>Bảng giá thành viên</h2>
      <div className='overflow-x-auto -mx-1'>
        <table className='w-full min-w-[340px] border-collapse text-[14px]'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='px-3 py-3 border border-gray-200 min-w-[80px] text-[13px] font-semibold whitespace-nowrap'>
                Lần mua
              </th>
              {durationMonths.map((months) => (
                <th
                  key={months}
                  className='px-3 py-3 border border-gray-200 min-w-[80px] text-[13px] font-semibold whitespace-nowrap'
                >
                  {months} tháng
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchaseCounts.map((count) => (
              <tr key={count}>
                <td className='px-3 py-3 border border-gray-200 font-medium text-[13px] bg-gray-50 whitespace-nowrap'>
                  Lần mua {count}
                </td>
                {durationMonths.map((months) => (
                  <td
                    key={months}
                    className='px-3 py-3 border border-gray-200 text-center text-blue-700 font-semibold text-[14px] min-w-[80px] bg-white'
                  >
                    {priceTable[months]?.[count] ? formatCurrencyVN(priceTable[months][count]) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className='mt-3 text-gray-500 text-[13px] text-center leading-[1.5]'>
        Giá có thể thay đổi theo từng thời điểm.
        <br />
        Vui lòng liên hệ để biết thêm chi tiết.
      </p>
    </section>
  )
  // ...existing code...
}

export default SubscriptionSection
