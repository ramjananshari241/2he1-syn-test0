export default async function handler(req, res) {
  // 🟢 核心提效：不再硬编码！直接从 Vercel 的环境变量中读取 Hook
  const VERCEL_HOOK = process.env.VERCEL_DEPLOY_HOOK;
  
  // 如果用户没配置，或者配置错了，给个友好的提示，但不报错
  if (!VERCEL_HOOK || !VERCEL_HOOK.startsWith('http')) {
     console.warn("⚠️ 警告: 未配置 VERCEL_DEPLOY_HOOK 环境变量，跳过自动更新。");
     return res.status(200).json({ 
       success: false, 
       message: '未配置 VERCEL_DEPLOY_HOOK 环境变量，请在 Vercel 后台添加。' 
     });
  }
  
  try {
    // 触发更新
    await fetch(VERCEL_HOOK, { method: 'POST' });
    res.status(200).json({ success: true });
  } catch (e) {
    console.error("触发更新失败:", e);
    res.status(500).json({ success: false });
  }
}
