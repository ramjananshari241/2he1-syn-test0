import { classNames } from '@/src/lib/util'
import { BlogStats } from '@/src/types/blog'
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { WidgetContainer } from './WidgetContainer'

// 硬编码的商家编号
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

  // 弹窗组件 (Portal 到 body，确保绝对居中)
  const Modal = () => {
    if (!mounted) return null
    
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* 全屏遮罩 */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={() => setShowModal(false)}
        ></div>
        
        {/* 弹窗卡片 */}
        <div className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-2xl bg-white/90 dark:bg-[#1a1a1a]/90 p-6 text-center shadow-2xl transition-all border border-white/20 dark:border-white/10 backdrop-blur-xl animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <span className="text-xl">🏷️</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            当前商家编号
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            点击下方编号复制
          </p>
          
          <div 
            onClick={handleCopy}
            className="group relative cursor-pointer my-4 p-3 bg-gray-50 dark:bg-black/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <span className="text-2xl font-mono font-black text-gray-800 dark:text-gray-100 tracking-wider">
              {SHOP_CODE}
            </span>
            <div className="absolute -top-2 right-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {isCopied ? '已复制!' : '点击复制'}
            </div>
          </div>

          <button
            type="button"
            className="w-full justify-center rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-bold text-white dark:text-black hover:opacity-90 transition-opacity"
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
      <WidgetContainer>
        {/* 渲染弹窗 */}
        {showModal && <Modal />}

        {/* 紧凑型布局 */}
        <div className="flex flex-col h-full justify-center px-4 py-3 gap-3">
          
          {/* 1. 标题 + 手指 (同一行) */}
          <div className="flex items-center justify-center gap-2">
             <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
               查看商家编号
             </h2>
             <span className="text-lg animate-bounce cursor-default select-none">
               👇
             </span>
          </div>

          {/* 2. 按钮组 (紧凑堆叠) */}
          <div className="flex flex-col gap-2 w-full"> 
              
              {/* 按钮 1：查看编号 (白灰渐变立体) */}
              <button 
                onClick={() => setShowModal(true)} 
                type="button" 
                className="group relative w-full rounded-md bg-gradient-to-b from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 px-3 py-1.5 text-xs font-bold text-gray-800 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600 border-b-[3px] active:border-b-0 active:translate-y-[3px] transition-all"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>🔍</span>
                  <span>查看编号</span>
                </div>
              </button>

              {/* 按钮 2：前往一站式 (红色立体) */}
              <button 
                onClick={() => window.open('https://login.1zs.top/')} 
                type="button" 
                className="group relative w-full rounded-md bg-gradient-to-b from-red-500 to-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm border border-red-600 border-b-[3px] active:border-b-0 active:translate-y-[3px] transition-all" 
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>🚀</span>
                  <span>前往一站式</span>
                </div>
              </button>

          </div>
        </div>
      </WidgetContainer>
    </React.StrictMode>
  )
}
