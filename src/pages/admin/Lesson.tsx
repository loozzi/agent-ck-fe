import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import JoditEditor from '@/components/ui/JoditEditor'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  fetchLessonsCategories,
  createLessonCategory,
  updateLessonCategory,
  deleteLessonCategory,
  fetchAllLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById
} from '@/slices/lesson.slice'
import type {
  Category,
  CreateCategoryPayload,
  CreateLessonPayload,
  Lesson,
  UpdateLessonPayload
} from '@/types/lesson.type'
import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, BookOpen, FolderPlus } from 'lucide-react'

const LessonManagement = () => {
  // State cho nội dung rich text editor
  const [editorContent, setEditorContent] = useState('')
  console.log('LessonManagement component rendering')
  const dispatch = useAppDispatch()
  const { categories, lessons, allLessons, loading, error } = useAppSelector((state) => state.lesson)

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null)

  // Form states
  const [categoryForm, setCategoryForm] = useState<CreateCategoryPayload>({
    name: '',
    description: '',
    display_order: 0,
    is_active: true
  })

  const [lessonForm, setLessonForm] = useState<CreateLessonPayload>({
    category_id: '',
    title: '',
    content: '',
    display_order: 0,
    is_active: true
  })

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    console.log('LessonManagement component mounted')
    // Try to fetch data, but don't fail silently
    dispatch(fetchLessonsCategories()).catch((error) => {
      console.error('Failed to fetch categories:', error)
    })
    dispatch(fetchAllLessons({})).catch((error) => {
      console.error('Failed to fetch lessons:', error)
    })
  }, [dispatch])

  // Category handlers
  const handleCreateCategory = async () => {
    try {
      await dispatch(createLessonCategory(categoryForm)).unwrap()
      setCategoryDialogOpen(false)
      resetCategoryForm()
      dispatch(fetchLessonsCategories())
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    try {
      await dispatch(
        updateLessonCategory({
          categoryId: editingCategory.id,
          payload: categoryForm
        })
      ).unwrap()
      setCategoryDialogOpen(false)
      setEditingCategory(null)
      resetCategoryForm()
      dispatch(fetchLessonsCategories())
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      try {
        await dispatch(deleteLessonCategory(categoryId)).unwrap()
        dispatch(fetchLessonsCategories())
        dispatch(fetchAllLessons({}))
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  // Lesson handlers
  const handleCreateLesson = async () => {
    try {
      await dispatch(createLesson(lessonForm)).unwrap()
      setLessonDialogOpen(false)
      resetLessonForm()
      dispatch(fetchAllLessons({}))
    } catch (error) {
      console.error('Error creating lesson:', error)
    }
  }

  const handleUpdateLesson = async () => {
    if (!editingLesson) return
    try {
      const updatePayload: UpdateLessonPayload = {
        category_id: lessonForm.category_id,
        title: lessonForm.title,
        content: lessonForm.content,
        is_active: lessonForm.is_active
      }
      await dispatch(
        updateLesson({
          lessonId: editingLesson.id,
          payload: updatePayload
        })
      ).unwrap()
      setLessonDialogOpen(false)
      setEditingLesson(null)
      resetLessonForm()
      dispatch(fetchAllLessons({}))
    } catch (error) {
      console.error('Error updating lesson:', error)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài học này không?')) {
      try {
        await dispatch(deleteLesson(lessonId)).unwrap()
        dispatch(fetchAllLessons({}))
      } catch (error) {
        console.error('Error deleting lesson:', error)
      }
    }
  }

  const handleViewLesson = async (lesson: Lesson) => {
    try {
      const fullLesson = await dispatch(getLessonById(lesson.id)).unwrap()
      setViewingLesson(fullLesson)
    } catch (error) {
      console.error('Error fetching lesson details:', error)
      setViewingLesson(lesson) // Fallback to basic lesson data
    }
  }

  // Form helpers
  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      display_order: 0,
      is_active: true
    })
  }

  const resetLessonForm = () => {
    setLessonForm({
      category_id: '',
      title: '',
      content: '',
      display_order: 0,
      is_active: true
    })
  }

  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description,
      display_order: 0,
      is_active: category.is_active
    })
    setCategoryDialogOpen(true)
  }

  const openEditLessonDialog = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonForm({
      category_id: lesson.category_id,
      title: lesson.title,
      content: lesson.content,
      display_order: 0,
      is_active: lesson.is_active
    })
    setLessonDialogOpen(true)
  }

  // Filter lessons by category
  const filteredLessons =
    selectedCategory && selectedCategory !== 'all'
      ? lessons.filter((lesson) => lesson.category_id === selectedCategory)
      : lessons

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.name || 'Unknown Category'
  }

  // Add early return for debugging
  if (!categories && !lessons && !loading) {
    return <div className='p-6'>Component loaded but no data. Check console for errors.</div>
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý Bài học</h1>
          <p className='text-muted-foreground'>
            Tổng số: {allLessons.total_categories} danh mục, {allLessons.total_lessons} bài học
          </p>
        </div>
      </div>

      {error && <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>{error}</div>}

      <Tabs defaultValue='lessons' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='lessons'>Bài học</TabsTrigger>
          <TabsTrigger value='categories'>Danh mục</TabsTrigger>
        </TabsList>

        <TabsContent value='lessons' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <BookOpen className='h-5 w-5' />
                    Danh sách Bài học
                  </CardTitle>
                  <CardDescription>Quản lý tất cả bài học trong hệ thống</CardDescription>
                </div>
                <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetLessonForm}>
                      <Plus className='h-4 w-4 mr-2' />
                      Thêm bài học
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[600px]'>
                    <DialogHeader>
                      <DialogTitle>{editingLesson ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}</DialogTitle>
                      <DialogDescription>
                        {editingLesson ? 'Cập nhật thông tin bài học' : 'Tạo bài học mới trong hệ thống'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='lesson-category' className='text-right'>
                          Danh mục
                        </Label>
                        <Select
                          value={lessonForm.category_id}
                          onValueChange={(value) => setLessonForm({ ...lessonForm, category_id: value })}
                        >
                          <SelectTrigger className='col-span-3'>
                            <SelectValue placeholder='Chọn danh mục' />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='lesson-title' className='text-right'>
                          Tiêu đề
                        </Label>
                        <Input
                          id='lesson-title'
                          value={lessonForm.title}
                          onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                          className='col-span-3'
                          placeholder='Nhập tiêu đề bài học'
                        />
                      </div>
                      <div className='grid grid-cols-4 items-start gap-4'>
                        <Label htmlFor='lesson-content' className='text-right'>
                          Nội dung
                        </Label>
                        <div className='col-span-3'>
                          <JoditEditor
                            value={editorContent}
                            tabIndex={1}
                            onBlur={(newContent) => setEditorContent(newContent)}
                            onChange={(newContent) => setEditorContent(newContent)}
                          />
                        </div>
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='lesson-active' className='text-right'>
                          Kích hoạt
                        </Label>
                        <Switch
                          id='lesson-active'
                          checked={lessonForm.is_active}
                          onCheckedChange={(checked) => setLessonForm({ ...lessonForm, is_active: checked })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type='submit'
                        onClick={editingLesson ? handleUpdateLesson : handleCreateLesson}
                        disabled={loading}
                      >
                        {loading ? 'Đang xử lý...' : editingLesson ? 'Cập nhật' : 'Tạo mới'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex gap-4 mb-4'>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue placeholder='Lọc theo danh mục' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Tất cả danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && selectedCategory !== 'all' && (
                  <Button variant='outline' onClick={() => setSelectedCategory('all')}>
                    Xóa bộ lọc
                  </Button>
                )}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className='text-right'>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center'>
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : filteredLessons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center'>
                        Không có bài học nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className='font-medium'>{lesson.title}</TableCell>
                        <TableCell>{getCategoryName(lesson.category_id)}</TableCell>
                        <TableCell>
                          <Badge variant={lesson.is_active ? 'default' : 'secondary'}>
                            {lesson.is_active ? 'Kích hoạt' : 'Tạm dừng'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(lesson.created_at).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-2'>
                            <Button variant='ghost' size='sm' onClick={() => handleViewLesson(lesson)}>
                              <Eye className='h-4 w-4' />
                            </Button>
                            <Button variant='ghost' size='sm' onClick={() => openEditLessonDialog(lesson)}>
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button variant='ghost' size='sm' onClick={() => handleDeleteLesson(lesson.id)}>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='categories' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <FolderPlus className='h-5 w-5' />
                    Danh mục Bài học
                  </CardTitle>
                  <CardDescription>Quản lý danh mục phân loại bài học</CardDescription>
                </div>
                <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetCategoryForm}>
                      <Plus className='h-4 w-4 mr-2' />
                      Thêm danh mục
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
                      <DialogDescription>
                        {editingCategory
                          ? 'Cập nhật thông tin danh mục bài học'
                          : 'Tạo danh mục mới để phân loại bài học'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='category-name' className='text-right'>
                          Tên danh mục
                        </Label>
                        <Input
                          id='category-name'
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          className='col-span-3'
                          placeholder='Nhập tên danh mục'
                        />
                      </div>
                      <div className='grid grid-cols-4 items-start gap-4'>
                        <Label htmlFor='category-description' className='text-right'>
                          Mô tả
                        </Label>
                        <Textarea
                          id='category-description'
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          className='col-span-3'
                          placeholder='Nhập mô tả danh mục'
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='category-active' className='text-right'>
                          Kích hoạt
                        </Label>
                        <Switch
                          id='category-active'
                          checked={categoryForm.is_active}
                          onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, is_active: checked })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type='submit'
                        onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                        disabled={loading}
                      >
                        {loading ? 'Đang xử lý...' : editingCategory ? 'Cập nhật' : 'Tạo mới'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className='text-right'>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center'>
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center'>
                        Không có danh mục nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className='font-medium'>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <Badge variant={category.is_active ? 'default' : 'secondary'}>
                            {category.is_active ? 'Kích hoạt' : 'Tạm dừng'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(category.created_at).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-2'>
                            <Button variant='ghost' size='sm' onClick={() => openEditCategoryDialog(category)}>
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button variant='ghost' size='sm' onClick={() => handleDeleteCategory(category.id)}>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lesson View Dialog */}
      {viewingLesson && (
        <Dialog open={!!viewingLesson} onOpenChange={() => setViewingLesson(null)}>
          <DialogContent className='sm:max-w-[1000px]'>
            <DialogHeader>
              <DialogTitle>{viewingLesson.title}</DialogTitle>
              <DialogDescription>
                Danh mục: {getCategoryName(viewingLesson.category_id)} | Trạng thái:{' '}
                {viewingLesson.is_active ? 'Kích hoạt' : 'Tạm dừng'}
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <Label>Nội dung bài học:</Label>
              <div className='mt-2 p-4 bg-gray-50 rounded-md'>
                <div className='whitespace-pre-wrap'>{viewingLesson.content}</div>
              </div>
            </div>
            <Separator />
            <div className='text-sm text-muted-foreground'>
              <p>Ngày tạo: {new Date(viewingLesson.created_at).toLocaleString('vi-VN')}</p>
              <p>Ngày cập nhật: {new Date(viewingLesson.updated_at).toLocaleString('vi-VN')}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default LessonManagement
