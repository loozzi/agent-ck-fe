import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import JoditEditor from 'jodit-react'
import { fetchAllLessons } from '@/slices/lesson.slice'
import { useEffect, useState } from 'react'

const Learning = () => {
  const dispatch = useAppDispatch()

  const { allLessons } = useAppSelector((state) => state.lesson)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  // Đã chuyển sang dialogContent, không cần openLesson nữa
  const [dialogContent, setDialogContent] = useState<{ title: string; content: string } | null>(null)

  useEffect(() => {
    dispatch(fetchAllLessons({}))
  }, [dispatch])

  const handleToggleCategory = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category))
  }

  const handleToggleLesson = (lesson: { id: string; title: string; content: string }) => {
    if (dialogContent && dialogContent.title === lesson.title) {
      setDialogContent(null)
    } else {
      setDialogContent({ title: lesson.title, content: lesson.content })
    }
  }

  const categories = allLessons.categories

  // Danh sách màu nền random cho card
  const cardColors = ['#f3f8ff', '#ffe4e6', '#fffbe6', '#e6f7ff', '#e6ffe6', '#f0e6ff', '#fff0e6', '#e6fff7']

  return (
    <div className='max-w-3xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Danh sách bài học</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {Object.entries(categories).map(([category, lessons], idx) => {
          // Lấy màu random từ mảng, nếu hết thì lặp lại
          const bgColor = cardColors[idx % cardColors.length]
          return (
            <Card
              key={category}
              className={`p-0 shadow-lg border border-blue-100 rounded-3xl transition-all duration-200 flex flex-col items-center min-h-[340px] md:min-h-[380px] w-full`}
              style={{ background: bgColor }}
            >
              <button
                className='w-full flex flex-col items-center gap-4 px-8 py-10 rounded-t-3xl focus:outline-none text-center min-h-[180px] md:min-h-[220px]'
                onClick={() => handleToggleCategory(category)}
                aria-expanded={openCategory === category}
                style={{ fontSize: 26, fontWeight: 700, background: bgColor }}
              >
                <span className='block'>{category}</span>
                <span className='text-xl md:text-2xl mt-2'>{openCategory === category ? '▲' : '▼'}</span>
              </button>
              {openCategory === category && (
                <div className='bg-white rounded-b-3xl px-6 pb-4 pt-2 flex flex-col gap-2 w-full'>
                  {lessons.length === 0 && (
                    <div className='text-gray-400 text-center'>Chưa có bài học trong mục này.</div>
                  )}
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className='flex items-center justify-between border-b last:border-b-0 py-2 gap-2'
                    >
                      <div className='flex-1 min-w-0'>
                        <div className='font-semibold truncate'>{lesson.title}</div>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='h-8 px-3 text-xs'
                          onClick={() => handleToggleLesson(lesson)}
                        >
                          {'Xem chi tiết'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
        {Object.entries(categories).length === 0 && (
          <div className='text-center text-gray-400 col-span-2'>Chưa có bài học nào.</div>
        )}
      </div>
      {/* Dialog hiển thị nội dung bài học */}
      <Dialog open={!!dialogContent} onOpenChange={(open) => !open && setDialogContent(null)}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
          </DialogHeader>
          {dialogContent && (
            <div className='mt-2'>
              <JoditEditor value={dialogContent?.content || ''} config={{ readonly: true, toolbar: false }} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Learning
