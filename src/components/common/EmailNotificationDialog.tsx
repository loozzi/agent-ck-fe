import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Mail, Shield, Clock, Check } from 'lucide-react'
import userService from '@/services/user.service'
import { setEmailDeclinePreference } from '@/utils/emailPreferences'

interface EmailNotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: (email: string) => void
  onDecline?: () => void
  userId?: string
}

interface EmailFormData {
  email: string
  otp: string
}

type DialogStep = 'ask' | 'form' | 'verify'

const EmailNotificationDialog = ({
  open,
  onOpenChange,
  onComplete,
  onDecline,
  userId
}: EmailNotificationDialogProps) => {
  const [step, setStep] = useState<DialogStep>('ask')
  const [formData, setFormData] = useState<EmailFormData>({ email: '', otp: '' })
  const [otpRequested, setOtpRequested] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const handleAskResponse = (wantsEmail: boolean) => {
    if (wantsEmail) {
      setStep('form')
    } else {
      // Save decline preference to localStorage
      if (userId) {
        setEmailDeclinePreference(userId)
      }
      onDecline?.()
      onOpenChange(false)
    }
  }

  const handleRequestOtp = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      return
    }

    setIsLoading(true)
    try {
      // Call API to request OTP
      await userService.requestEmailOtp(formData.email)
      setOtpRequested(true)
      setOtpSent(true)
      setTimeout(() => setOtpSent(false), 3000)
    } catch (error) {
      console.error('Error requesting OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitEmail = async () => {
    if (!formData.email || !formData.otp || !isValidEmail(formData.email)) {
      return
    }

    setIsLoading(true)
    try {
      // Call API to verify OTP and update email
      await userService.updateEmail(formData.email, formData.otp)
      onComplete?.(formData.email)
      onOpenChange(false)
      // Reset form
      setFormData({ email: '', otp: '' })
      setOtpRequested(false)
      setStep('ask')
    } catch (error) {
      console.error('Error updating email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const canRequestOtp = formData.email && isValidEmail(formData.email) && !otpRequested
  const canSubmitEmail = formData.email && formData.otp && isValidEmail(formData.email) && otpRequested

  const handleClose = () => {
    onOpenChange(false)
    // Reset form when closing
    setTimeout(() => {
      setFormData({ email: '', otp: '' })
      setOtpRequested(false)
      setStep('ask')
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        {step === 'ask' && (
          <>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Mail className='h-5 w-5 text-blue-600' />
                Thông báo qua Email
              </DialogTitle>
              <DialogDescription>
                Tài khoản của bạn chưa có email. Bạn có muốn nhận thông báo tin tức chứng khoán qua email không?
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-4 py-4'>
              <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
                <Mail className='h-5 w-5 text-blue-600 flex-shrink-0' />
                <div className='text-sm'>
                  <p className='font-medium text-blue-900'>Lợi ích khi thêm email:</p>
                  <ul className='text-blue-700 mt-1 space-y-1'>
                    <li>• Nhận tin tức nóng nhất</li>
                    <li>• Cảnh báo biến động thị trường</li>
                    <li>• Báo cáo phân tích định kỳ</li>
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter className='gap-2'>
              <Button variant='outline' onClick={() => handleAskResponse(false)}>
                Không, cảm ơn
              </Button>
              <Button onClick={() => handleAskResponse(true)}>Có, tôi muốn nhận thông báo</Button>
            </DialogFooter>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Shield className='h-5 w-5 text-green-600' />
                Thêm Email
              </DialogTitle>
              <DialogDescription>Nhập email của bạn để nhận thông báo tin tức chứng khoán</DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='flex gap-2'>
                  <Input
                    id='email'
                    type='email'
                    placeholder='your.email@example.com'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleRequestOtp}
                    disabled={!canRequestOtp || isLoading}
                    className='whitespace-nowrap'
                  >
                    {isLoading ? (
                      <>
                        <Clock className='h-4 w-4 animate-spin mr-2' />
                        Đang gửi...
                      </>
                    ) : (
                      'Lấy mã'
                    )}
                  </Button>
                </div>
                {!isValidEmail(formData.email) && formData.email && (
                  <p className='text-sm text-red-600'>Email không hợp lệ</p>
                )}
              </div>

              {otpRequested && (
                <div className='space-y-2'>
                  <Label htmlFor='otp'>Mã OTP</Label>
                  <Input
                    id='otp'
                    type='text'
                    placeholder='Nhập mã OTP'
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  {otpSent && (
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <Badge variant='secondary' className='text-green-700 bg-green-100'>
                        Mã OTP đã được gửi đến email của bạn
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <div className='text-sm text-gray-600 space-y-1'>
                <p>• Mã OTP sẽ được gửi đến email bạn vừa nhập</p>
                <p>• Mã có hiệu lực trong 5 phút</p>
                <p>• Kiểm tra cả hộp thư spam nếu không thấy email</p>
              </div>
            </div>
            <DialogFooter className='gap-2'>
              <Button variant='outline' onClick={handleClose}>
                Hủy
              </Button>
              <Button onClick={handleSubmitEmail} disabled={!canSubmitEmail || isLoading}>
                {isLoading ? (
                  <>
                    <Clock className='h-4 w-4 animate-spin mr-2' />
                    Đang xử lý...
                  </>
                ) : (
                  'Thêm Email'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EmailNotificationDialog
