import { useAppDispatch, useAppSelector } from '@/app/hook'
import MultiSelectCheckbox from '@/components/ui/MultiSelectCheckbox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  createSurveyQuestion,
  deleteSurveyQuestion,
  fetchSurveyQuestions,
  updateSurveyQuestion,
  forceRedoSurveyQuestion
} from '@/slices/adminSurvey.slice'
import type { CreateSurveyQuestionPayload, SurveyQuestion } from '@/types/adminSurvey.types'
import React, { useEffect, useState } from 'react'

const defaultForm: CreateSurveyQuestionPayload = {
  question_id: '',
  question_text: '',
  question_type: 'text',
  options: [],
  is_required: false,
  is_active: true,
  order: 1,
  part: 'part1',
  part_title: '',
  max_selections: 1
}

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multiple_choice', label: 'Multiple Choice' }
]
const partOptions = [
  { value: 'part1', label: 'Phần 1', title: 'PHẦN 1: QUÁ KHỨ – BẠN ĐÃ T' },
  { value: 'part2', label: 'Phần 2', title: 'PHẦN 2: HIỆN TẠI – BẠN ĐANG' },
  { value: 'part3', label: 'Phần 3', title: 'PHẦN 3: TƯƠNG LAI – BẠN SẼ' }
]

const SurveyManagement = () => {
  const [optionInput, setOptionInput] = useState('')
  const dispatch = useAppDispatch()
  const { questions, isLoading, error } = useAppSelector((state) => state.adminSurvey)
  const [openDialog, setOpenDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<CreateSurveyQuestionPayload>(defaultForm)
  const [editId, setEditId] = useState<number | null>(null)

  // Force Redo dialog state
  const [openForceRedoDialog, setOpenForceRedoDialog] = useState(false)
  // Force Redo handler
  const handleForceRedo = () => {
    setOpenForceRedoDialog(true)
  }
  const handleConfirmForceRedo = () => {
    dispatch(forceRedoSurveyQuestion())
    setOpenForceRedoDialog(false)
  }
  const handleCancelForceRedo = () => {
    setOpenForceRedoDialog(false)
  }

  useEffect(() => {
    dispatch(fetchSurveyQuestions({}))
  }, [dispatch])

  const handleOpenAdd = () => {
    setForm(defaultForm)
    setEditMode(false)
    setEditId(null)
    setOpenDialog(true)
  }

  const handleOpenEdit = (q: SurveyQuestion) => {
    setForm({ ...q })
    setEditMode(true)
    setEditId(q.id)
    setOpenDialog(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      dispatch(deleteSurveyQuestion(id))
    }
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setEditMode(false)
    setEditId(null)
    setForm(defaultForm)
  }

  const handleFormChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'part') {
      const found = partOptions.find((opt) => opt.value === value)
      setForm((prev) => ({
        ...prev,
        part: value,
        part_title: found ? found.title : ''
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleOptionsChange = (options: string[]) => {
    setForm((prev) => ({ ...prev, options }))
  }

  const handleOptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptionInput(e.target.value)
  }

  const handleOptionInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && optionInput !== '') {
      e.preventDefault()
      handleOptionsChange([...form.options, optionInput])
      setOptionInput('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editMode && editId) {
      dispatch(updateSurveyQuestion({ id: editId, payload: form }))
    } else {
      dispatch(createSurveyQuestion(form))
    }
    handleDialogClose()
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Quản lý câu hỏi khảo sát</h2>
        <div className='flex gap-2'>
          <Button onClick={handleOpenAdd}>Thêm câu hỏi</Button>
          <Button variant='secondary' onClick={handleForceRedo}>
            Yêu cầu làm lại khảo sát
          </Button>
        </div>
      </div>

      {/* Dialog xác nhận Force Redo */}
      <Dialog open={openForceRedoDialog} onOpenChange={setOpenForceRedoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận yêu cầu làm lại khảo sát</DialogTitle>
          </DialogHeader>
          <div className='mb-4'>Bạn có chắc chắn muốn yêu cầu tất cả người dùng làm lại khảo sát không?</div>
          <DialogFooter>
            <Button variant='destructive' onClick={handleConfirmForceRedo}>
              Xác nhận
            </Button>
            <DialogClose asChild>
              <Button variant='outline' onClick={handleCancelForceRedo}>
                Hủy
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isLoading && <div className='mb-2 text-blue-600'>Đang tải...</div>}
      {error && <div className='mb-2 text-red-600'>{error}</div>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Câu hỏi</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Phần</TableHead>
            <TableHead>Bắt buộc</TableHead>
            <TableHead>Hoạt động</TableHead>
            <TableHead>Thứ tự</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((q: SurveyQuestion) => (
            <TableRow key={q.id}>
              <TableCell>{q.id}</TableCell>
              <TableCell className='max-w-xs truncate'>{q.question_text}</TableCell>
              <TableCell>{q.question_type}</TableCell>
              <TableCell>{partOptions.find((opt) => opt.value === q.part)?.label || q.part}</TableCell>
              <TableCell>{q.is_required ? '✔️' : ''}</TableCell>
              <TableCell>{q.is_active ? '✔️' : ''}</TableCell>
              <TableCell>{q.order}</TableCell>
              <TableCell>
                <Button size='sm' variant='outline' onClick={() => handleOpenEdit(q)}>
                  Sửa
                </Button>{' '}
                <Button size='sm' variant='destructive' onClick={() => handleDelete(q.id)}>
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <form onSubmit={handleSubmit} className='space-y-3'>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</DialogTitle>
            </DialogHeader>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='question_id'>Mã câu hỏi</Label>
                <Input name='question_id' value={form.question_id} onChange={handleFormChange} required />
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='order'>Thứ tự</Label>
                <Input name='order' type='number' value={form.order} onChange={handleFormChange} required />
              </div>
              <div className='col-span-2 flex flex-col gap-2'>
                <Label htmlFor='part'>Phần</Label>
                <Select value={form.part} onValueChange={(v) => handleSelectChange('part', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn phần' />
                  </SelectTrigger>
                  <SelectContent>
                    {partOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label} - {opt.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.part_title && <div className='mt-1 text-xs text-gray-500'>{form.part_title}</div>}
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='question_type'>Loại câu hỏi</Label>
                <Select value={form.question_type} onValueChange={(v) => handleSelectChange('question_type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại' />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='max_selections'>Số lựa chọn tối đa</Label>
                <Input name='max_selections' type='number' value={form.max_selections} onChange={handleFormChange} />
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='is_required'>Bắt buộc</Label>
                <input
                  type='checkbox'
                  name='is_required'
                  checked={form.is_required}
                  onChange={handleFormChange}
                  className='accent-primary w-5 h-5 rounded border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='is_active'>Hoạt động</Label>
                <input
                  type='checkbox'
                  name='is_active'
                  checked={form.is_active}
                  onChange={handleFormChange}
                  className='accent-primary w-5 h-5 rounded border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none'
                />
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='question_text'>Nội dung câu hỏi</Label>
              <Textarea name='question_text' value={form.question_text} onChange={handleFormChange} required />
            </div>
            {(form.question_type === 'single_choice' || form.question_type === 'multiple_choice') && (
              <div className='flex flex-col gap-2'>
                <Label>Lựa chọn</Label>
                <MultiSelectCheckbox
                  options={form.options.map((opt) => ({ value: opt, label: opt }))}
                  value={form.options}
                  onChange={handleOptionsChange}
                  label='Nhập lựa chọn (ấn Enter để thêm, cho phép dấu phẩy)'
                />
                <Input
                  placeholder='Thêm lựa chọn, ấn Enter để thêm'
                  value={optionInput}
                  onChange={handleOptionInputChange}
                  onKeyDown={handleOptionInputKeyDown}
                />
              </div>
            )}
            <DialogFooter>
              <Button type='submit'>{editMode ? 'Lưu' : 'Thêm mới'}</Button>
              <DialogClose asChild>
                <Button type='button' variant='outline' onClick={handleDialogClose}>
                  Hủy
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SurveyManagement
