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
import MultiSelectCheckbox from '@/components/ui/MultiSelectCheckbox'
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

  const CATEGORY_OPTIONS = [
    { value: 'long_term', label: 'Dài hạn' },
    { value: 'short_term', label: 'Ngắn hạn' },
    { value: 'value_style', label: 'Đầu tư giá trị' },
    { value: 'high_risk', label: 'Rủi ro cao' },
    { value: 'moderate_risk', label: 'Rủi ro vừa' },
    { value: 'low_risk', label: 'Rủi ro thấp' },
    { value: 'goal_>10%', label: 'Mục tiêu >10%' },
    { value: 'goal_learning', label: 'Mục tiêu học hỏi' },
    { value: 'f0', label: 'F0' },
    { value: 'advance', label: 'Nâng cao' },
    { value: 'passive', label: 'Thụ động' },
    { value: 'learning_mode', label: 'Chế độ học' },
    { value: 'low_time', label: 'Ít thời gian' },
    { value: 'active', label: 'Chủ động' },
    { value: 'general', label: 'Chung' }
  ]
  const [formData, setFormData] = useState<CreatePromptPayload>({
    name: '',
    description: '',
    prompt_text: '',
    category: ['learning_mode'],
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
        category: ['general'],
        is_active: true
      })
      onCreated?.()
    } catch (error) {
      console.error('Failed to create prompt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreatePromptPayload, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'category' ? (value as string[]) : value
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
      <DialogContent className='sm:max-w-[600px] max-h[80vh] overflow-y-auto'>
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

            <MultiSelectCheckbox
              options={CATEGORY_OPTIONS}
              value={formData.category}
              onChange={(selected) => handleInputChange('category', selected)}
              // label='Danh mục'
              className='mt-1'
            />
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
