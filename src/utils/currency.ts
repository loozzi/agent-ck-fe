export const formatCurrency = (value: number) => {
  return `${(value * 1000).toLocaleString()}đ`
}


// Định dạng tiền tệ: 300000 => 300k VNĐ, 1500000 => 1.5tr VNĐ
export function formatCurrencyVN(amount: number): string {
  if (amount >= 1_000_000) {
    // Hiển thị 1.5tr, 2tr, 2.3tr
    return (
      (amount % 1_000_000 === 0
        ? (amount / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })
        : (amount / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })) + 'tr VNĐ'
    )
  }
  if (amount >= 1_000) {
    // Hiển thị 300k, 950k
    return (
      (amount % 1_000 === 0
        ? (amount / 1_000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })
        : (amount / 1_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })) + 'k VNĐ'
    )
  }
  return amount.toLocaleString('vi-VN') + ' VNĐ'
}