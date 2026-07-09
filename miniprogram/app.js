// app.js — 茶之百科 Mini Program 入口
const { list, byId } = require('./data/teas.js');
const { resolveImage } = require('./utils/util.js');

// 路径归一化：在 app 模块加载时一次性完成，之后所有页面/组件读取到的
// 都是包根绝对路径 '/images/xxx.jpg'，彻底规避组件/页面内相对路径解析到错误目录的问题。
// 数据文件只存裸文件名，路径组装交给代码，生成脚本输出任何格式都能正确解析。
[...list, ...Object.values(byId)].forEach((t) => {
  if (t && t.image) t.image = resolveImage(t.image);
});

App({
  globalData: {
    // 应用启动参数
    launchOptions: null,
    // 用于跨页面传递当前选中的茶叶 id
    currentTeaId: ''
  },

  onLaunch(options) {
    this.globalData.launchOptions = options;
    // 读取本地缓存的浏览历史（最近浏览的茶叶）
    try {
      const history = wx.getStorageSync('view_history') || [];
      this.globalData.viewHistory = history;
    } catch (e) {
      this.globalData.viewHistory = [];
    }
  },

  onShow() {},

  onHide() {},

  // 记录浏览历史，最多保留 20 条，供「关于」页或相关推荐使用
  pushHistory(id) {
    if (!id) return;
    let history = this.globalData.viewHistory || [];
    history = history.filter((h) => h !== id);
    history.unshift(id);
    history = history.slice(0, 20);
    this.globalData.viewHistory = history;
    wx.setStorageSync('view_history', history);
  }
});
