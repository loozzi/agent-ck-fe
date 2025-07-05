import { useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/app/store'
import { removePrompt } from '@/slices/prompt.slice'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeletePromptDialogProps {
  promptId: string
  promptName: string
  onDeleted?: () => void
}

const DeletePromptDialog = ({ promptId, promptName, onDeleted }: DeletePromptDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await dispatch(removePrompt(promptId)).unwrap()
      setOpen(false)
      onDeleted?.()
    } catch (error) {
      console.error('Failed to delete prompt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' size='sm' className='cursor-pointer'>
          <Trash2 className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa prompt</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa prompt "{promptName}"? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className='bg-red-600 hover:bg-red-700 cursor-pointer'
          >
            {isLoading ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeletePromptDialog
