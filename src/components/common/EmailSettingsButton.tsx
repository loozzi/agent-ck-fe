import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

interface EmailSettingsButtonProps {
  onClick: () => void
  hasEmail: boolean
}

const EmailSettingsButton = ({ onClick, hasEmail }: EmailSettingsButtonProps) => {
  return (
    <Button variant='outline' size='sm' onClick={onClick} className='flex items-center gap-2 whitespace-nowrap'>
      <Mail className='h-4 w-4' />
      <span className='hidden sm:inline'>{hasEmail ? 'Cập nhật email' : 'Thêm email'}</span>
      <span className='sm:hidden'>Email</span>
    </Button>
  )
}

export default EmailSettingsButton
