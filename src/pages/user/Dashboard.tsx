import ListStockCard from '@/components/common/ListStockCard'
import type { StockResponse } from '@/types/response'

const UserDashboard = () => {
  const listStockCard: StockResponse[] = [
    {
      ticker: 'A32',
      name: 'Công ty Cổ phần 32',
      exchange: 'UPCOM',
      sectors: null,
      time: '2025-06-26T14:30:00',
      open: 39.5,
      high: 39.5,
      low: 39.5,
      close: 39.5,
      volume: 200
    },
    {
      ticker: 'AAA',
      name: 'Công ty Cổ phần Nhựa An Phát Xanh',
      exchange: 'HSX',
      sectors: null,
      time: '2025-06-26T14:45:00',
      open: 7.16,
      high: 7.16,
      low: 7.16,
      close: 7.16,
      volume: 11900
    },
    {
      ticker: 'AAH',
      name: 'Công ty Cổ phần Hợp Nhất',
      exchange: 'UPCOM',
      sectors: null,
      time: '2025-06-26T14:55:00',
      open: 3.8,
      high: 3.9,
      low: 3.8,
      close: 3.9,
      volume: 2300
    },
    {
      ticker: 'AAM',
      name: 'Công ty Cổ Phần Thủy Sản MeKong',
      exchange: 'HSX',
      sectors: null,
      time: '2025-06-26T14:25:00',
      open: 7,
      high: 7,
      low: 7,
      close: 7,
      volume: 800
    },
    {
      ticker: 'AAS',
      name: 'Công ty Cổ phần Chứng khoán SmartInvest',
      exchange: 'UPCOM',
      sectors: null,
      time: '2025-06-26T14:55:00',
      open: 8.9,
      high: 8.9,
      low: 8.9,
      close: 8.9,
      volume: 100
    },
    {
      ticker: 'AAT',
      name: 'Công ty Cổ phần Tập đoàn Tiên Sơn Thanh Hóa',
      exchange: 'HSX',
      sectors: null,
      time: '2025-06-26T14:45:00',
      open: 3.06,
      high: 3.06,
      low: 3.06,
      close: 3.06,
      volume: 500
    },
    {
      ticker: 'AAV',
      name: 'Công ty Cổ phần AAV Group',
      exchange: 'HNX',
      sectors: null,
      time: '2025-06-26T14:45:00',
      open: 6.4,
      high: 6.4,
      low: 6.4,
      close: 6.4,
      volume: 52000
    },
    {
      ticker: 'ABB',
      name: 'Ngân hàng Thương mại Cổ phần An Bình',
      exchange: 'UPCOM',
      sectors: null,
      time: '2025-06-26T14:55:00',
      open: 8.3,
      high: 8.4,
      low: 8.3,
      close: 8.3,
      volume: 3500
    },
    {
      ticker: 'ABC',
      name: 'Công ty Cổ phần Truyền thông VMG',
      exchange: 'UPCOM',
      sectors: null,
      time: '2025-06-26T14:50:00',
      open: 10.3,
      high: 10.3,
      low: 10.3,
      close: 10.3,
      volume: 400
    },
    {
      ticker: 'ABI',
      name: 'Công ty Cổ phần Bảo hiểm Ngân hàng Nông Nghiệp',
      exchange: 'UPCOM',
      sectors: null,
      time: '2025-06-26T14:35:00',
      open: 29.2,
      high: 29.5,
      low: 29.2,
      close: 29.5,
      volume: 6000
    }
  ]

  return (
    <div>
      <ListStockCard data={listStockCard} />
    </div>
  )
}

export default UserDashboard
