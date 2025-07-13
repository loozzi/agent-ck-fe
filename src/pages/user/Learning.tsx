import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { chatAboutLesson, fetchAllLessons } from '@/slices/lesson.slice'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Learning = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { allLessons } = useAppSelector((state) => state.lesson)
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchAllLessons({}))
  }, [dispatch])

  const handleToggleCategory = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category))
  }

  const handleChatAboutLesson = async (lessonId: string) => {
    // Gọi chatAboutLesson, sau đó chuyển hướng sang trang trợ lý AI
    await dispatch(chatAboutLesson({ lessonId }))
    navigate('/user/chat')
  }

  const categories = allLessons.categories

  return (
    <div className='max-w-3xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Danh sách bài học</h1>
      <div className='flex flex-col gap-6'>
        {Object.entries(categories).map(([category, lessons]) => (
          <Card
            key={category}
            className={`p-0 shadow-lg border-2 border-blue-100 rounded-2xl transition-all duration-200 ${openCategory === category ? 'ring-2 ring-blue-400' : ''}`}
          >
            <button
              className='w-full flex flex-col items-start md:flex-row md:items-center justify-between px-6 py-6 bg-blue-50 hover:bg-blue-100 rounded-2xl focus:outline-none text-left min-h-[90px] md:min-h-[110px]'
              onClick={() => handleToggleCategory(category)}
              aria-expanded={openCategory === category}
              style={{ fontSize: 22, fontWeight: 600 }}
            >
              <span>{category}</span>
              <span className='ml-auto text-xl md:text-2xl'>{openCategory === category ? '▲' : '▼'}</span>
            </button>
            {openCategory === category && (
              <div className='bg-white rounded-b-2xl px-6 pb-4 pt-2 flex flex-col gap-4'>
                {lessons.length === 0 && (
                  <div className='text-gray-400 text-center'>Chưa có bài học trong mục này.</div>
                )}
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className='flex flex-col md:flex-row md:items-center justify-between border-b last:border-b-0 py-3'
                  >
                    <div>
                      <div className='font-semibold text-lg'>{lesson.title}</div>
                      <div className='text-base text-gray-500 line-clamp-2'>{lesson.content}</div>
                    </div>
                    <Button
                      className='mt-3 md:mt-0 md:ml-4 min-w-[140px] text-base h-11 rounded-lg'
                      onClick={() => handleChatAboutLesson(lesson.id)}
                    >
                      Tìm hiểu thêm
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
        {Object.entries(categories).length === 0 && (
          <div className='text-center text-gray-400'>Chưa có bài học nào.</div>
        )}
      </div>
    </div>
  )
}

export default Learning
