import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { checkZaloFollowStatus } from '@/slices/zalo.slice'

// Extend Window interface to include ZaloSocialSDK
declare global {
  interface Window {
    ZaloSocialSDK?: {
      reload: () => void
    }
  }
}

interface ZaloFollowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ZaloFollowDialog = ({ open, onOpenChange }: ZaloFollowDialogProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Reload Zalo SDK when dialog opens to ensure button works
    if (open && window.ZaloSocialSDK) {
      window.ZaloSocialSDK.reload()
    }
  }, [open])

  const handleReloadPage = () => {
    window.location.reload()
  }

  const handleCheckStatus = () => {
    // Re-check follow status
    dispatch(checkZaloFollowStatus() as any)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]' showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className='text-center text-xl font-bold'>Quan tâm Zalo OA</DialogTitle>
          <DialogDescription className='text-center text-base'>
            Để tiếp tục sử dụng dịch vụ, bạn cần quan tâm tới Zalo Official Account của chúng tôi
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center space-y-4 py-4'>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground mb-4'>Quan tâm Zalo OA để nhận thông báo và hỗ trợ tốt nhất</p>
          </div>

          {/* Zalo Follow Button */}
          <div
            className='flex justify-center'
            dangerouslySetInnerHTML={{
              __html: `<div class="zalo-follow-only-button" data-oaid="4412053929170802954"></div>`
            }}
          />

          <div className='text-center mt-4 space-y-3'>
            <p className='text-xs text-muted-foreground'>
              Sau khi quan tâm, bạn có thể kiểm tra lại trạng thái hoặc tải lại trang
            </p>
            <div className='flex flex-col gap-2 w-full'>
              <Button onClick={handleCheckStatus} className='w-full' variant='default'>
                Kiểm tra lại trạng thái
              </Button>
              <Button onClick={handleReloadPage} className='w-full' variant='outline'>
                Tải lại trang
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ZaloFollowDialog
