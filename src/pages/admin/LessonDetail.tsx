import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import JoditEditor from 'jodit-react'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hook'
import { getLessonById, updateLesson, fetchAllLessons } from '@/slices/lesson.slice'
// import type { Lesson } from '@/types/lesson.type'
import { Button } from '@/components/ui/button'

const LessonDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const editor = useRef(null)
  const location = useLocation()
  const dispatch = useAppDispatch()
  const lesson = useAppSelector((state) => {
    return state.lesson.lessons.find((l) => l.id === id) || null
  })
  const categories = useAppSelector((state) => state.lesson.categories)
  // State for edit mode
  const [editing, setEditing] = React.useState(false)
  const [form, setForm] = React.useState({
    category_id: '',
    title: '',
    content: '',
    is_active: true
  })
  // Sync form state when opening edit
  React.useEffect(() => {
    if (editing && lesson) {
      setForm({
        category_id: lesson.category_id,
        title: lesson.title,
        content: lesson.content,
        is_active: lesson.is_active
      })
    }
  }, [editing, lesson])
  const handleEdit = () => {
    setEditing(true)
  }

  const handleEditChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditSave = async () => {
    if (!lesson) return
    await dispatch(updateLesson({ lessonId: lesson.id, payload: form }))
    setEditing(false)
    dispatch(fetchAllLessons({}))
  }
  const loading = useAppSelector((state) => state.lesson.loading)

  useEffect(() => {
    if (id) {
      dispatch(getLessonById(id))
    }
  }, [id, dispatch])

  // Tự động bật chế độ chỉnh sửa nếu có ?edit=true
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('edit') === 'true') {
      setEditing(true)
    }
  }, [location.search])

  if (loading) return <div>Đang tải...</div>
  if (!lesson) return <div>Không tìm thấy bài học</div>

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <Button variant='outline' onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      {!editing && (
        <Button variant='default' className='ml-2' onClick={handleEdit}>
          Chỉnh sửa
        </Button>
      )}
      {editing ? (
        <div className='mt-4'>
          <h2 className='text-xl font-bold mb-4'>Chỉnh sửa bài học</h2>
          <div className='mb-2'>
            <label className='block text-sm mb-1'>Tiêu đề</label>
            <input
              className='w-full border rounded px-2 py-1'
              value={form.title}
              onChange={(e) => handleEditChange('title', e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label className='block text-sm mb-1'>Danh mục</label>
            <select
              className='w-full border rounded px-2 py-1'
              value={form.category_id}
              onChange={(e) => handleEditChange('category_id', e.target.value)}
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
            <JoditEditor
              value={form.content}
              onChange={(newContent) => handleEditChange('content', newContent)}
              config={{ readonly: false }}
            />
          </div>
          <div className='mb-2'>
            <label className='block text-sm mb-1'>Trạng thái</label>
            <select
              className='w-full border rounded px-2 py-1'
              value={form.is_active ? '1' : '0'}
              onChange={(e) => handleEditChange('is_active', e.target.value === '1')}
            >
              <option value='1'>Kích hoạt</option>
              <option value='0'>Tạm dừng</option>
            </select>
          </div>
          <div className='flex justify-end gap-2 mt-4'>
            <Button variant='outline' onClick={() => setEditing(false)}>
              Hủy
            </Button>
            <Button variant='default' onClick={handleEditSave}>
              Lưu
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className='text-2xl font-bold mt-4 mb-2'>{lesson.title}</h1>
          <div className='mb-2 text-sm text-gray-500'>
            Danh mục: {lesson.category_id} | Trạng thái: {lesson.is_active ? 'Kích hoạt' : 'Tạm dừng'}
          </div>
          <JoditEditor ref={editor} value={lesson.content || ''} config={{ readonly: true, toolbar: false }} />
          <div className='mt-4 text-xs text-gray-400'>
            Ngày tạo: {new Date(lesson.created_at).toLocaleString('vi-VN')}
            <br />
            Ngày cập nhật: {new Date(lesson.updated_at).toLocaleString('vi-VN')}
          </div>
        </>
      )}
    </div>
  )
}

export default LessonDetail
