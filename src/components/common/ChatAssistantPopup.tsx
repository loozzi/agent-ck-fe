import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

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
import { Send, Bot, User, Loader2, Trash2, X, Minus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hook'
import { sendMessage, fetchChatHistories, deleteChatHistories } from '@/slices/chat.slice'
import type { ChatHistory } from '@/types/chat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'react-toastify'

interface ChatAssistantPopupProps {
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
}

const ChatAssistantPopup: React.FC<ChatAssistantPopupProps> = ({ isOpen, onClose, onMinimize, isMinimized }) => {
  const dispatch = useAppDispatch()
  const { histories, loadingSend, loadingHistories, error } = useAppSelector((state) => state.chat)

  const [inputMessage, setInputMessage] = useState('')
  const [hasMoreHistory, setHasMoreHistory] = useState(true)
  const [pendingUserMessage, setPendingUserMessage] = useState<ChatHistory | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Helper function to get display messages including welcome message and pending message
  const getDisplayMessages = (histories: ChatHistory[]): ChatHistory[] => {
    let messages: ChatHistory[] = []

    if (histories.length === 0) {
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
    if (isOpen && !isMinimized) {
      dispatch(fetchChatHistories({ limit: 20 }))
    }
  }, [dispatch, isOpen, isMinimized])

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
      toast.success('Đã xóa lịch sử trò chuyện thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    } catch (error) {
      console.error('Error deleting histories:', error)
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

  // Auto clear pending message when Redux histories change
  useEffect(() => {
    if (pendingUserMessage && histories.length > 0) {
      const sortedHistories = [...histories].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      const pendingTime = new Date(pendingUserMessage.created_at).getTime()
      const recentMessages = sortedHistories.filter((msg) => new Date(msg.created_at).getTime() >= pendingTime)

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
      const timeoutId = setTimeout(() => {
        setPendingUserMessage(null)
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [loadingSend, pendingUserMessage])

  // Auto scroll to bottom when new messages arrive or pending message changes
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [histories, pendingUserMessage, isOpen, isMinimized])

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputMessage])

  if (!isOpen) return null

  return (
    <div className='fixed bottom-0 right-0 z-50'>
      {/* Minimized State */}
      {isMinimized && (
        <Card className='w-16 h-16 cursor-pointer hover:scale-105 transition-transform shadow-lg border-2 border-blue-200 m-4'>
          <CardContent className='p-0 h-full flex items-center justify-center' onClick={onMinimize}>
            <div className='relative'>
              <Bot className='w-8 h-8 text-blue-600' />
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse' />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expanded State */}
      {!isMinimized && (
        <Card className='w-full max-w-sm md:w-96 h-screen md:h-[500px] shadow-2xl border-2 border-blue-200 flex flex-col fixed bottom-0 right-0 left-0 md:left-auto md:bottom-4 md:right-4 p-0 overflow-hidden gap-0'>
          {/* Header */}
          <CardHeader className='p-3 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Bot className='w-5 h-5' />
                <CardTitle className='text-sm font-semibold'>AI Trợ Lý Chứng Khoán</CardTitle>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
              </div>
              <div className='flex items-center gap-1'>
                {/* Clear History Button */}
                {histories.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={loadingHistories}
                        size='sm'
                        variant='ghost'
                        className='w-7 h-7 p-0 hover:bg-blue-800 text-white'
                      >
                        {loadingHistories ? (
                          <Loader2 className='w-3 h-3 animate-spin' />
                        ) : (
                          <Trash2 className='w-3 h-3' />
                        )}
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
                          className='bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                        >
                          Xóa lịch sử
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {/* Hide minimize button on mobile */}
                <Button
                  onClick={onMinimize}
                  size='sm'
                  variant='ghost'
                  className='hidden md:flex w-7 h-7 p-0 hover:bg-blue-800 text-white'
                >
                  <Minus className='w-3 h-3' />
                </Button>
                <Button
                  onClick={onClose}
                  size='sm'
                  variant='ghost'
                  className='w-7 h-7 p-0 hover:bg-blue-800 text-white'
                >
                  <X className='w-3 h-3' />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <div className='flex-1 overflow-hidden flex flex-col'>
            <div className='flex-1 overflow-y-auto p-3 space-y-3' ref={messagesContainerRef} onScroll={handleScroll}>
              {loadingHistories && (
                <div className='flex justify-center py-4'>
                  <Loader2 className='w-4 h-4 animate-spin text-blue-600' />
                  <span className='ml-2 text-xs text-muted-foreground'>Đang tải lịch sử...</span>
                </div>
              )}

              {error && (
                <div className='flex justify-center py-4'>
                  <div className='bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs'>Có lỗi xảy ra: {error}</div>
                </div>
              )}

              <div className='space-y-3'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${!isAIMessage(message.role) ? 'justify-end' : 'justify-start'}`}
                  >
                    {isAIMessage(message.role) && (
                      <Avatar className='w-6 h-6 shrink-0 mt-1'>
                        <AvatarFallback className='bg-blue-100'>
                          <Bot className='w-3 h-3 text-blue-600' />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
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
                    </div>

                    {!isAIMessage(message.role) && (
                      <Avatar className='w-6 h-6 shrink-0 mt-1'>
                        <AvatarFallback className='bg-green-100'>
                          <User className='w-3 h-3 text-green-600' />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {loadingSend && (
                  <div className='flex gap-2 justify-start'>
                    <Avatar className='w-6 h-6 shrink-0 mt-1'>
                      <AvatarFallback className='bg-blue-100'>
                        <Bot className='w-3 h-3 text-blue-600' />
                      </AvatarFallback>
                    </Avatar>
                    <div className='bg-gray-100 rounded-lg px-3 py-2'>
                      <div className='flex items-center gap-1'>
                        <Loader2 className='w-3 h-3 animate-spin' />
                        <span className='text-xs text-gray-600'>AI đang trả lời...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className='p-3 border-t bg-gray-50'>
            <div className='flex gap-2'>
              <div className='flex-1 relative'>
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Hỏi về chứng khoán...'
                  className='min-h-[36px] max-h-20 resize-none text-sm border-0 focus:border-0 focus:ring-0 shadow-none bg-white rounded-lg'
                  disabled={loadingSend}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || loadingSend}
                size='sm'
                className='h-9 w-9 shrink-0 bg-blue-600 hover:bg-blue-700 shadow-none cursor-pointer disabled:cursor-not-allowed'
              >
                {loadingSend ? <Loader2 className='w-3 h-3 animate-spin' /> : <Send className='w-3 h-3' />}
              </Button>
            </div>
            <p className='text-xs text-muted-foreground mt-1 text-center'>Enter để gửi • Shift+Enter để xuống dòng</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ChatAssistantPopup
