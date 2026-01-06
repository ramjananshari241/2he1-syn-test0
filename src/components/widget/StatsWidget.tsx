import { BlogStats } from '@/src/types/blog'
import React, { useState, useEffect } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import { WidgetContainer } from './WidgetContainer'

// 硬编码商家编号
const SHOP_CODE = "PRO-001A"

export const StatsWidget = ({ data }: { data: BlogStats }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(SHOP_CODE)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // 禁止背景滚动
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showModal])

  // --- 弹窗组件 (Portal 到 Body) ---
  const Modal = () => {
    if (!mounted) return null
    
    // @ts-ignore
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* 全屏遮罩 */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity animate-fade-in"
          onClick={() => setShowModal(false)}
        ></div>
        
        {/* 弹窗主体：纯粹的 iOS 风格 */}
        <div className="relative z-10 w-full max-w-[280px] transform overflow-hidden rounded-2xl bg-[#1c1c1e]/80 p-6 text-center shadow-2xl transition-all border border-white/10 backdrop-blur-2xl animate-fade-in-up">
          
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/5">
            <span className="text-xl">🏷️</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-1 tracking-wide">
            商家编号
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            点击下方卡片复制编号
          </p>
          
          <div 
            onClick={handleCopy}
            className="group relative cursor-pointer mb-6 p-3 bg-black/30 rounded-xl border border-white/5 hover:bg-black/50 transition-colors"
          >
            <span className="text-2xl font-mono font-bold text-white tracking-widest">
              {SHOP_CODE}
            </span>
            <div className={`absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 transition-all duration-200 ${isCopied ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <span className="text-xs font-bold text-white">已复制 ✅</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
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
      {/* 渲染 Portal 弹窗 */}
      {showModal && <Modal />}

      {/* 外部容器：iOS 风格 3D 毛玻璃 */}
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl group">
        
        {/* 背景层：深灰半透明 + 强模糊 */}
        <div className="absolute inset-0 bg-[#1c1c1e]/60 backdrop-blur-xl z-0"></div>
        
        {/* 极简氛围光：非常淡，仅用于提升通透感，不喧宾夺主 */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-[50px] pointer-events-none"></div>

        {/* 内容层 */}
        <div className="relative z-10 flex flex-col h-full justify-between p-6">
          
          {/* 上半部分：极简纯白标题 */}
          <div className="flex-1 flex flex-col items-center justify-center">
             <h2 className="text-2xl font-extrabold text-white tracking-widest drop-shadow-md">
               查看商家编号
             </h2>
          </div>

          {/* 下半部分：按钮组 */}
          <div className="flex flex-col gap-3 w-full mt-2"> 
              
              {/* 按钮 1：查看编号 (纯白高亮，iOS 风格) */}
              <button
