import React from 'react'
import { useNavigate } from 'react-router-dom'
import JoditEditor from 'jodit-react'
import { useAppDispatch, useAppSelector } from '@/app/hook'
import { createLesson, fetchAllLessons } from '@/slices/lesson.slice'
import { Button } from '@/components/ui/button'

const LessonCreate: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.lesson.categories)
  const [form, setForm] = React.useState({
    category_id: '',
    title: '',
    is_active: true,
    display_order: 0
  })
  const [content, setContent] = React.useState('')

  React.useEffect(() => {
    if (categories.length && !form.category_id) {
      setForm((prev) => ({ ...prev, category_id: categories[0].id }))
    }
  }, [categories])
  const [loading, setLoading] = React.useState(false)

  const handleChange = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    await dispatch(createLesson({ ...form, content }))
    await dispatch(fetchAllLessons({}))
    setLoading(false)
    navigate(-1)
  }

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <Button variant='outline' onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <h2 className='text-2xl font-bold mt-4 mb-4'>Thêm bài học mới</h2>
      <div className='mb-2'>
        <label className='block text-sm mb-1'>Tiêu đề</label>
        <input
          className='w-full border rounded px-2 py-1'
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div className='mb-2'>
        <label className='block text-sm mb-1'>Danh mục</label>
        <select
          className='w-full border rounded px-2 py-1'
          value={form.category_id}
          onChange={(e) => handleChange('category_id', e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className='mb-2'>
        <label className='block text-sm mb-1'>Nội dung</label>
        <JoditEditor key='create' value={content} onChange={setContent} config={{ readonly: false }} />
      </div>
      <div className='mb-2'>
        <label className='block text-sm mb-1'>Trạng thái</label>
        <select
          className='w-full border rounded px-2 py-1'
          value={form.is_active ? '1' : '0'}
          onChange={(e) => handleChange('is_active', e.target.value === '1')}
        >
          <option value='1'>Kích hoạt</option>
          <option value='0'>Tạm dừng</option>
        </select>
      </div>
      <div className='flex justify-end gap-2 mt-4'>
        <Button variant='default' onClick={handleSave} disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </div>
    </div>
  )
}

export default LessonCreate
