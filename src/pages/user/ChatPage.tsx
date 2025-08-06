import { useAppDispatch, useAppSelector } from '@/app/hook'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { deleteChatHistories, fetchChatHistories, fetchSuggestedQuestions, sendMessage } from '@/slices/chat.slice'
import type { ChatHistory } from '@/types/chat'
import { Bot, Loader2, Send, Trash2, User } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import remarkGfm from 'remark-gfm'

const ChatPage = () => {
  const dispatch = useAppDispatch()
  const { histories, loadingSend, loadingHistories, error, suggestedQuestions } = useAppSelector((state) => state.chat)

  // Fetch suggested questions if no chat history
  useEffect(() => {
    if (histories.length === 0) {
      dispatch(fetchSuggestedQuestions())
    }
  }, [dispatch, histories.length])

  const [inputMessage, setInputMessage] = useState('')
  const [hasMoreHistory, setHasMoreHistory] = useState(true)
  const [pendingUserMessage, setPendingUserMessage] = useState<ChatHistory | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Helper function to get display messages including welcome message and pending message
  const getDisplayMessages = (histories: ChatHistory[]): ChatHistory[] => {
    let messages: ChatHistory[] = []

    if (histories.length === 0 && !loadingHistories) {
      // Return welcome message if no history
      messages = [
        {
          id: 'welcome',
          content:
            'Chào bạn! Tôi là AI trợ lý học tập chứng khoán. Bạn có thể hỏi tôi về bất kỳ điều gì liên quan đến thị trường chứng khoán, phân tích kỹ thuật, đầu tư, và nhiều chủ đề khác. Bạn muốn học về điều gì hôm nay?',
          role: 'assistant',
          message_order: 0,
          session_id: '',
          created_at: new Date().toISOString()
        }
      ]
    } else {
      // Create a copy of the array before sorting to avoid mutating the Redux store
      messages = [...histories].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    // Add pending user message if exists
    if (pendingUserMessage) {
      messages.push(pendingUserMessage)
    }

    return messages
  }
  // Handler for clicking a suggested question
  const handleSuggestedQuestionClick = (question: string) => {
    if (!loadingSend) {
      setInputMessage(question)
    }
  }

  // Helper function to determine if message is from AI
  const isAIMessage = (role: string) => role === 'assistant'

  // Helper function to format timestamp
  const formatTimestamp = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Component to render formatted message content
  const MessageContent = ({ content, isUserMessage = false }: { content: string; isUserMessage?: boolean }) => {
    const codeBlockBg = isUserMessage ? 'bg-blue-500' : 'bg-gray-200'
    const codeBg = isUserMessage ? 'bg-blue-500' : 'bg-gray-200'
    const textColor = isUserMessage ? 'text-white' : 'text-gray-900'
    const borderColor = isUserMessage ? 'border-blue-300' : 'border-gray-300'

    return (
      <div className={`text-sm leading-relaxed ${textColor}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className='text-lg font-bold mb-2'>{children}</h1>,
            h2: ({ children }) => <h2 className='text-base font-bold mb-2'>{children}</h2>,
            h3: ({ children }) => <h3 className='text-sm font-bold mb-1'>{children}</h3>,
            p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
            strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
            em: ({ children }) => <em className='italic'>{children}</em>,
            code: ({ children, ...props }) => {
              const isInline = !props.className?.includes('language-')
              return isInline ? (
                <code
                  className={`${codeBg} px-1 py-0.5 rounded text-xs font-mono ${isUserMessage ? 'text-blue-100' : 'text-gray-800'}`}
                >
                  {children}
                </code>
              ) : (
                <pre className={`${codeBlockBg} p-2 rounded mt-2 overflow-x-auto`}>
                  <code className={`text-xs font-mono ${isUserMessage ? 'text-blue-100' : 'text-gray-800'}`}>
                    {children}
                  </code>
                </pre>
              )
            },
            ul: ({ children }) => <ul className='list-disc list-inside mb-2 space-y-1'>{children}</ul>,
            ol: ({ children }) => <ol className='list-decimal list-inside mb-2 space-y-1'>{children}</ol>,
            li: ({ children }) => <li className='ml-2'>{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className={`border-l-4 ${borderColor} pl-4 italic my-2`}>{children}</blockquote>
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  // Load chat history on component mount
  useEffect(() => {
    dispatch(fetchChatHistories({ limit: 20 }))
  }, [dispatch])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loadingSend) return

    const messageToSend = inputMessage
    setInputMessage('')

    // Create pending user message for immediate display
    const pendingMessage: ChatHistory = {
      id: `pending-${Date.now()}`,
      content: messageToSend,
      role: 'user',
      message_order: 0,
      session_id: '',
      created_at: new Date().toISOString()
    }

    // Set pending message to show immediately
    setPendingUserMessage(pendingMessage)

    // Safety timeout to clear pending message after 10 seconds
    const timeoutId = setTimeout(() => {
      setPendingUserMessage(null)
    }, 10000)

    try {
      // Send message and wait for response
      await dispatch(sendMessage({ message: messageToSend })).unwrap()

      // Clear timeout since we'll refresh history
      clearTimeout(timeoutId)

      // Clear pending message immediately to avoid showing wrong role
      setPendingUserMessage(null)

      // Small delay to ensure API has processed, then refresh history
      setTimeout(() => {
        dispatch(fetchChatHistories({ limit: 50 }))
      }, 300)
    } catch (error) {
      console.error('Error sending message:', error)
      // Clear timeout and pending message on error
      clearTimeout(timeoutId)
      setPendingUserMessage(null)
    } finally {
      // Focus back to input after sending
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 200)
    }
  }

  const loadMoreHistory = async () => {
    if (loadingHistories || !hasMoreHistory) return

    try {
      const result = await dispatch(
        fetchChatHistories({
          limit: 20
        })
      ).unwrap()

      if (result.length < 20) {
        setHasMoreHistory(false)
      }
    } catch (error) {
      console.error('Error loading history:', error)
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
    if (scrollTop === 0 && hasMoreHistory && !loadingHistories) {
      await loadMoreHistory()
    }
  }

  const handleDeleteHistories = async () => {
    if (loadingHistories) return

    try {
      // Clear pending user message first
      setPendingUserMessage(null)

      // Dispatch delete action
      await dispatch(deleteChatHistories()).unwrap()

      // Clear local state and Redux store
      setHasMoreHistory(true)

      // Show success toast
      toast.success('Đã xóa lịch sử trò chuyện thành công! Tất cả tin nhắn đã được xóa khỏi hệ thống.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    } catch (error) {
      console.error('Error deleting histories:', error)

      // Show error toast
      toast.error('Có lỗi xảy ra khi xóa lịch sử. Vui lòng thử lại sau.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    }
  }

  // Get messages from Redux store
  const messages = getDisplayMessages(histories)

  // Auto clear pending message when Redux histories change (indicating new messages received)
  useEffect(() => {
    if (pendingUserMessage && histories.length > 0) {
      // Get the most recent messages to check if our conversation has been updated
      const sortedHistories = [...histories].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      // Check if we have both user message and AI response after our pending message time
      const pendingTime = new Date(pendingUserMessage.created_at).getTime()
      const recentMessages = sortedHistories.filter((msg) => new Date(msg.created_at).getTime() >= pendingTime)

      // If we have recent messages that include our user message, clear pending
      const hasUserMessage = recentMessages.some(
        (msg) => msg.role === 'user' && msg.content === pendingUserMessage.content
      )

      if (hasUserMessage) {
        setPendingUserMessage(null)
      }
    }
  }, [histories, pendingUserMessage])

  // Clear pending message immediately when send operation completes
  useEffect(() => {
    if (!loadingSend && pendingUserMessage) {
      // Small delay to let Redux store update, then clear pending
      const timeoutId = setTimeout(() => {
        setPendingUserMessage(null)
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [loadingSend, pendingUserMessage])

  // Auto scroll to bottom when new messages arrive or pending message changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [histories, pendingUserMessage])

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
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Bot className='w-4 h-4 md:w-6 md:h-6 text-blue-600' />
                <h1 className='text-base md:text-xl font-semibold'>AI Học Chứng Khoán</h1>
              </div>

              {/* Clear History Button - only show if there are messages */}
              {histories.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={loadingHistories}
                      size='sm'
                      variant='outline'
                      className='flex items-center gap-1 text-xs md:text-sm cursor-pointer disabled:cursor-not-allowed border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700'
                    >
                      {loadingHistories ? (
                        <Loader2 className='w-3 h-3 md:w-4 md:h-4 animate-spin' />
                      ) : (
                        <Trash2 className='w-3 h-3 md:w-4 md:h-4' />
                      )}
                      <span className='hidden md:inline'>Xóa lịch sử</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa lịch sử</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className='cursor-pointer'>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteHistories}
                        className='bg-red-600 hover:bg-red-700 text-white cursor-pointer flex items-center gap-2'
                      >
                        <Trash2 className='w-4 h-4' />
                        Xóa lịch sử
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto px-3 md:px-6 pb-4' ref={messagesContainerRef} onScroll={handleScroll}>
            {loadingHistories && (
              <div className='flex justify-center py-4'>
                <Loader2 className='w-4 h-4 md:w-6 md:h-6 animate-spin text-blue-600' />
                <span className='ml-2 text-xs md:text-sm text-muted-foreground'>Đang tải lịch sử...</span>
              </div>
            )}

            {error && (
              <div className='flex justify-center py-4'>
                <div className='bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm'>Có lỗi xảy ra: {error}</div>
              </div>
            )}

            <div className='space-y-2 md:space-y-4'>
              {messages.map((message, idx) => (
                <div
                  key={message.id}
                  className={`flex gap-2 md:gap-3 ${!isAIMessage(message.role) ? 'justify-end' : 'justify-start'}`}
                >
                  {isAIMessage(message.role) && (
                    <Avatar className='w-6 h-6 md:w-8 md:h-8 shrink-0 mt-1'>
                      <AvatarFallback className='bg-blue-100'>
                        <Bot className='w-3 h-3 md:w-4 md:h-4 text-blue-600' />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-lg px-3 py-2 ${
                      !isAIMessage(message.role) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <MessageContent content={message.content} isUserMessage={!isAIMessage(message.role)} />
                    <span
                      className={`text-xs mt-1 block opacity-70 ${
                        !isAIMessage(message.role) ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTimestamp(message.created_at)}
                    </span>

                    {/* Show suggested questions below welcome message if no history */}
                    {histories.length === 0 && idx === 0 && suggestedQuestions && suggestedQuestions.length > 0 && (
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {suggestedQuestions.map((q) => (
                          <Button
                            key={q}
                            variant='outline'
                            size='sm'
                            className='border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-900 transition-colors duration-150 text-xs md:text-sm px-3 py-1 rounded-full'
                            onClick={() => handleSuggestedQuestionClick(q)}
                            disabled={loadingSend}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isAIMessage(message.role) && (
                    <Avatar className='w-6 h-6 md:w-8 md:h-8 shrink-0 mt-1'>
                      <AvatarFallback className='bg-green-100'>
                        <User className='w-3 h-3 md:w-4 md:h-4 text-green-600' />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {loadingSend && (
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
                disabled={loadingSend}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loadingSend}
              size='icon'
              className='h-11 w-11 shrink-0 bg-blue-600 hover:bg-blue-700 shadow-none cursor-pointer disabled:cursor-not-allowed'
            >
              {loadingSend ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
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

export default ChatPage
