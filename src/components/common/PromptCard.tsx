import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Prompt } from '@/types/prompts'
import { Calendar, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DeletePromptDialog from './DeletePromptDialog'
import EditPromptDialog from './EditPromptDialog'

interface PromptCardProps {
  prompt: Prompt
  onUpdated?: () => void
  onDeleted?: () => void
}

const PromptCard = ({ prompt, onUpdated, onDeleted }: PromptCardProps) => {
  const navigate = useNavigate()

  const handleViewDetail = () => {
    navigate(`/trainer/prompts/${prompt.id}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'trading':
        return 'bg-blue-100 text-blue-800'
      case 'analysis':
        return 'bg-green-100 text-green-800'
      case 'education':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className='hover:shadow-lg transition-shadow duration-200 cursor-pointer'>
      <CardHeader className='pb-3'>
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <CardTitle className='text-lg mb-1 hover:text-blue-600 transition-colors'>{prompt.name}</CardTitle>
            <CardDescription className='text-sm line-clamp-2'>{prompt.description}</CardDescription>
          </div>
          <div className='flex items-center space-x-1'>
            <Badge
              variant={prompt.is_active ? 'default' : 'secondary'}
              className={prompt.is_active ? 'bg-green-500' : 'bg-gray-400'}
            >
              {prompt.is_active ? 'Hoạt động' : 'Tạm dừng'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Badge className={getCategoryColor(prompt.category)}>{prompt.category}</Badge>
          </div>

          <div className='text-sm text-gray-600 bg-gray-50 p-3 rounded-md'>
            <div className='line-clamp-3'>{prompt.prompt_text}</div>
          </div>

          <div className='flex items-center justify-between text-xs text-gray-500'>
            <div className='flex items-center space-x-1'>
              <Calendar className='h-3 w-3' />
              <span>{formatDate(prompt.created_at)}</span>
            </div>
          </div>

          <div className='flex items-center justify-between pt-2 border-t'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleViewDetail}
              className='flex items-center space-x-1 cursor-pointer'
            >
              <Eye className='h-4 w-4' />
              <span>Chi tiết</span>
            </Button>

            <div className='flex items-center space-x-2'>
              <EditPromptDialog prompt={prompt} onUpdated={onUpdated} />
              <DeletePromptDialog promptId={prompt.id} promptName={prompt.name} onDeleted={onDeleted} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PromptCard
