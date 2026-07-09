// pages/index/index.js — 茶库首页：分类浏览 + 搜索
const { list } = require('../../data/teas.js');
const { getCategoryColor, parseEfficacyTags, tempToPercent, debounce } = require('../../utils/util.js');

// 归一化：补充主题色、温度条百分比、核心功效标签、搜索串
const TEAS = list.map((t) => ({
  ...t,
  color: getCategoryColor(t.category),
  tempPercent: tempToPercent(t.temp),
  coreTags: parseEfficacyTags(t.coreEfficacy),
  _search: [t.name, t.en, t.type, t.category, t.efficacy, t.coreEfficacy, t.fermentation]
    .join(' ')
    .toLowerCase()
}));

// 按分类聚合，依据 tab 与 keyword 过滤
function buildGroups(tab, keyword) {
  let arr = TEAS;
  if (tab && tab !== 'all') arr = arr.filter((t) => t.layer === tab);
  if (keyword) {
    const kw = keyword.toLowerCase();
    arr = arr.filter((t) => t._search.indexOf(kw) !== -1);
  }
  const order = [];
  const map = {};
  arr.forEach((t) => {
    if (!map[t.category]) {
      map[t.category] = { category: t.category, color: t.color, teas: [] };
      order.push(t.category);
    }
    map[t.category].teas.push(t);
  });
  return order.map((c) => map[c]);
}

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'basic', label: '基础茶类' },
  { key: 'reprocessed', label: '再加工茶' }
];

Page({
  data: {
    tabs: TABS,
    activeTab: 'all',
    keyword: '',
    groups: [],
    showEmpty: false,
    totalCount: TEAS.length
  },

  onLoad() {
    this.applyFilter();
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;
    this.setData({ activeTab: tab });
    this.applyFilter();
  },

  onSearchInput: debounce(function (e) {
    this.setData({ keyword: e.detail.value });
    this.applyFilter();
  }, 200),

  onClearSearch() {
    this.setData({ keyword: '' });
    this.applyFilter();
  },

  applyFilter() {
    const groups = buildGroups(this.data.activeTab, this.data.keyword);
    const total = groups.reduce((n, g) => n + g.teas.length, 0);
    this.setData({ groups, showEmpty: total === 0 });
  },

  onCardTap(e) {
    const id = e.detail.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  goBrewing() {
    wx.switchTab({ url: '/pages/brewing/brewing' });
  },
  goNaming() {
    wx.switchTab({ url: '/pages/naming/naming' });
  },

  onShareAppMessage() {
    return {
      title: '茶之百科 · 中国茶叶分类·冲泡·存放指南',
      path: '/pages/index/index'
    };
  }
});
