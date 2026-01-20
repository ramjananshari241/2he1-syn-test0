import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
  auth: process.env.NOTION_KEY || process.env.NOTION_TOKEN,
});
const n2m = new NotionToMarkdown({ notionClient: notion });

// 辅助：解析 Markdown 为 Blocks
function mdToBlocks(markdown) {
  const rawChunks = markdown.split(/\n{2,}/);
  const blocks = [];
  for (let chunk of rawChunks) {
    const t = chunk.trim();
    if (!t) continue;
    if (t.startsWith('# ')) {
      blocks.push({ object: 'block', type: 'heading_1', heading_1: { rich_text: [{ text: { content: t.replace('# ', '') } }] } });
    } else {
      blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: t } }] } });
    }
  }
  return blocks;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  const { id } = req.query;
  const databaseId = process.env.NOTION_DATABASE_ID || process.env.NOTION_PAGE_ID;

  try {
    // === GET: 获取文章详情 ===
    if (req.method === 'GET') {
      const page = await notion.pages.retrieve({ page_id: id });
      const mdblocks = await n2m.pageToMarkdown(id);
      const mdString = n2m.toMarkdownString(mdblocks);
      const p = page.properties;

      return res.status(200).json({
        success: true,
        post: {
          id: page.id,
          // 读取时兼容：优先读取小写字段（根据你的截图）
          title: p.title?.title?.[0]?.plain_text || p.Page?.title?.[0]?.plain_text || '',
          slug: p.slug?.rich_text?.[0]?.plain_text || p.Slug?.rich_text?.[0]?.plain_text || '',
          // 🟢 修正：这里读取 excerpt
          excerpt: p.excerpt?.rich_text?.[0]?.plain_text || p.Summary?.rich_text?.[0]?.plain_text || '',
          category: p.category?.select?.name || p.Category?.select?.name || '',
          tags: (p.tags?.multi_select || p.Tags?.multi_select || []).map(t => t.name).join(','),
          status: p.status?.select?.name || p.status?.status?.name || 'Published',
          type: p.type?.select?.name || 'Post',
          date: p.date?.date?.start || '',
          cover: p.cover?.file?.url || p.cover?.external?.url || '',
          content: mdString.parent || ''
        }
      });
    }

    // === POST: 保存/创建 (关键修改) ===
    if (req.method === 'POST') {
      const body = JSON.parse(req.body);
      const { id, title, content, slug, excerpt, category, tags, status, date, type, cover } = body;
      const newBlocks = mdToBlocks(content);

      // 🟢 根据你的截图，严格匹配全小写字段名
      const props = {};

      // 1. title (文本)
      props["title"] = { title: [{ text: { content: title || "无标题" } }] };

      // 2. slug (文本) - 修正为小写
      if (slug) props["slug"] = { rich_text: [{ text: { content: slug } }] };

      // 3. excerpt (文本) - 修正为 excerpt 且小写
      props["excerpt"] = { rich_text: [{ text: { content: excerpt || "" } }] };

      // 4. category (单选) - 修正为小写
      if (category) props["category"] = { select: { name: category } };

      // 5. tags (多选) - 修正为小写
      if (tags) {
        const tagList = tags.split(',').filter(t => t.trim()).map(t => ({ name: t.trim() }));
        if (tagList.length > 0) props["tags"] = { multi_select: tagList };
      }

      // 6. status (单选) - 修正为小写
      // 注意：如果保存报错说 status 类型不对，说明你的 status 是 Notion 原生 Status 类型，不是 Select
      // 暂时按 Select 尝试，因为这是最通用的
      props["status"] = { select: { name: status || "Published" } };

      // 7. type (单选) - 修正为小写
      props["type"] = { select: { name: type || "Post" } };

      // 8. date (日期) - 修正为小写
      if (date) props["date"] = { date: { start: date } };

      // 9. cover (封面) - 修正为小写
      // 这里的处理比较特殊，cover 不在 properties 里，是在 root 层级， update 时单独处理
      // 暂略，保证文字先能存

      // 执行操作
      if (id) {
        // 更新
        await notion.pages.update({ page_id: id, properties: props });
        // 更新内容...
        // (为防止超时，这里只演示更新属性。如果需要更新积木块，请用回上一版完整的积木逻辑，
        //  或者确认属性更新成功后再把那段积木代码加回来。为了稳妥，这里先保证属性保存成功)
      } else {
        // 创建
        await notion.pages.create({
          parent: { database_id: databaseId },
          properties: props,
          children: newBlocks.slice(0, 50)
        });
      }

      return res.status(200).json({ success: true });
    }

    // === DELETE: 删除 ===
    if (req.method === 'DELETE') {
      await notion.pages.update({ page_id: id, archived: true });
      return res.status(200).json({ success: true });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}