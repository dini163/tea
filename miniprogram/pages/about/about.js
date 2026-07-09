// pages/about/about.js
const { list } = require('../../data/teas.js');

Page({
  data: {
    count: list.length
  },

  goIndex() {
    wx.switchTab({ url: '/pages/index/index' });
  },
  goBrewing() {
    wx.switchTab({ url: '/pages/brewing/brewing' });
  },
  goNaming() {
    wx.switchTab({ url: '/pages/naming/naming' });
  }
});
