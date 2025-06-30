import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

const Learning = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        'Chào bạn! Tôi là AI trợ lý học tập chứng khoán. Bạn có thể hỏi tôi về bất kỳ điều gì liên quan đến thị trường chứng khoán, phân tích kỹ thuật, đầu tư, và nhiều chủ đề khác. Bạn muốn học về điều gì hôm nay?',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasMoreHistory, setHasMoreHistory] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Mock API call để gửi tin nhắn
  const sendMessageToAI = async (message: string): Promise<string> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Mock responses based on keywords
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('chứng khoán') || lowerMessage.includes('cổ phiếu')) {
      return 'Chứng khoán là một công cụ đầu tư quan trọng. Để đầu tư hiệu quả, bạn cần hiểu về phân tích cơ bản và phân tích kỹ thuật. Bạn muốn tìm hiểu về phương pháp nào trước?'
    } else if (lowerMessage.includes('phân tích')) {
      return 'Có hai loại phân tích chính: Phân tích cơ bản (fundamental analysis) tập trung vào giá trị thực của công ty, và phân tích kỹ thuật (technical analysis) dựa trên biểu đồ giá và volume. Bạn muốn học về loại nào?'
    } else if (lowerMessage.includes('risk') || lowerMessage.includes('rủi ro')) {
      return 'Quản lý rủi ro là yếu tố then chốt trong đầu tư. Một số nguyên tắc cơ bản: đa dạng hóa danh mục, đặt stop-loss, không đầu tư quá 5-10% vào một cổ phiếu, và chỉ đầu tư số tiền có thể chấp nhận mất.'
    }

    return `Tôi hiểu bạn đang hỏi về "${message}". Đây là một chủ đề thú vị trong lĩnh vực chứng khoán. Để tôi giải thích chi tiết hơn cho bạn...`
  }

  // Mock API call để tải lịch sử
  const loadHistoryMessages = async (): Promise<Message[]> => {
    setIsLoadingHistory(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock historical messages
    const historyMessages: Message[] = [
      {
        id: `history-${Date.now()}-1`,
        content: 'Làm thế nào để phân tích một cổ phiếu?',
        sender: 'user',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: `history-${Date.now()}-2`,
        content:
          'Để phân tích một cổ phiếu, bạn cần xem xét nhiều yếu tố: tình hình tài chính công ty, xu hướng ngành, biểu đồ kỹ thuật, và các chỉ số định giá như P/E, P/B...',
        sender: 'ai',
        timestamp: new Date(Date.now() - 3590000)
      }
    ]

    setIsLoadingHistory(false)
    return historyMessages
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const aiResponse = await sendMessageToAI(inputMessage)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
      // Focus back to input after AI response
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget

    // Khi scroll lên đầu và còn lịch sử để tải
    if (scrollTop === 0 && hasMoreHistory && !isLoadingHistory) {
      try {
        const historyMessages = await loadHistoryMessages()
        if (historyMessages.length > 0) {
          const currentScrollHeight = e.currentTarget.scrollHeight
          setMessages((prev) => [...historyMessages, ...prev])

          // Maintain scroll position after adding history
          setTimeout(() => {
            if (messagesContainerRef.current) {
              const newScrollHeight = messagesContainerRef.current.scrollHeight
              messagesContainerRef.current.scrollTop = newScrollHeight - currentScrollHeight
            }
          }, 100)
        } else {
          setHasMoreHistory(false)
        }
      } catch (error) {
        console.error('Error loading history:', error)
      }
    }
  }

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputMessage])

  return (
    <div className='flex flex-col h-full'>
      {/* Chat content area */}
      <div className='flex-1 overflow-hidden'>
        <div className='h-full flex flex-col mx-auto'>
          {/* Header */}
          <div className='shrink-0 px-3 md:px-6 py-3 md:py-4'>
            <div className='flex items-center gap-2'>
              <Bot className='w-4 h-4 md:w-6 md:h-6 text-blue-600' />
              <h1 className='text-base md:text-xl font-semibold'>AI Học Chứng Khoán</h1>{' '}
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto px-3 md:px-6 pb-4' ref={messagesContainerRef} onScroll={handleScroll}>
            {isLoadingHistory && (
              <div className='flex justify-center py-4'>
                <Loader2 className='w-4 h-4 md:w-6 md:h-6 animate-spin text-blue-600' />
                <span className='ml-2 text-xs md:text-sm text-muted-foreground'>Đang tải lịch sử...</span>
              </div>
            )}

            <div className='space-y-2 md:space-y-4'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 md:gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <Avatar className='w-6 h-6 md:w-8 md:h-8 shrink-0 mt-1'>
                      <AvatarFallback className='bg-blue-100'>
                        <Bot className='w-3 h-3 md:w-4 md:h-4 text-blue-600' />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-lg px-3 py-2 ${
                      message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className='text-sm whitespace-pre-wrap break-words leading-relaxed'>{message.content}</p>
                    <span
                      className={`text-xs mt-1 block opacity-70 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {message.sender === 'user' && (
                    <Avatar className='w-6 h-6 md:w-8 md:h-8 shrink-0 mt-1'>
                      <AvatarFallback className='bg-green-100'>
                        <User className='w-3 h-3 md:w-4 md:h-4 text-green-600' />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className='flex gap-2 md:gap-3 justify-start'>
                  <Avatar className='w-6 h-6 md:w-8 md:h-8 shrink-0 mt-1'>
                    <AvatarFallback className='bg-blue-100'>
                      <Bot className='w-3 h-3 md:w-4 md:h-4 text-blue-600' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='bg-gray-100 rounded-lg px-3 py-2'>
                    <div className='flex items-center gap-1'>
                      <Loader2 className='w-3 h-3 md:w-4 md:h-4 animate-spin' />
                      <span className='text-sm text-gray-600'>AI đang trả lời...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Fixed input at bottom */}
      <div className='shrink-0 bg-white p-3 md:p-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex gap-2'>
            <div className='flex-1 relative'>
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Nhập câu hỏi về chứng khoán...'
                className='min-h-[44px] max-h-24 md:max-h-32 resize-none text-sm border-0 focus:border-0 focus:ring-0 shadow-none bg-gray-50 rounded-lg'
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size='icon'
              className='h-11 w-11 shrink-0 bg-blue-600 hover:bg-blue-700 shadow-none'
            >
              {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
            </Button>
          </div>
          <p className='text-xs text-muted-foreground mt-2 text-center md:text-left'>
            Nhấn Enter để gửi tin nhắn, Shift+Enter để xuống dòng
          </p>
        </div>
      </div>
    </div>
  )
}

export default Learning
