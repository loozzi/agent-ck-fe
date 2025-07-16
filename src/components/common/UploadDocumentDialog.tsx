import { useAppDispatch } from '@/app/hook'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import MultiSelectCheckbox from '@/components/ui/MultiSelectCheckbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { uploadDocument } from '@/slices/prompt.slice'
import { UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import type { CategoryEnum } from '@/types/prompts'

interface UploadDocumentDialogProps {
  onUploaded?: () => void
}

const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const UploadDocumentDialog = ({ onUploaded }: UploadDocumentDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
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
  const [category, setCategory] = useState<CategoryEnum[]>(['learning_mode'])
  const [fileError, setFileError] = useState<string | null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    setFileError(null)
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]
    if (!allowedExtensions.some((ext) => file.name.endsWith(ext))) {
      setFileError('Định dạng file không hợp lệ!')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError('File vượt quá dung lượng tối đa 10MB!')
      return
    }
    setFile(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    maxSize: MAX_FILE_SIZE
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error('Vui lòng chọn file tài liệu!')
      return
    }
    setIsLoading(true)
    try {
      await dispatch(uploadDocument({ file, title, description, category })).unwrap()
      toast.success('Tải lên tài liệu thành công!')
      setOpen(false)
      setFile(null)
      setTitle('')
      setDescription('')
      setCategory(['learning_mode'])
      onUploaded?.()
    } catch (error) {
      toast.error('Tải lên tài liệu thất bại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer hover:scale-105 transition-transform duration-200' variant='outline'>
          <UploadCloud className='h-4 w-4 mr-2' />
          Upload tài liệu
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Upload tài liệu</DialogTitle>
          <DialogDescription>
            Chỉ hỗ trợ các định dạng: .pdf, .docx, .doc, .txt, .md. Dung lượng tối đa 10MB.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-accent' : 'border-gray-300 bg-gray-50'}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className='text-green-600 font-medium'>{file.name}</div>
              ) : (
                <div className='flex flex-col items-center justify-center space-y-2'>
                  <UploadCloud className='mx-auto h-8 w-8 text-gray-400' />
                  <span>Kéo & thả file vào đây hoặc click để chọn file</span>
                  <span className='text-xs text-gray-500'>(Chỉ nhận: {allowedExtensions.join(', ')})</span>
                </div>
              )}
            </div>
            {fileError && <div className='text-red-600 text-sm mt-2'>{fileError}</div>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='title'>Tiêu đề tài liệu</Label>
            <Input
              id='title'
              placeholder='Nhập tiêu đề'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              placeholder='Nhập mô tả cho tài liệu'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='category'>Danh mục</Label>
            <MultiSelectCheckbox
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={setCategory}
              // label='Danh mục'
              className='mt-1'
            />
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
              {isLoading ? 'Đang tải lên...' : 'Tải lên'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UploadDocumentDialog
