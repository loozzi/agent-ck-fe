// import apiInstance from './axios.config' // Uncomment when using real API
import type {
  GetQuestionsRequest,
  GetQuestionsResponse,
  SubmitAnswersRequest,
  SubmitAnswersResponse,
  SaveAnswerRequest,
  MBTIResult,
  Question
} from '@/types/slices/mbti.types'

// Mock data
const mockQuestions: Question[] = [
  // Phase 1: Quá khứ (câu 1-7)
  {
    id: 1,
    question: 'Trong quá khứ, bạn thường ra quyết định dựa trên điều gì?',
    options: ['Cảm xúc và trực giác', 'Logic và phân tích', 'Kinh nghiệm trước đó', 'Lời khuyên từ người khác'],
    phase: 1
  },
  {
    id: 2,
    question: 'Khi còn nhỏ, bạn thích hoạt động nào nhất?',
    options: ['Chơi một mình', 'Chơi với nhiều bạn', 'Đọc sách', 'Thể thao', 'Vẽ và sáng tạo'],
    phase: 1
  },
  {
    id: 3,
    question: 'Trong các mối quan hệ quá khứ, bạn thường?',
    options: ['Giữ kín cảm xúc', 'Chia sẻ mọi thứ', 'Chọn lọc khi chia sẻ'],
    phase: 1
  },
  {
    id: 4,
    question: 'Thời thơ ấu, bạn thường mơ ước điều gì?',
    options: [
      'Trở thành người nổi tiếng',
      'Có gia đình hạnh phúc',
      'Thành công trong sự nghiệp',
      'Du lịch khắp thế giới'
    ],
    phase: 1
  },
  {
    id: 5,
    question: 'Khi gặp khó khăn trong quá khứ, bạn thường?',
    options: ['Tự giải quyết', 'Nhờ người khác giúp đỡ', 'Tránh né vấn đề'],
    phase: 1
  },
  {
    id: 6,
    question: 'Môi trường học tập yêu thích của bạn là?',
    options: ['Yên tĩnh, ít người', 'Sôi động, nhiều người', 'Linh hoạt theo tâm trạng', 'Có âm nhạc nhẹ'],
    phase: 1
  },
  {
    id: 7,
    question: 'Trong quá khứ, bạn học tốt nhất khi?',
    options: ['Học thuộc lòng', 'Hiểu bản chất vấn đề', 'Thực hành nhiều', 'Thảo luận nhóm', 'Tự nghiên cứu'],
    phase: 1
  },

  // Phase 2: Hiện tại (câu 8-18)
  {
    id: 8,
    question: 'Hiện tại, bạn thích làm việc theo cách nào?',
    options: ['Có kế hoạch rõ ràng', 'Linh hoạt theo tình hình', 'Kết hợp cả hai'],
    phase: 2
  },
  {
    id: 9,
    question: 'Khi gặp người mới, bạn thường?',
    options: ['Chờ họ chủ động', 'Tự giới thiệu trước', 'Quan sát trước khi hành động'],
    phase: 2
  },
  {
    id: 10,
    question: 'Trong công việc hiện tại, bạn tập trung vào?',
    options: ['Chi tiết cụ thể', 'Bức tranh tổng thể', 'Cả hai đều quan trọng', 'Tùy theo tình huống'],
    phase: 2
  },
  {
    id: 11,
    question: 'Cách bạn đưa ra quyết định hiện tại?',
    options: ['Dựa trên dữ liệu', 'Theo cảm nhận', 'Cân nhắc cả hai'],
    phase: 2
  },
  {
    id: 12,
    question: 'Khi làm việc nhóm, bạn thường?',
    options: ['Lãnh đạo nhóm', 'Hỗ trợ thành viên', 'Làm việc độc lập', 'Điều phối các ý kiến'],
    phase: 2
  },
  {
    id: 13,
    question: 'Bạn xử lý stress hiện tại như thế nào?',
    options: ['Tập thể dục', 'Nghe nhạc', 'Trò chuyện với bạn bè', 'Thiền định', 'Làm việc nhiều hơn'],
    phase: 2
  },
  {
    id: 14,
    question: 'Thời gian rảnh, bạn thích?',
    options: ['Ở nhà nghỉ ngơi', 'Đi chơi với bạn bè', 'Học hỏi điều mới'],
    phase: 2
  },
  {
    id: 15,
    question: 'Khi có xung đột, bạn thường?',
    options: ['Đối mặt trực tiếp', 'Tránh né', 'Tìm cách hòa giải', 'Nhờ người khác can thiệp'],
    phase: 2
  },
  {
    id: 16,
    question: 'Công việc lý tưởng của bạn là?',
    options: ['Sáng tạo và tự do', 'Ổn định và rõ ràng', 'Thách thức và phát triển'],
    phase: 2
  },
  {
    id: 17,
    question: 'Bạn đánh giá thành công dựa trên?',
    options: ['Thành tích cá nhân', 'Đóng góp cho xã hội', 'Sự hài lòng bản thân', 'Sự công nhận từ người khác'],
    phase: 2
  },
  {
    id: 18,
    question: 'Khi học điều mới, bạn thích?',
    options: ['Lý thuyết trước', 'Thực hành trước', 'Kết hợp cả hai'],
    phase: 2
  },

  // Phase 3: Tương lai (câu 19-30)
  {
    id: 19,
    question: 'Trong tương lai, bạn muốn được nhớ đến vì?',
    options: [
      'Những đóng góp to lớn',
      'Tình yêu thương dành cho gia đình',
      'Sự sáng tạo và đổi mới',
      'Tính cách tốt đẹp'
    ],
    phase: 3
  },
  {
    id: 20,
    question: 'Kế hoạch 5 năm tới của bạn?',
    options: ['Đã có kế hoạch chi tiết', 'Có mục tiêu chung', 'Để mọi thứ diễn ra tự nhiên'],
    phase: 3
  },
  {
    id: 21,
    question: 'Bạn lo lắng nhất về điều gì trong tương lai?',
    options: [
      'Không đạt được mục tiêu',
      'Mất đi những người quan trọng',
      'Thay đổi quá nhanh',
      'Không thích nghi được'
    ],
    phase: 3
  },
  {
    id: 22,
    question: 'Gia đình lý tưởng trong tương lai của bạn?',
    options: ['Gia đình nhỏ ấm cúng', 'Gia đình đông con', 'Sống một mình tự do', 'Chưa nghĩ đến'],
    phase: 3
  },
  {
    id: 23,
    question: 'Bạn muốn phát triển kỹ năng nào?',
    options: [
      'Kỹ năng lãnh đạo',
      'Kỹ năng sáng tạo',
      'Kỹ năng giao tiếp',
      'Kỹ năng chuyên môn',
      'Kỹ năng quản lý thời gian'
    ],
    phase: 3
  },
  {
    id: 24,
    question: 'Môi trường sống lý tưởng?',
    options: ['Thành phố lớn', 'Thị trấn yên tĩnh', 'Nông thôn', 'Gần biển'],
    phase: 3
  },
  {
    id: 25,
    question: 'Trong tương lai, bạn muốn?',
    options: ['Ổn định và an toàn', 'Phiêu lưu và khám phá', 'Cân bằng cả hai'],
    phase: 3
  },
  {
    id: 26,
    question: 'Cách bạn muốn đóng góp cho xã hội?',
    options: ['Qua công việc chuyên môn', 'Hoạt động tình nguyện', 'Nuôi dạy thế hệ trẻ', 'Sáng tạo và nghệ thuật'],
    phase: 3
  },
  {
    id: 27,
    question: 'Thành tựu mà bạn muốn đạt được?',
    options: ['Thành công trong sự nghiệp', 'Hạnh phúc gia đình', 'Đóng góp xã hội', 'Phát triển bản thân'],
    phase: 3
  },
  {
    id: 28,
    question: 'Khi về già, bạn muốn?',
    options: ['Có nhiều kỷ niệm đẹp', 'Được con cháu kính trọng', 'Để lại di sản', 'Sống yên bình'],
    phase: 3
  },
  {
    id: 29,
    question: 'Nếu có thể thay đổi thế giới, bạn sẽ?',
    options: [
      'Xóa bỏ nghèo đói',
      'Chấm dứt chiến tranh',
      'Bảo vệ môi trường',
      'Tăng cường giáo dục',
      'Thúc đẩy công nghệ'
    ],
    phase: 3
  },
  {
    id: 30,
    question: 'Triết lý sống trong tương lai của bạn?',
    options: ['Sống cho hiện tại', 'Sống cho tương lai', 'Học hỏi từ quá khứ', 'Cân bằng cả ba'],
    phase: 3
  }
]

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to calculate MBTI result based on answers
const calculateMBTIResult = (answers: any[]): MBTIResult => {
  // Simple mock algorithm - in real implementation this would be more complex
  const types = [
    'INTJ',
    'INTP',
    'ENTJ',
    'ENTP',
    'INFJ',
    'INFP',
    'ENFJ',
    'ENFP',
    'ISTJ',
    'ISFJ',
    'ESTJ',
    'ESFJ',
    'ISTP',
    'ISFP',
    'ESTP',
    'ESFP'
  ]
  const randomType = types[Math.floor(Math.random() * types.length)]

  const descriptions: { [key: string]: string } = {
    INTJ: 'Kiến trúc sư - Người có tầm nhìn chiến lược và quyết tâm cao',
    INTP: 'Nhà tư duy - Người yêu thích khám phá các ý tưởng mới',
    ENTJ: 'Nhà lãnh đạo - Người có khả năng tổ chức và lãnh đạo xuất sắc',
    ENTP: 'Nhà tranh luận - Người sáng tạo và linh hoạt',
    INFJ: 'Người bảo vệ - Người có lý tưởng và quyết tâm',
    INFP: 'Người hòa giải - Người tốt bụng và sáng tạo',
    ENFJ: 'Người chỉ dạy - Người có khả năng truyền cảm hứng',
    ENFP: 'Người truyền cảm hứng - Người tự do và nhiệt tình',
    ISTJ: 'Người quản lý - Người đáng tin cậy và thực tế',
    ISFJ: 'Người bảo vệ - Người ấm áp và có trách nhiệm',
    ESTJ: 'Người điều hành - Người có tổ chức và quyết đoán',
    ESFJ: 'Người quan tâm - Người hòa đồng và hỗ trợ',
    ISTP: 'Người thủ công - Người thực tế và linh hoạt',
    ISFP: 'Người phiêu lưu - Người nghệ sĩ và nhạy cảm',
    ESTP: 'Người khuyến khích - Người năng động và thực tế',
    ESFP: 'Người giải trí - Người vui vẻ và tự phát'
  }

  return {
    id: `test-${Date.now()}`,
    userId: 'user-1',
    answers: answers,
    result: {
      type: randomType,
      description: descriptions[randomType] || 'Mô tả tính cách',
      traits: {
        extraversion: Math.floor(Math.random() * 100),
        introversion: Math.floor(Math.random() * 100),
        sensing: Math.floor(Math.random() * 100),
        intuition: Math.floor(Math.random() * 100),
        thinking: Math.floor(Math.random() * 100),
        feeling: Math.floor(Math.random() * 100),
        judging: Math.floor(Math.random() * 100),
        perceiving: Math.floor(Math.random() * 100)
      }
    },
    completedAt: new Date().toISOString(),
    score: Math.floor(Math.random() * 40) + 60 // Score from 60-100
  }
}

// Mock storage for answers (in real app this would be handled by backend)
const mockStorage: { [testId: string]: any } = {}

export const mbtiApi = {
  // Lấy danh sách câu hỏi
  getQuestions: async (params: GetQuestionsRequest = {}): Promise<GetQuestionsResponse> => {
    // Simulate API delay
    await delay(800)

    let filteredQuestions = mockQuestions

    // Filter by phase if specified
    if (params.phase) {
      filteredQuestions = mockQuestions.filter((q) => q.phase === params.phase)
    }

    // Apply limit if specified
    if (params.limit) {
      filteredQuestions = filteredQuestions.slice(0, params.limit)
    }

    return {
      questions: filteredQuestions,
      total: filteredQuestions.length
    }
  },
  // Lưu câu trả lời (tạm thời, không submit) - Chỉ để tương thích API
  saveAnswer: async (data: SaveAnswerRequest): Promise<{ success: boolean }> => {
    // Mock implementation - chỉ return success mà không thực sự call API
    // Trong thực tế, function này có thể được loại bỏ hoặc chỉ để log
    await delay(50) // Very quick response since we're not saving to server

    console.log('Answer saved locally:', data)
    return { success: true }
  },

  // Submit tất cả câu trả lời và nhận kết quả
  submitAnswers: async (data: SubmitAnswersRequest): Promise<SubmitAnswersResponse> => {
    // Simulate API delay
    await delay(1500)

    // Calculate result based on answers
    const result = calculateMBTIResult(data.answers)

    // Store result in mock storage
    mockStorage[result.id] = result

    return {
      result,
      message: 'Bài trắc nghiệm đã được nộp thành công!'
    }
  },

  // Lấy kết quả MBTI theo ID
  getResult: async (testId: string): Promise<MBTIResult> => {
    // Simulate API delay
    await delay(500)

    const result = mockStorage[testId]
    if (!result) {
      throw new Error('Không tìm thấy kết quả test')
    }

    return result
  },

  // Lấy lịch sử test của user
  getUserTests: async (userId: string): Promise<MBTIResult[]> => {
    // Simulate API delay
    await delay(700)

    // Return mock test history
    const mockHistory: MBTIResult[] = [
      {
        id: 'test-1',
        userId,
        answers: [],
        result: {
          type: 'INTJ',
          description: 'Kiến trúc sư - Người có tầm nhìn chiến lược và quyết tâm cao',
          traits: {
            extraversion: 20,
            introversion: 80,
            sensing: 30,
            intuition: 70,
            thinking: 85,
            feeling: 15,
            judging: 75,
            perceiving: 25
          }
        },
        completedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        score: 85
      },
      {
        id: 'test-2',
        userId,
        answers: [],
        result: {
          type: 'ENFP',
          description: 'Người truyền cảm hứng - Người tự do và nhiệt tình',
          traits: {
            extraversion: 75,
            introversion: 25,
            sensing: 40,
            intuition: 60,
            thinking: 30,
            feeling: 70,
            judging: 20,
            perceiving: 80
          }
        },
        completedAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
        score: 78
      }
    ]

    return mockHistory
  }
}
