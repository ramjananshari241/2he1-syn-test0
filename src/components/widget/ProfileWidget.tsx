/* eslint-disable @next/next/no-img-element */
import { useScreenSize } from '@/src/hooks/useScreenSize'
import { isValidUrl } from '@/src/lib/util'
import Link from 'next/link'
import React from 'react'
import { DynamicIcon } from '../DynamicIcon'

const LinkIcon = ({ icon }: { icon: string }) => {
  if (!icon) return null;
  const size = 18;
  if (isValidUrl(icon) || icon.startsWith('/')) {
    return <img className="drop-shadow-sm mr-1.5" style={{width: size, height: size}} src={icon} alt="icon" />
  }
  return <div className="drop-shadow-sm mr-1.5"><DynamicIcon nameIcon={icon} propsIcon={{ size }} /></div>
}

export const ProfileWidget = ({ data }: { data: any }) => {
  const avatarSrc = data?.logo?.src || data?.image || data?.avatar || '';
  const name = data?.name || 'PRO BLOG';
  const bio = data?.description || '';

  return (
    <React.StrictMode>
      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.015]">
        
        {/* 1. 沿用流光边缘 */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity animate-border-flow"></div>

        {/* 2. 沿用毛玻璃主体 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516]/80 backdrop-blur-2xl flex flex-col p-6">
          
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-purple-600/20 transition-colors duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-blue-600/20 transition-colors duration-500"></div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            
            {/* 上半部分：比例恢复 */}
            <div className="flex flex-row items-center gap-5">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur opacity-30"></div>
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full ring-2 ring-white/10 overflow-hidden bg-neutral-800">
                    {avatarSrc ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">P</div>}
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                    <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight antialiased drop-shadow-md truncate">
                      {name}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400 font-medium line-clamp-2 leading-snug antialiased mt-1">
                      {bio}
                    </p>
                </div>
            </div>

            {/* 下半部分：三个按钮优化 (强制同大小且铺满) */}
            <div className="w-full mt-6">
              <div className="grid grid-cols-3 gap-3 w-full">
                
                {/* 按钮 1: 入会说明 (h-10 填满) */}
                <Link href="/about" className="group/btn relative h-10 w-full rounded-xl overflow-hidden flex items-center justify-center text-[10px] md:text-xs font-bold text-white transition-all hover:scale-[1.05] active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }}>
                  <div className="relative z-10 flex items-center justify-center w-full">
                    <LinkIcon icon="FaCrown" />
                    <span className="hidden sm:inline">入会说明</span><span className="sm:hidden">入会</span>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </Link>

                {/* 按钮 2: 下载说明 */}
                <Link href="/download" className="group/btn relative h-10 w-full rounded-xl overflow-hidden flex items-center justify-center text-[10px] md:text-xs font-bold text-white transition-all hover:scale-[1.05] active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <div className="relative z-10 flex items-center justify-center w-full">
                    <LinkIcon icon="IoMdCloudDownload" />
                    <span className="hidden sm:inline">下载说明</span><span className="sm:hidden">下载</span>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </Link>

                {/* 按钮 3: 更多资源 */}
                <Link href="/friends" className="group/btn relative h-10 w-full rounded-xl overflow-hidden flex items-center justify-center text-[10px] md:text-xs font-bold text-white transition-all hover:scale-[1.05] active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #0284c7 100%)' }}>
                  <div className="relative z-10 flex items-center justify-center w-full">
                    <LinkIcon icon="HiOutlineViewGridAdd" />
                    <span className="hidden sm:inline">更多资源</span><span className="sm:hidden">资源</span>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
