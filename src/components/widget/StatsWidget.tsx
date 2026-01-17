/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import Link from 'next/link'

// 硬编码站长ID
const SHOP_CODE = "PRO-001A"

export const StatsWidget = ({ data }: { data: any }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 获取公告数据 (兼容处理，防止数据为空报错)
  const cover = data?.cover || data?.pageCover || ''; 
  const title = data?.title || '暂无公告';
  const summary = data?.excerpt || data?.summary || '暂无详细内容...';
  const slug = data?.slug || '#';

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(SHOP_CODE)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showModal])

  // --- 极简弹窗组件 (只显示站长ID) ---
  const Modal = () => {
    if (!mounted) return null
    
    // @ts-ignore
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* 弹窗动画 */}
        <style jsx>{`
          @keyframes modalEnter {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-modal-enter {
            animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* 遮罩 */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
          onClick={() => setShowModal(false)}
        ></div>
        
        {/* 弹窗主体：小巧精致 */}
        <div className="relative z-10 w-full max-w-[260px] overflow-hidden rounded-2xl animate-modal-enter
          bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 shadow-2xl text-center p-6"
        >
          <h3 className="text-base font-bold text-white mb-4 tracking-wide">
            站长 ID
          </h3>
          
          {/* 编号显示区 */}
          <div 
            onClick={handleCopy}
            className="group relative cursor-pointer p-3 bg-black/50 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all active:scale-95"
          >
            <span className="text-xl font-mono font-bold text-white tracking-wider">
              {SHOP_CODE}
            </span>
            {/* 复制反馈 */}
            <div className={`absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 transition-all duration-200 ${isCopied ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <span className="text-xs font-bold text-white">已复制 ✅</span>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 w-full py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors"
            onClick={() => setShowModal(false)}
          >
            关闭
          </button>
        </div>
      </div>,
      document.body
    )
  }

  return (
    <React.StrictMode>
      {/* 注入动画样式 */}
      <style jsx global>{`
        @keyframes borderFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-border-flow { background-size: 200% 200%; animation: borderFlow 3s ease infinite; }
      `}</style>

      {showModal && <Modal />}

      {/* 外部容器：保持与 Profile 组件一致的尺寸和动效 */}
      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.015]">
        
        {/* 流光边缘 */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>

        {/* 主体容器 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516] flex flex-col">
          
          {/* ================= 背景图层 ================= */}
          <div className="absolute inset-0 z-0">
            {/* 封面图：带放大动效 */}
            {cover ? (
              <img 
                src={cover} 
                alt="Announcement Cover" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110 opacity-80"
              />
            ) : (
              // 兜底背景：如果没有封面图，显示一个渐变背景
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900"></div>
            )}
            
            {/* 渐变遮罩：确保文字清晰可见 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"></div>
          </div>

          {/* ================= 内容层 ================= */}
          <div className="relative z-10 flex flex-col h-full justify-between p-6">
            
            {/* 上半部分：公告内容 (可点击跳转) */}
            <Link 
              href={`/post/${slug}`} // 假设你的文章路径是 /post/slug
              className="flex-1 flex flex-col justify-center group/text cursor-pointer"
            >
               {/* 装饰性标签 */}
               <div className="mb-2 flex items-center gap-1.5 opacity-80">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                 <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase">公告</span>
               </div>

               {/* 标题 */}
               <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight mb-2 group-hover/text:text-blue-300 transition-colors line-clamp-2">
                 {title}
               </h2>

               {/* 摘要 (Touchgal 风格：小字、灰色) */}
               <p className="text-xs text-gray-300/80 font-medium line-clamp-2 leading-relaxed group-hover/text:text-white/90 transition-colors">
                 {summary}
               </p>
            </Link>

            {/* 下半部分：站长 ID 按钮 */}
            <div className="w-full mt-4">
              <button 
                onClick={() => setShowModal(true)} 
                type="button" 
                className="w-full h-9 rounded-xl flex items-center justify-center gap-2
                  bg-white/10 backdrop-blur-md border border-white/10
                  text-xs font-bold text-white tracking-wide
                  transition-all duration-300
                  hover:bg-white/20 hover:scale-[1.02] active:scale-95 active:bg-white/5"
              >
                <span className="text-sm">🆔</span>
                <span>站长 ID</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
