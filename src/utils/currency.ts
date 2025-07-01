export const formatCurrency = (value: number) => {
  return `${(value * 1000).toLocaleString()}đ`
}
