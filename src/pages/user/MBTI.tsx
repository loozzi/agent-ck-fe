import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Target, History, ChevronLeft } from 'lucide-react'
import {
  fetchQuestions,
  selectAnswer,
  confirmAnswer,
  previousQuestion,
  submitAnswers,
  resetTest,
  selectMBTI,
  selectCurrentQuestion,
  selectProgress
} from '@/slices/mbti.slice'
import type { RootState } from '@/app/store'
import type { AppDispatch } from '@/app/store'

const MBTI = () => {
  const dispatch = useDispatch<AppDispatch>()
  const mbtiState = useSelector(selectMBTI)
  const currentQuestion = useSelector(selectCurrentQuestion)
  const progress = useSelector(selectProgress)

  // Get user from auth state - adjust this according to your auth slice structure
  const userId = useSelector((state: RootState) => state.auth.user?.id || 'user-1')

  const {
    questions,
    questionsLoading,
    questionsError,
    currentQuestionIndex,
    selectedAnswer,
    isCompleted,
    submitting,
    submitError,
    result
  } = mbtiState

  // Handle confirm answer and move to next question
  const handleConfirmAnswer = useCallback(() => {
    if (selectedAnswer !== null) {
      // Chỉ lưu local, không gọi API cho từng câu
      dispatch(confirmAnswer())
      // Note: Không cần gọi saveAnswer API nữa
    }
  }, [selectedAnswer, dispatch])
  // Load questions on component mount
  useEffect(() => {
    if (questions.length === 0) {
      dispatch(fetchQuestions({}))
    }
  }, [dispatch, questions.length])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Chỉ xử lý Enter khi không phải completion screen và có đáp án được chọn
      if (event.key === 'Enter' && !isCompleted && !result && selectedAnswer !== null) {
        event.preventDefault()
        handleConfirmAnswer()
      }

      // Handle number keys (1-9) for quick answer selection
      if (event.key >= '1' && event.key <= '9' && !isCompleted && !result && currentQuestion) {
        event.preventDefault()
        const answerIndex = parseInt(event.key) - 1
        if (answerIndex < currentQuestion.options.length) {
          dispatch(selectAnswer(answerIndex))
        }
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedAnswer, isCompleted, result, currentQuestion, dispatch, handleConfirmAnswer])

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    dispatch(selectAnswer(answerIndex))
  }
  // Handle previous question
  const handlePreviousQuestion = () => {
    dispatch(previousQuestion())
  }

  // Handle submit test
  const handleSubmit = async () => {
    if (userId) {
      try {
        await dispatch(submitAnswers(userId)).unwrap()
        // Success - result will be stored in state
      } catch (error) {
        console.error('Submit failed:', error)
      }
    }
  }

  // Handle restart test
  const handleRestart = () => {
    dispatch(resetTest())
  }
  const getPhaseInfo = (phase: number) => {
    switch (phase) {
      case 1:
        return { name: 'Quá khứ', icon: History, color: 'bg-purple-500', questions: '1-7' }
      case 2:
        return { name: 'Hiện tại', icon: Clock, color: 'bg-blue-500', questions: '8-18' }
      case 3:
        return { name: 'Tương lai', icon: Target, color: 'bg-red-500', questions: '19-30' }
      default:
        return { name: '', icon: Clock, color: '', questions: '' }
    }
  }

  // Show loading state
  if (questionsLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 flex items-center justify-center'>
        <Card className='w-full max-w-md text-center p-6'>
          <div className='space-y-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
            <p className='text-gray-600'>Đang tải câu hỏi...</p>
          </div>
        </Card>
      </div>
    )
  }

  // Show error state
  if (questionsError) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 flex items-center justify-center'>
        <Card className='w-full max-w-md text-center p-6'>
          <div className='space-y-4'>
            <div className='text-red-500 text-xl'>⚠️</div>
            <h3 className='text-lg font-semibold text-gray-800'>Có lỗi xảy ra</h3>
            <p className='text-gray-600'>{questionsError}</p>
            <Button onClick={() => dispatch(fetchQuestions({}))} className='mt-4'>
              Thử lại
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Show result if completed and has result
  if (result) {
    return (
      <div className='min-h-screen bg-gray-50 p-4'>
        <div className='max-w-2xl mx-auto pt-8'>
          <Card className='text-center border-2 border-purple-200 shadow-lg bg-white'>
            <CardHeader className='pb-4'>
              <div className='flex justify-center mb-4'>
                <CheckCircle2 className='h-16 w-16 text-green-500' />
              </div>
              <CardTitle className='text-2xl font-bold text-purple-800'>Kết quả MBTI của bạn!</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='text-center'>
                <div className='text-4xl font-bold text-purple-600 mb-2'>{result.result.type}</div>
                <p className='text-gray-600 text-lg mb-4'>{result.result.description}</p>
                <div className='text-sm text-gray-500'>Điểm số: {result.score}/100</div>
              </div>

              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div className='text-center p-3 bg-purple-50 rounded-lg border'>
                  <div className='font-semibold text-purple-800'>E/I</div>
                  <div className='text-purple-600'>
                    {result.result.traits.extraversion > result.result.traits.introversion
                      ? 'Extraversion'
                      : 'Introversion'}
                  </div>
                </div>
                <div className='text-center p-3 bg-blue-50 rounded-lg border'>
                  <div className='font-semibold text-blue-800'>S/N</div>
                  <div className='text-blue-600'>
                    {result.result.traits.sensing > result.result.traits.intuition ? 'Sensing' : 'Intuition'}
                  </div>
                </div>
                <div className='text-center p-3 bg-green-50 rounded-lg border'>
                  <div className='font-semibold text-green-800'>T/F</div>
                  <div className='text-green-600'>
                    {result.result.traits.thinking > result.result.traits.feeling ? 'Thinking' : 'Feeling'}
                  </div>
                </div>
                <div className='text-center p-3 bg-red-50 rounded-lg border'>
                  <div className='font-semibold text-red-800'>J/P</div>
                  <div className='text-red-600'>
                    {result.result.traits.judging > result.result.traits.perceiving ? 'Judging' : 'Perceiving'}
                  </div>
                </div>
              </div>

              <div className='flex gap-3'>
                <Button onClick={handleRestart} variant='outline' className='flex-1'>
                  Làm lại test
                </Button>
                <Button onClick={() => window.print()} className='flex-1 bg-purple-600 hover:bg-purple-700'>
                  In kết quả
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } // Don't render if no current question
  if (!currentQuestion) {
    return null
  }

  const phaseInfo = getPhaseInfo(currentQuestion.phase)
  const PhaseIcon = phaseInfo.icon

  // Show completion screen
  if (isCompleted) {
    return (
      <div className='min-h-screen bg-gray-50 p-4'>
        <div className='max-w-2xl mx-auto pt-8'>
          <Card className='text-center border-2 border-purple-200 shadow-lg bg-white'>
            <CardHeader className='pb-4'>
              <div className='flex justify-center mb-4'>
                <CheckCircle2 className='h-16 w-16 text-green-500' />
              </div>
              <CardTitle className='text-2xl font-bold text-purple-800'>Hoàn thành bài trắc nghiệm!</CardTitle>
            </CardHeader>{' '}
            <CardContent className='space-y-6'>
              <p className='text-gray-600 text-lg'>Bạn đã hoàn thành tất cả {questions.length} câu hỏi.</p>

              <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <p className='text-blue-800 font-medium'>Thông tin quan trọng</p>
                </div>
                <p className='text-blue-700 text-sm'>
                  Câu trả lời của bạn chưa được nộp chính thức. Bạn có thể quay lại kiểm tra và chỉnh sửa trước khi nộp
                  bài.
                </p>
              </div>

              <div className='grid grid-cols-3 gap-4 text-sm'>
                <div className='text-center p-3 bg-purple-100 rounded-lg border border-purple-200'>
                  <History className='h-6 w-6 mx-auto mb-2 text-purple-600' />
                  <div className='font-semibold text-purple-800'>Quá khứ</div>
                  <div className='text-purple-600'>7 câu</div>
                </div>
                <div className='text-center p-3 bg-blue-100 rounded-lg border border-blue-200'>
                  <Clock className='h-6 w-6 mx-auto mb-2 text-blue-600' />
                  <div className='font-semibold text-blue-800'>Hiện tại</div>
                  <div className='text-blue-600'>11 câu</div>
                </div>
                <div className='text-center p-3 bg-red-100 rounded-lg border border-red-200'>
                  <Target className='h-6 w-6 mx-auto mb-2 text-red-600' />
                  <div className='font-semibold text-red-800'>Tương lai</div>
                  <div className='text-red-600'>12 câu</div>
                </div>
              </div>

              {submitError && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-red-600 text-sm'>{submitError}</p>
                </div>
              )}

              <div className='flex gap-3'>
                <Button
                  onClick={() => dispatch(previousQuestion())}
                  variant='outline'
                  className='flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50'
                >
                  <ChevronLeft className='h-4 w-4' />
                  Xem lại
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className='flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-lg'
                  size='lg'
                >
                  {submitting ? 'Đang nộp bài...' : 'Nộp bài trắc nghiệm'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-4xl mx-auto pt-8'>
        {/* Header với thông tin progress */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <div className={`p-2 rounded-full ${phaseInfo.color} text-white`}>
                <PhaseIcon className='h-5 w-5' />
              </div>
              <div>
                <h1 className='text-xl font-bold text-gray-800'>Bài trắc nghiệm MBTI</h1>
                <p className='text-sm text-gray-600'>
                  Phase {currentQuestion.phase}: {phaseInfo.name} (Câu {phaseInfo.questions})
                </p>
              </div>
            </div>
            <Badge
              variant='secondary'
              className='px-3 py-1 text-sm font-semibold bg-white border-2 border-purple-200 text-purple-700'
            >
              {currentQuestionIndex + 1}/{questions.length}
            </Badge>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-gray-600'>
              <span>Tiến độ</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className='h-3 bg-gray-200' />
            {/* Keyboard shortcuts hint */}
            <div className='flex items-center justify-center gap-4 text-xs text-gray-500 mt-2'>
              <span className='flex items-center gap-1'>
                <kbd className='px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono'>
                  1-{currentQuestion?.options.length || 5}
                </kbd>
                Chọn đáp án
              </span>
              <span className='flex items-center gap-1'>
                <kbd className='px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono'>Enter</kbd>
                Xác nhận
              </span>
            </div>
          </div>
        </div>

        {/* Câu hỏi */}
        <Card className='border-2 border-purple-200 shadow-lg bg-white'>
          {' '}
          <CardHeader className='pb-4'>
            <div className='flex items-start space-x-3'>
              <div
                className={`w-8 h-8 rounded-full ${phaseInfo.color} text-white flex-shrink-0 flex items-center justify-center`}
              >
                <span className='text-sm font-bold'>{currentQuestion.id}</span>
              </div>
              <div className='flex-1'>
                <CardTitle className='text-xl font-semibold text-gray-800 leading-relaxed'>
                  {currentQuestion.question}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Các lựa chọn */}
            <div className='space-y-3'>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                    selectedAnswer === index
                      ? `${phaseInfo.color} text-white border-transparent shadow-lg transform scale-[1.02]`
                      : 'bg-white border-gray-200 hover:border-purple-300 text-gray-700'
                  }`}
                >
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index ? 'border-white bg-white/20' : 'border-gray-300'
                      }`}
                    >
                      {selectedAnswer === index && <div className='w-3 h-3 rounded-full bg-white'></div>}
                    </div>
                    <span className='font-medium'>{option}</span>
                  </div>
                </button>
              ))}
            </div>{' '}
            {/* Nút xác nhận */}
            <div className='pt-6 border-t border-gray-200'>
              <div className='flex gap-3'>
                {currentQuestionIndex > 0 && (
                  <Button
                    onClick={handlePreviousQuestion}
                    variant='outline'
                    className='flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50'
                    size='lg'
                  >
                    <ChevronLeft className='h-4 w-4' />
                    Quay lại
                  </Button>
                )}
                <Button
                  onClick={handleConfirmAnswer}
                  disabled={selectedAnswer === null}
                  className={`flex-1 font-semibold py-3 text-lg transition-all duration-200 ${
                    selectedAnswer !== null
                      ? `${phaseInfo.color} hover:opacity-90 text-white shadow-lg`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  size='lg'
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Xác nhận và tiếp tục' : 'Hoàn thành'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin phase */}
        <div className='mt-6 grid grid-cols-3 gap-4 text-xs'>
          {[1, 2, 3].map((phase) => {
            const info = getPhaseInfo(phase)
            const PhaseIconComponent = info.icon
            const isActive = currentQuestion.phase === phase
            const isCompleted =
              phase < currentQuestion.phase || (phase === currentQuestion.phase && currentQuestionIndex > 0)

            return (
              <div
                key={phase}
                className={`text-center p-3 rounded-lg border-2 transition-all duration-200 ${
                  isActive
                    ? `${info.color} text-white border-transparent shadow-lg`
                    : isCompleted
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                <PhaseIconComponent className='h-5 w-5 mx-auto mb-1' />
                <div className='font-semibold'>{info.name}</div>
                <div className='text-xs opacity-80'>Câu {info.questions}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MBTI
