import { useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/app/store'
import { createPrompt } from '@/slices/prompt.slice'
import type { CreatePromptPayload } from '@/types/prompts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'

interface CreatePromptDialogProps {
  onCreated?: () => void
}

const CreatePromptDialog = ({ onCreated }: CreatePromptDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const [formData, setFormData] = useState<CreatePromptPayload>({
    name: '',
    description: '',
    prompt_text: '',
    category: 'learning_mode',
    is_active: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await dispatch(createPrompt(formData)).unwrap()
      setOpen(false)
      setFormData({
        name: '',
        description: '',
        prompt_text: '',
        category: 'learning_mode',
        is_active: true
      })
      onCreated?.()
    } catch (error) {
      console.error('Failed to create prompt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreatePromptPayload, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer hover:scale-105 transition-transform duration-200'>
          <Plus className='h-4 w-4 mr-2' />
          Tạo prompt mới
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Tạo prompt mới</DialogTitle>
          <DialogDescription>Tạo một prompt mới để sử dụng trong hệ thống</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Tên prompt</Label>
            <Input
              id='name'
              placeholder='Nhập tên prompt'
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              placeholder='Nhập mô tả cho prompt'
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category'>Danh mục</Label>
            <select
              id='category'
              className='w-full border rounded px-3 py-2'
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            >
              <option value='' disabled>
                Chọn danh mục
              </option>
              <option value='long_term'>Dài hạn</option>
              <option value='short_term'>Ngắn hạn</option>
              <option value='value_style'>Đầu tư giá trị</option>
              <option value='high_risk'>Rủi ro cao</option>
              <option value='moderate_risk'>Rủi ro vừa</option>
              <option value='low_risk'>Rủi ro thấp</option>
              <option value='goal_>10%'>Mục tiêu {'>'}10%</option>
              <option value='goal_learning'>Mục tiêu học hỏi</option>
              <option value='f0'>F0</option>
              <option value='advance'>Nâng cao</option>
              <option value='passive'>Thụ động</option>
              <option value='learning_mode'>Chế độ học</option>
              <option value='low_time'>Ít thời gian</option>
              <option value='active'>Chủ động</option>
            </select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='prompt_text'>Nội dung prompt</Label>
            <Textarea
              id='prompt_text'
              placeholder='Nhập nội dung prompt'
              value={formData.prompt_text}
              onChange={(e) => handleInputChange('prompt_text', e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              id='is_active'
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor='is_active'>Kích hoạt</Label>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              className='cursor-pointer hover:bg-gray-100 transition-colors'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='cursor-pointer hover:scale-105 transition-transform duration-200 disabled:cursor-not-allowed disabled:hover:scale-100'
            >
              {isLoading ? 'Đang tạo...' : 'Tạo prompt'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePromptDialog
