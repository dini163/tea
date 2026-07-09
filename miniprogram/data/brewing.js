// data/brewing.js — 冲泡指南·水温速查表
// percent 对应温度计水银柱高度（与网站 data-height 一致）
module.exports = {
  list: [
    { name: '绿茶', temp: '75-85°C', percent: 75, emoji: '🟢', color: '#7fb069' },
    { name: '白茶', temp: '85-95°C', percent: 85, emoji: '⚪', color: '#d8cfc0' },
    { name: '黄茶', temp: '80-85°C', percent: 80, emoji: '🟡', color: '#d4a843' },
    { name: '乌龙茶', temp: '90-100°C', percent: 95, emoji: '🔵', color: '#3a8a5c' },
    { name: '红茶', temp: '90-95°C', percent: 92, emoji: '🔴', color: '#c75b39' },
    { name: '黑茶', temp: '95-100°C', percent: 98, emoji: '⚫', color: '#6b5344' }
  ],
  tip: '不同茶类适宜不同的冲泡水温。温度过高会烫伤嫩叶，过低则难以释放风味。'
};
