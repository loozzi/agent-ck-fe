import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  ticker: string
}

const DeleteConfirmationDialog = ({ open, onOpenChange, onConfirm, ticker }: DeleteConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2 text-red-600'>
            <AlertTriangle className='w-5 h-5' />
            Xác nhận xóa cổ phiếu
          </AlertDialogTitle>
          <AlertDialogDescription className='text-gray-600 dark:text-gray-400'>
            Bạn có chắc chắn muốn xóa cổ phiếu{' '}
            <span className='font-semibold text-gray-900 dark:text-gray-100'>{ticker}</span> khỏi danh mục?
            <br />
            <br />
            <span className='text-red-600 dark:text-red-400 font-medium'>Hành động này không thể hoàn tác.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-red-600'
          >
            Xóa cổ phiếu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConfirmationDialog
