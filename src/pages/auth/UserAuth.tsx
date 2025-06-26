import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Shield, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

interface FormData {
  email: string
  password: string
  fullName?: string
}

interface FormErrors {
  email?: string
  password?: string
  fullName?: string
}

const UserAuth = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Determine sign in/up state based on current URL
  const [isSignIn, setIsSignIn] = useState<boolean>(() => {
    return location.pathname === '/signin'
  })
  
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Update state when URL changes
  useEffect(() => {
    setIsSignIn(location.pathname === '/signin')
  }, [location.pathname])

  // Reset form when switching between sign in/up
  useEffect(() => {
    setFormData({ email: '', password: '', fullName: '' })
    setErrors({})
  }, [isSignIn])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    // Full name validation for sign up
    if (!isSignIn && !formData.fullName) {
      newErrors.fullName = 'Họ tên là bắt buộc'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Handle success (you can add your authentication logic here)
      console.log(isSignIn ? 'Đăng nhập' : 'Đăng ký', formData)
    } catch (error) {
      console.error('Authentication error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleToggleAuthMode = () => {
    if (isSignIn) {
      navigate('/signup')
    } else {
      navigate('/signin')
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header with branding */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <div className='bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full'>
              <TrendingUp className='h-8 w-8 text-white' />
            </div>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>CK Investment</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>Nền tảng đầu tư chứng khoán thông minh</p>

          {/* Market indicators */}
          <div className='flex justify-center gap-4 mt-4'>
            <Badge variant='secondary' className='text-green-600 bg-green-50 dark:bg-green-900/20'>
              <TrendingUp className='h-3 w-3 mr-1' />
              VN-Index +1.2%
            </Badge>
            <Badge variant='secondary' className='text-blue-600 bg-blue-50 dark:bg-blue-900/20'>
              <Shield className='h-3 w-3 mr-1' />
              Bảo mật SSL
            </Badge>
          </div>
        </div>

        <Card className='border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'>
          <CardHeader className='text-center pb-4'>
            <CardTitle className='text-xl font-semibold'>
              {isSignIn ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
            </CardTitle>
            <CardDescription>
              {isSignIn ? 'Truy cập vào tài khoản đầu tư của bạn' : 'Bắt đầu hành trình đầu tư thông minh'}
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Full Name Field (Sign Up only) */}
              {!isSignIn && (
                <div className='space-y-2'>
                  <Label htmlFor='fullName' className='text-sm font-medium'>
                    Họ và tên
                  </Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      id='fullName'
                      type='text'
                      placeholder='Nhập họ và tên'
                      value={formData.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                      aria-invalid={!!errors.fullName}
                    />
                  </div>
                  {errors.fullName && <p className='text-sm text-red-600'>{errors.fullName}</p>}
                </div>
              )}

              {/* Email Field */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm font-medium'>
                  Email
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='your.email@example.com'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && <p className='text-sm text-red-600'>{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <Label htmlFor='password' className='text-sm font-medium'>
                  Mật khẩu
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Nhập mật khẩu'
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    aria-invalid={!!errors.password}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                  </Button>
                </div>
                {errors.password && <p className='text-sm text-red-600'>{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium'
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className='flex items-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    {isSignIn ? 'Đang đăng nhập...' : 'Đang tạo tài khoản...'}
                  </div>
                ) : isSignIn ? (
                  'Đăng nhập'
                ) : (
                  'Tạo tài khoản'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>hoặc</span>
              </div>
            </div>

            {/* Switch between Sign In/Up */}
            <div className='text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {isSignIn ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              </p>
              <Button
                type='button'
                variant='link'
                className='text-blue-600 hover:text-blue-700 font-medium p-0'
                onClick={handleToggleAuthMode}
              >
                {isSignIn ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
              </Button>
            </div>

            {/* Security note */}
            <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-4'>
              <div className='flex items-start'>
                <Shield className='h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0' />
                <p className='text-xs text-blue-700 dark:text-blue-300'>
                  Thông tin của bạn được bảo mật với công nghệ mã hóa SSL 256-bit và tuân thủ các tiêu chuẩn bảo mật
                  quốc tế
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='text-center mt-6 text-xs text-gray-500 dark:text-gray-400'>
          <p>
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <a href='#' className='text-blue-600 hover:underline'>
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href='#' className='text-blue-600 hover:underline'>
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserAuth
