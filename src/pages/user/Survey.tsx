import { useAppDispatch, useAppSelector } from '@/app/hook'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { fetchQuestions, fetchSurveyStatus, submitSurvey } from '@/slices/survey.slice'
import type { SurveyPayload } from '@/types/survey'
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, FileText, History, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

const Survey = () => {
  const { questions, isLoading, error, isSubmitting, status } = useAppSelector((state) => state.survey)
  const dispatch = useAppDispatch()

  const [currentPart, setCurrentPart] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchSurveyStatus())
  }, [])

  useEffect(() => {
    if (window.location.href.includes('action=reset')) {
      dispatch(fetchQuestions())
    } else {
      if (status?.is_completed) {
        setIsCompleted(true)
        toast.info('Bạn đã hoàn thành khảo sát này trước đó.')
      } else {
        dispatch(fetchQuestions())
      }
    }
  }, [status])

  // Use mock data if API fails or for development
  const surveyData = questions

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 flex items-center justify-center'>
        <Card className='w-full max-w-md text-center p-6'>
          <div className='space-y-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='text-gray-600'>Đang tải câu hỏi khảo sát...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 flex items-center justify-center'>
        <Card className='w-full max-w-md text-center p-6'>
          <div className='space-y-4'>
            <div className='text-red-500 text-xl'>⚠️</div>
            <h3 className='text-lg font-semibold text-gray-800'>Có lỗi xảy ra</h3>
            <p className='text-gray-600'>{error}</p>
            <div className='flex gap-2'>
              <Button onClick={() => dispatch(fetchQuestions())} className='flex-1'>
                Thử lại
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!surveyData) return null

  const parts = [surveyData.part1, surveyData.part2, surveyData.part3].filter(Boolean)
  const currentPartData = parts[currentPart]
  const currentQuestion = currentPartData?.questions?.[currentQuestionIndex]

  // Calculate total progress
  const totalQuestions = parts.reduce((sum, part) => sum + (part?.questions?.length || 0), 0)
  const answeredQuestions = Object.keys(answers).length
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  const getPartInfo = (partIndex: number) => {
    switch (partIndex) {
      case 0:
        return { name: parts[0].title, icon: History, color: 'bg-blue-500' }
      case 1:
        return { name: parts[1].title, icon: Clock, color: 'bg-green-500' }
      case 2:
        return { name: parts[2].title, icon: Target, color: 'bg-purple-500' }
      default:
        return { name: '', icon: FileText, color: '' }
    }
  }

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < (currentPartData?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else if (currentPart < parts.length - 1) {
      setCurrentPart((prev) => prev + 1)
      setCurrentQuestionIndex(0)
    } else {
      // Survey completed
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    } else if (currentPart > 0) {
      setCurrentPart((prev) => prev - 1)
      setCurrentQuestionIndex((parts[currentPart - 1]?.questions?.length || 1) - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Convert answers to survey payload format
      const surveyPayload: Partial<SurveyPayload> = {}

      // Map answers to survey fields
      Object.entries(answers).forEach(([questionId, answer]) => {
        const fieldName = questionId as keyof SurveyPayload
        if (Array.isArray(answer)) {
          ;(surveyPayload as any)[fieldName] = answer
        } else {
          ;(surveyPayload as any)[fieldName] = answer
        }
      })

      await dispatch(submitSurvey(surveyPayload as SurveyPayload)).unwrap()
      toast.success('Đã nộp khảo sát thành công!')
      navigate('/')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi nộp khảo sát')
    }
  }

  // Show completion screen
  if (isCompleted) {
    return (
      <div className='min-h-screen bg-gray-50 p-4'>
        <div className='max-w-2xl mx-auto pt-8'>
          <Card className='text-center border-2 border-green-200 shadow-lg bg-white'>
            <CardHeader className='pb-4'>
              <div className='flex justify-center mb-4'>
                <CheckCircle2 className='h-16 w-16 text-green-500' />
              </div>
              <CardTitle className='text-2xl font-bold text-green-800'>Hoàn thành khảo sát!</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <p className='text-gray-600 text-lg'>Cảm ơn bạn đã dành thời gian hoàn thành khảo sát của chúng tôi.</p>

              <div className='grid grid-cols-3 gap-4 text-sm'>
                {parts.map((part, index) => {
                  const info = getPartInfo(index)
                  const PartIcon = info.icon
                  return (
                    <div key={index} className='text-center p-3 bg-green-50 rounded-lg border border-green-200'>
                      <PartIcon className='h-6 w-6 mx-auto mb-2 text-green-600' />
                      <div className='font-semibold text-green-800'>{info.name}</div>
                      <div className='text-green-600'>{part?.questions?.length || 0} câu</div>
                    </div>
                  )
                })}
              </div>

              <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                <p className='text-blue-800 font-medium mb-2'>📊 Thống kê hoàn thành</p>
                <p className='text-blue-700 text-sm'>
                  Đã trả lời: {answeredQuestions}/{totalQuestions} câu hỏi ({Math.round(progress)}%)
                </p>
              </div>

              <div className='flex gap-3'>
                <Button
                  onClick={() => {
                    window.location.href = '/survey?action=reset'
                  }}
                  variant='outline'
                  className='flex-1'
                >
                  Làm lại khảo sát
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='flex-1 bg-green-600 hover:bg-green-700'
                >
                  {isSubmitting ? 'Đang nộp...' : 'Nộp khảo sát'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const partInfo = getPartInfo(currentPart)
  const PartIcon = partInfo.icon
  const currentAnswer = answers[currentQuestion.id]
  const isCurrentQuestionAnswered = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== ''

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-4xl mx-auto pt-8'>
        {/* Header với thông tin progress */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <div className={`p-2 rounded-full ${partInfo.color} text-white`}>
                <PartIcon className='h-5 w-5' />
              </div>
              <div>
                <h1 className='text-xl font-bold text-gray-800'>Khảo sát đầu tư</h1>
                <p className='text-sm text-gray-600'>
                  Phần {currentPart + 1}/3: {partInfo.name}
                </p>
              </div>
            </div>
            <Badge
              variant='secondary'
              className='px-3 py-1 text-sm font-semibold bg-white border-2 border-blue-200 text-blue-700'
            >
              Câu {currentQuestionIndex + 1}/{currentPartData?.questions?.length || 0}
            </Badge>
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-gray-600'>
              <span>Tiến độ tổng thể</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className='h-3 bg-gray-200' />
          </div>
        </div>

        {/* Câu hỏi */}
        <Card className='border-2 border-blue-200 shadow-lg bg-white'>
          <CardHeader className='pb-4'>
            <div className='flex items-start space-x-3'>
              <div
                className={`w-8 h-8 rounded-full ${partInfo.color} text-white flex-shrink-0 flex items-center justify-center`}
              >
                <span className='text-sm font-bold'>{currentQuestionIndex + 1}</span>
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
              {currentQuestion.multiple ? (
                // Multiple choice với checkbox
                <div className='space-y-3'>
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50'
                    >
                      <Checkbox
                        id={`option-${index}`}
                        checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                        onCheckedChange={(checked) => {
                          const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : []
                          if (checked) {
                            const maxSelections = (currentQuestion as any).max_selections
                            if (maxSelections && currentAnswers.length >= maxSelections) {
                              toast.warning(`Chỉ được chọn tối đa ${maxSelections} lựa chọn`)
                              return
                            }
                            handleAnswerChange(currentQuestion.id, [...currentAnswers, option])
                          } else {
                            handleAnswerChange(
                              currentQuestion.id,
                              currentAnswers.filter((a) => a !== option)
                            )
                          }
                        }}
                      />
                      <Label htmlFor={`option-${index}`} className='flex-1 cursor-pointer'>
                        {option}
                      </Label>
                    </div>
                  ))}
                  {(currentQuestion as any).max_selections && (
                    <p className='text-sm text-gray-500 italic'>
                      * Chọn tối đa {(currentQuestion as any).max_selections} lựa chọn
                    </p>
                  )}
                </div>
              ) : (
                // Single choice với radio
                <RadioGroup
                  value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50'
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className='flex-1 cursor-pointer'>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>

            {/* Navigation buttons */}
            <div className='pt-6 border-t border-gray-200'>
              <div className='flex gap-3'>
                {(currentPart > 0 || currentQuestionIndex > 0) && (
                  <Button onClick={handlePrevious} variant='outline' className='flex items-center gap-2'>
                    <ChevronLeft className='h-4 w-4' />
                    Quay lại
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered}
                  className={`flex-1 flex items-center gap-2 ${
                    isCurrentQuestionAnswered
                      ? `${partInfo.color} hover:opacity-90 text-white`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentPart === parts.length - 1 &&
                  currentQuestionIndex === (currentPartData?.questions?.length || 1) - 1
                    ? 'Hoàn thành khảo sát'
                    : 'Tiếp tục'}
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin các phần */}
        <div className='mt-6 grid grid-cols-3 gap-4 text-xs'>
          {parts.map((part, index) => {
            const info = getPartInfo(index)
            const PartIconComponent = info.icon
            const isActive = currentPart === index
            const isCompleted = index < currentPart
            const partAnsweredQuestions = part?.questions?.filter((q) => answers[q.id] !== undefined).length || 0

            return (
              <div
                key={index}
                className={`text-center p-3 rounded-lg border-2 transition-all duration-200 ${
                  isActive
                    ? `${info.color} text-white border-transparent shadow-lg`
                    : isCompleted
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                <PartIconComponent className='h-5 w-5 mx-auto mb-1' />
                <div className='font-semibold'>{info.name}</div>
                <div className='text-xs opacity-80'>
                  {partAnsweredQuestions}/{part?.questions?.length || 0} câu
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Survey
