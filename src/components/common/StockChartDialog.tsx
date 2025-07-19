import { Dialog, DialogContent } from '@/components/ui/dialog'
import StockChart from '@/components/common/StockChart'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface StockChartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTicker: string | null
}

const StockChartDialog: React.FC<StockChartDialogProps> = ({ open, onOpenChange, selectedTicker }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className='max-w-7xl max-h-[95vh] w-[95vw] sm:w-[90vw] md:w-[85vw] p-0 m-0 rounded-xl'>
      <div>
        {selectedTicker ? (
          <div className='w-full'>
            <StockChart
              ticker={selectedTicker}
              className='w-full h-[50vh] sm:h-[60vh] min-h-[300px] sm:min-h-[400px]'
            />
          </div>
        ) : (
          <div className='flex items-center justify-center h-64 sm:h-96'>
            <div className='text-center'>
              <Loader2 className='w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-2' />
              <p className='text-sm text-gray-500'>Đang tải biểu đồ...</p>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
)

export default StockChartDialog
