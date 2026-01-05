import React, { useState, useEffect } from 'react'
import { Callout } from './BasicBlock'

export const EncryptedCallout = ({ block, children }: { block: any; children: any }) => {
  // 1. 获取内容与解析
  const richText = block.callout?.rich_text || [];
  const rawText = richText.map((t: any) => t.plain_text).join('') || '';
  const lockMatch = rawText.match(/^LOCK:\s*(.+)$/);
  const isLockedBlock = !!lockMatch;

  if (!isLockedBlock) {
    return <Callout block={block}>{children}</Callout>;
  }

  const correctPassword = lockMatch[1].trim();
  const [input, setInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`unlocked-${block.id}`) === 'true') {
      setIsUnlocked(true);
    }
  }, [block.id]);

  const handleUnlock = () => {
    if (input === correctPassword) {
      setIsUnlocked(true);
      setError(false);
      localStorage.setItem(`unlocked-${block.id}`, 'true');
    } else {
      setError(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
         navigator.vibrate(200);
      }
    }
  };

  // 🎨 预处理 Block：
  // 无论是否解锁，我们都先把 "LOCK:xxx" 这行字去掉，
  // 否则在模糊背景里会看到这行乱码，影响美观。
  const cleanBlock = {
    ...block,
    callout: { ...block.callout, rich_text: [] }
  };

  return (
    <div className="relative my-8 rounded-2xl overflow-hidden shadow-2xl group border border-neutral-200 dark:border-neutral-800">
      
      {/* =========================================================
          第一层：底层内容层 (The Content Layer)
          逻辑：始终渲染内容！但是未解锁时，加高斯模糊，禁止鼠标交互
      ========================================================= */}
      <div 
        className={`
          transition-all duration-700 ease-in-out
          ${isUnlocked ? 'filter-none opacity-100' : 'filter blur-xl scale-110 opacity-60 pointer-events-none select-none'}
        `}
        // 如果内容很少，给一个最小高度，保证锁界面能放得下
        style={{ minHeight: isUnlocked ? 'auto' : '320px' }} 
      >
        <Callout block={cleanBlock}>
           {/* 如果未解锁且内容是空的（例如只有图片），为了撑起模糊背景的颜色，
               我们可以让它默认渲染，Callout 组件会自动处理 children */}
           {children}
        </Callout>
      </div>


      {/* =========================================================
          第二层：上层遮罩层 (The Overlay Layer)
          逻辑：使用 absolute inset-0 覆盖在内容之上
      ========================================================= */}
      {!isUnlocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-black/40 backdrop-blur-md transition-all">
          
          {/* 装饰：再次叠加一层微弱的渐变光，增强氛围 */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>

          <div className="relative z-30 flex flex-col items-center w-full max-w-md">
            
            <h3 className="font-extrabold text-2xl mb-2 text-neutral-900 dark:text-white drop-shadow-md">
              受保护的内容
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-8 font-medium text-center drop-shadow-sm">
              此内容已被模糊处理，请输入密码还原。
            </p>

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <input 
                type="password" 
                placeholder="密码..."
                className={`
                  flex-1 px-5 py-3 rounded-xl 
                  text-neutral-900 
                  bg-white/80 dark:bg-black/60
                  border-2 backdrop-blur-xl outline-none transition-all
                  placeholder-neutral-500
                  ${error 
                    ? 'border-red-500 ring-2 ring-red-500/30' 
                    : 'border-white/20 dark:border-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30'
                  }
                `}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if(error) setError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              />

              <button 
                onClick={handleUnlock}
                className={`
                  px-6 py-3 rounded-xl font-bold text-white whitespace-nowrap
                  bg-blue-600 hover:bg-blue-500
                  border-b-[4px] border-blue-800 hover:border-blue-700
                  active:border-b-0 active:translate-y-[4px]
                  shadow-lg shadow-blue-900/40
                  transition-all duration-100
                `}
              >
                解锁 →
              </button>
            </div>

            {/* 错误提示 */}
            <div className={`
              mt-4 px-4 py-1.5 rounded-full text-sm font-bold text-red-600 bg-red-100/90 backdrop-blur-sm
              transition-all duration-300 transform
              ${error ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90 pointer-events-none'}
            `}>
              密码错误
            </div>

          </div>
        </div>
      )}

      {/* 解锁后的重新上锁按钮 (右上角悬浮) */}
      {isUnlocked && (
        <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <button 
             onClick={() => {
               localStorage.removeItem(`unlocked-${block.id}`);
               setIsUnlocked(false);
             }}
             className="text-xs bg-black/10 dark:bg-white/10 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded backdrop-blur-md text-neutral-500 transition-colors"
           >
             🔒 锁定
           </button>
        </div>
      )}

    </div>
  );
};
