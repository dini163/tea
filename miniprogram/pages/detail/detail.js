// pages/detail/detail.js — 茶叶详情
const { byId } = require('../../data/teas.js');
const { getCategoryColor } = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    tea: null,
    color: '#c8a96e'
  },

  onLoad(options) {
    const id = options.id;
    const tea = byId[id];
    if (!tea) {
      wx.showToast({ title: '未找到该茶', icon: 'none' });
      return;
    }
    app.pushHistory(id);
    wx.setNavigationBarTitle({ title: tea.name });
    this.setData({ tea, color: getCategoryColor(tea.category) });
  },

  onShareAppMessage() {
    const tea = this.data.tea;
    if (!tea) return { title: '茶之百科', path: '/pages/index/index' };
    return {
      title: `${tea.name} · ${tea.coreEfficacy} · 冲泡${tea.temp}`,
      path: `/pages/detail/detail?id=${tea.id}`,
      imageUrl: tea.image
    };
  },

  onShareTimeline() {
    const tea = this.data.tea;
    if (!tea) return {};
    return {
      title: `${tea.name}｜${tea.coreEfficacy}`,
      query: `id=${tea.id}`,
      imageUrl: tea.image
    };
  }
});
