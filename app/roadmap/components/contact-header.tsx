import { Mail, MessageCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ContactHeader() {
  return (
    <Alert className="mb-8">
      <AlertDescription className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>需要新功能？请发送邮件至：</span>
          <a href="mailto:support@example.com" className="font-medium hover:underline">
            support@example.com
          </a>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span>或在用户群中 @管理员</span>
        </div>
      </AlertDescription>
    </Alert>
  )
}

