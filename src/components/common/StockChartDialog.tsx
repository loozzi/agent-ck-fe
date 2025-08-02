import { Dialog, DialogContent } from '@/components/ui/dialog'
import StockChart from '@/components/common/StockChart'
import './stock-chart-responsive.css'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface StockChartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTicker: string | null
  entryPrice?: number
  takeProfit?: number
  stopLoss?: number
}

const StockChartDialog: React.FC<StockChartDialogProps> = ({
  open,
  onOpenChange,
  selectedTicker,
  entryPrice,
  takeProfit,
  stopLoss
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className='max-w-[100vw] max-h-[95vh] w-full sm:max-w-7xl p-2 sm:p-6 rounded-xl overflow-hidden'>
      <div className='w-full h-full max-h-[90vh] overflow-y-auto'>
        {selectedTicker ? (
          <div className='w-full h-full'>
            <StockChart
              ticker={selectedTicker}
              entryPrice={entryPrice}
              takeProfit={takeProfit}
              stopLoss={stopLoss}
              className='w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] min-h-[250px] max-h-[85vh]'
            />
          </div>
        ) : (
          <div className='flex items-center justify-center h-32 sm:h-64'>
            <div className='text-center'>
              <Loader2 className='w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-2' />
              <p className='text-xs sm:text-sm text-gray-500'>Đang tải biểu đồ...</p>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
)

export default StockChartDialog
