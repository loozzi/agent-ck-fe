import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/app/store'
import { updatePrompt } from '@/slices/prompt.slice'
import type { UpdatePromtPayload, Prompt } from '@/types/prompts'
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
import { Edit } from 'lucide-react'

interface EditPromptDialogProps {
  prompt: Prompt
  onUpdated?: () => void
}

const EditPromptDialog = ({ prompt, onUpdated }: EditPromptDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const [formData, setFormData] = useState<UpdatePromtPayload>({
    name: prompt.name,
    description: prompt.description,
    prompt_text: prompt.prompt_text,
    category: prompt.category,
    is_active: prompt.is_active
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: prompt.name,
        description: prompt.description,
        prompt_text: prompt.prompt_text,
        category: prompt.category,
        is_active: prompt.is_active
      })
    }
  }, [open, prompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await dispatch(updatePrompt({ id: prompt.id, data: formData })).unwrap()
      setOpen(false)
      onUpdated?.()
    } catch (error) {
      console.error('Failed to update prompt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof UpdatePromtPayload, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='cursor-pointer'>
          <Edit className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa prompt</DialogTitle>
          <DialogDescription>Cập nhật thông tin prompt của bạn</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Tên prompt</Label>
            <Input
              id='name'
              placeholder='Nhập tên prompt'
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              placeholder='Nhập mô tả cho prompt'
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category'>Danh mục</Label>
            <Input
              id='category'
              placeholder='Nhập danh mục (vd: trading, analysis, education...)'
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='prompt_text'>Nội dung prompt</Label>
            <Textarea
              id='prompt_text'
              placeholder='Nhập nội dung prompt'
              value={formData.prompt_text || ''}
              onChange={(e) => handleInputChange('prompt_text', e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              id='is_active'
              checked={formData.is_active || false}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor='is_active'>Kích hoạt</Label>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={() => setOpen(false)} className='cursor-pointer'>
              Hủy
            </Button>
            <Button type='submit' disabled={isLoading} className='cursor-pointer'>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPromptDialog
