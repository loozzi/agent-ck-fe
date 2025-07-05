import React from 'react'
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
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import type { LogicRule } from '@/types/logicRules'

interface DeleteLogicRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: LogicRule | null
  onConfirm: () => void
  isLoading?: boolean
}

export const DeleteLogicRuleDialog: React.FC<DeleteLogicRuleDialogProps> = ({
  open,
  onOpenChange,
  rule,
  onConfirm,
  isLoading = false
}) => {
  if (!rule) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-red-500' />
            Xác nhận xóa quy tắc logic
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='space-y-3'>
              <p>Bạn có chắc chắn muốn xóa quy tắc logic này không? Hành động này không thể hoàn tác.</p>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='font-medium'>Quy tắc:</span>
                  <Badge variant='secondary'>{rule.name}</Badge>
                </div>
                <div className='text-sm text-gray-600'>
                  {rule.indicator} {rule.operator} {rule.threshold_value} → {rule.action}
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className='bg-red-600 hover:bg-red-700'>
            {isLoading ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
