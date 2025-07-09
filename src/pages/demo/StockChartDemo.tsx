import StockChart from '@/components/common/StockChart'

const StockChartDemo = () => {
  return (
    <div className='container mx-auto p-6 max-w-7xl'>
      <h1 className='text-3xl font-bold mb-8'>Demo Stock Chart</h1>

      <div className='space-y-8'>
        <StockChart ticker='VCB' />
        <StockChart ticker='FPT' />
        <StockChart ticker='VIC' />
      </div>
    </div>
  )
}

export default StockChartDemo
