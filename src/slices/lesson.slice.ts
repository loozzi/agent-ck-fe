import lessonService from '@/services/lesson.service'
import type {
  AllLessonsResponse,
  Category,
  ChatAboutLessonResponse,
  CreateCategoryPayload,
  CreateLessonPayload,
  GetAllLessionsParams,
  Lesson,
  LessonState,
  UpdateLessonPayload
} from '@/types/lesson.type'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: LessonState = {
  categories: [],
  lessons: [],
  allLessons: {
    categories: {},
    total_categories: 0,
    total_lessons: 0
  },
  loading: false,
  error: null,
  chatMessages: [],
  chatLoading: false,
  chatError: null
}

export const fetchLessonsCategories = createAsyncThunk<Category[]>(
  'lesson/fetchLessonsCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await lessonService.getLessonsCategories()
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể tải danh sách danh mục bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const createLessonCategory = createAsyncThunk<Category, CreateCategoryPayload>(
  'lesson/createLessonCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await lessonService.createCategory(payload)
      toast.success('Tạo danh mục bài học thành công')
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể tạo danh mục bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateLessonCategory = createAsyncThunk<Category, { categoryId: string; payload: CreateCategoryPayload }>(
  'lesson/updateLessonCategory',
  async ({ categoryId, payload }, { rejectWithValue }) => {
    try {
      const response = await lessonService.updateLessonCategory(categoryId, payload)
      toast.success('Cập nhật danh mục bài học thành công')
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể cập nhật danh mục bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const deleteLessonCategory = createAsyncThunk<string, string>(
  'lesson/deleteLessonCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await lessonService.deleteLessonCategory(categoryId)
      toast.success('Xóa danh mục bài học thành công')
      return categoryId
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể xóa danh mục bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchAllLessons = createAsyncThunk<AllLessonsResponse, GetAllLessionsParams>(
  'lesson/fetchAllLessons',
  async (params, { rejectWithValue }) => {
    try {
      const response = await lessonService.getAllLessons(params)
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể tải danh sách bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const createLesson = createAsyncThunk<Lesson, CreateLessonPayload>(
  'lesson/createLesson',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await lessonService.createLesson(payload)
      toast.success('Tạo bài học thành công')
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể tạo bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const getLessonById = createAsyncThunk<Lesson, string>(
  'lesson/getLessonById',
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await lessonService.getLessonById(lessonId)
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể tải bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateLesson = createAsyncThunk<Lesson, { lessonId: string; payload: UpdateLessonPayload }>(
  'lesson/updateLesson',
  async ({ lessonId, payload }, { rejectWithValue }) => {
    try {
      const response = await lessonService.updateLesson(lessonId, payload)
      toast.success('Cập nhật bài học thành công')
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể cập nhật bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const deleteLesson = createAsyncThunk<string, string>(
  'lesson/deleteLesson',
  async (lessonId, { rejectWithValue }) => {
    try {
      await lessonService.deleteLesson(lessonId)
      toast.success('Xóa bài học thành công')
      return lessonId
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể xóa bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const chatAboutLesson = createAsyncThunk<ChatAboutLessonResponse, { lessonId: string }>(
  'lesson/chatAboutLesson',
  async ({ lessonId }, { rejectWithValue }) => {
    try {
      const response = await lessonService.chatAboutLesson(lessonId)
      return response.data
    } catch (error) {
      const errorMessage = (error as any).response?.data.detail || 'Không thể gửi tin nhắn về bài học'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonsCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLessonsCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchLessonsCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(createLessonCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createLessonCategory.fulfilled, (state, action) => {
        state.loading = false
        state.categories.push(action.payload)
        state.allLessons.total_categories += 1
        state.allLessons.categories[action.payload.name] = []
        state.allLessons.categories = Object.fromEntries(
          Object.entries(state.allLessons.categories).sort(([a], [b]) => a.localeCompare(b))
        ) // Sort categories alphabetically
        toast.success('Tạo danh mục bài học thành công')
      })
      .addCase(createLessonCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(updateLessonCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateLessonCategory.fulfilled, (state, action) => {
        state.loading = false
        const index = state.categories.findIndex((cat) => cat.id === action.payload.id)
        if (index !== -1) {
          state.categories[index] = action.payload
          state.allLessons.categories[action.payload.name] = [] // Reset lessons for the updated category
          state.allLessons.total_categories = Object.keys(state.allLessons.categories).length
          state.allLessons.categories = Object.fromEntries(
            Object.entries(state.allLessons.categories).sort(([a], [b]) => a.localeCompare(b))
          ) // Sort categories alphabetically
          toast.success('Cập nhật danh mục bài học thành công')
        }
        state.allLessons.total_categories = Object.keys(state.allLessons.categories).length
        state.allLessons.categories = Object.fromEntries(
          Object.entries(state.allLessons.categories).sort(([a], [b]) => a.localeCompare(b))
        ) // Sort categories alphabetically
      })
      .addCase(updateLessonCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(deleteLessonCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteLessonCategory.fulfilled, (state, action) => {
        state.loading = false
        const categoryId = action.payload
        state.categories = state.categories.filter((cat) => cat.id !== categoryId)
        delete state.allLessons.categories[categoryId]
        state.allLessons.total_categories = Object.keys(state.allLessons.categories).length
        state.allLessons.total_lessons = Object.values(state.allLessons.categories).reduce(
          (total, lessons) => total + lessons.length,
          0
        )
        toast.success('Xóa danh mục bài học thành công')
        state.allLessons.categories = Object.fromEntries(
          Object.entries(state.allLessons.categories).sort(([a], [b]) => a.localeCompare(b))
        ) // Sort categories alphabetically
      })
      .addCase(deleteLessonCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchAllLessons.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllLessons.fulfilled, (state, action) => {
        state.loading = false
        state.allLessons = action.payload
        state.lessons = Object.values(action.payload.categories).flat()
      })
      .addCase(fetchAllLessons.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createLesson.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createLesson.fulfilled, (state) => {
        state.loading = false
        toast.success('Tạo bài học thành công')
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getLessonById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getLessonById.fulfilled, (state) => {
        state.loading = false
        toast.success('Tải bài học thành công')
      })
      .addCase(getLessonById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateLesson.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateLesson.fulfilled, (state) => {
        state.loading = false
        toast.success('Cập nhật bài học thành công')
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteLesson.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(chatAboutLesson.pending, (state) => {
        state.chatLoading = true
        state.chatError = null
      })
      .addCase(chatAboutLesson.fulfilled, (state, action) => {
        state.chatLoading = false
        state.chatMessages.push(action.payload)
      })
      .addCase(chatAboutLesson.rejected, (state, action) => {
        state.chatLoading = false
        state.chatError = action.payload as string
        toast.error(state.chatError)
      })
      .addDefaultCase((state) => {
        state.loading = false
        state.error = null
      })
  }
})

export const lessonActions = lessonSlice.actions
const lessonReducer = lessonSlice.reducer
export default lessonReducer
