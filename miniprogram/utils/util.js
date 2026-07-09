// utils/util.js — 通用工具函数

// 茶类分组 -> 主题色（与网站 CSS 变量保持一致）
const CATEGORY_COLORS = {
  '绿茶': '#7fb069',
  '白茶': '#d8cfc0',
  '黄茶': '#d4a843',
  '乌龙茶': '#3a8a5c',
  '红茶': '#c75b39',
  '黑茶': '#6b5344',
  '花茶': '#d4789c',
  '柑普茶': '#e8943a',
  '陈皮茶': '#c47a2e',
  '紧压茶': '#8b7355',
  '速溶茶': '#6aab9e'
};

function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#c8a96e';
}

// 根据冲泡温度字符串计算温度条百分比（70°C→70%，100°C→100%）
function tempToPercent(temp) {
  if (!temp) return 0;
  const nums = (temp.match(/\d+/g) || []).map(Number);
  if (nums.length === 0) return 0;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return Math.max(60, Math.min(100, Math.round(avg)));
}

// 核心功效字符串 -> 标签对象数组（含配色主题）
function parseEfficacyTags(coreEfficacy) {
  if (!coreEfficacy) return [];
  const raw = coreEfficacy.split(/[、，,]+/).filter((t) => t.trim().length > 0);
  return raw.map((tag) => ({ text: tag.trim(), theme: efficacyTheme(tag.trim()) }));
}

function efficacyTheme(tag) {
  if (/提神|醒脑|益思/.test(tag)) return 'tag-energy';
  if (/生津|止渴|消暑|清热|降火|解毒|避暑/.test(tag)) return 'tag-cooling';
  if (/抗衰|美容|抗氧化|美白/.test(tag)) return 'tag-beauty';
  if (/消食|去油|减肥|降脂|脾胃|暖胃|温胃|健脾|养胃|助消化/.test(tag)) return 'tag-digest';
  if (/防辐射|防龋齿|降压|降糖|血管|心血管|保护/.test(tag)) return 'tag-health';
  if (/祛湿|化痰|止痛|散寒|抗炎|杀菌|抗菌|理气|燥湿|排毒/.test(tag)) return 'tag-detox';
  return 'tag-default';
}

// 图片资源基路径（指向分包根目录下的 images/）
const IMG_BASE = '/images/';

// 归一化图片路径，保证返回「包根绝对路径」。
// 无论数据里是裸文件名('longjing.jpg')、'images/longjing.jpg' 还是 '/images/longjing.jpg'，
// 都统一解析为 '/images/longjing.jpg'，避免在小程序组件/页面里被当成相对路径解析到错误目录。
function resolveImage(img) {
  if (!img) return '';
  if (img.charAt(0) === '/') return img;              // 已是包根绝对路径
  if (img.indexOf('images/') === 0) return '/' + img; // 'images/x.jpg' -> '/images/x.jpg'
  return IMG_BASE + img;                              // 裸文件名 'x.jpg' -> '/images/x.jpg'
}

// 简单防抖
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

module.exports = {
  CATEGORY_COLORS,
  getCategoryColor,
  tempToPercent,
  parseEfficacyTags,
  efficacyTheme,
  resolveImage,
  debounce
};
