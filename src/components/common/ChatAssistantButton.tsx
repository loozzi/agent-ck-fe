import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import ChatAssistantPopup from './ChatAssistantPopup'

const ChatAssistantButton: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const handleOpenPopup = () => {
    setIsPopupOpen(true)
    setIsMinimized(false)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setIsMinimized(false)
  }

  const handleMinimizePopup = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {/* Floating Chat Button - Only show when popup is closed */}
      {!isPopupOpen && (
        <div className='fixed bottom-6 right-6 z-40 md:bottom-6 md:right-6'>
          <Button
            onClick={handleOpenPopup}
            className='w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer'
            size='default'
          >
            <div className='relative'>
              <MessageCircle className='w-6 h-6 text-white' />
              {/* Active indicator */}
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-sm' />
            </div>
          </Button>

          {/* Tooltip - Only show on desktop */}
          <div className='absolute bottom-16 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden md:block'>
            Chat với AI trợ lý
          </div>
        </div>
      )}

      {/* Chat Popup */}
      <ChatAssistantPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onMinimize={handleMinimizePopup}
        isMinimized={isMinimized}
      />
    </>
  )
}

export default ChatAssistantButton
