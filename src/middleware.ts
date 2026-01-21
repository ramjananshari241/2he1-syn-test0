import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. 严格限制：只拦截 /admin 开头的路径
  // 如果不是 admin 页面，直接放行，绝对不会干扰首页
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // 2. 验证逻辑
  const basicAuth = req.headers.get('authorization')

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    const validUser = process.env.AUTH_USER || 'admin'
    const validPass = process.env.AUTH_PASS || '123456'

    if (user === validUser && pwd === validPass) {
      return NextResponse.next()
    }
  }

  // 3. 验证失败返回 401 (Body 为 null 以兼容 Vercel)
  return new NextResponse(null, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
    },
  })
}

// 4. 配置匹配器
export const config = {
  matcher: ['/admin/:path*', '/admin'],
}