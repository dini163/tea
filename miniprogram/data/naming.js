// data/naming.js — 商品命名对照表（"名不副实"的茶名）
// actualColor 取实际归属对应的茶类主题色
module.exports = {
  list: [
    { name: '安吉白茶', actual: '绿茶', actualColor: '#7fb069', reason: '名字含"白"，实际是绿茶工艺。"白"指白化品种的叶色', temp: '75-80°C', storage: '密封冷藏' },
    { name: '大红袍', actual: '乌龙茶（岩茶）', actualColor: '#3a8a5c', reason: '名字含"红"，实际是武夷山乌龙茶名丛', temp: '95-100°C', storage: '密封常温' },
    { name: '铁观音', actual: '乌龙茶', actualColor: '#3a8a5c', reason: '名字无茶类线索，安溪县特产品种', temp: '95-100°C', storage: '清香冷藏/浓香常温' },
    { name: '普洱茶（生）', actual: '绿茶 → 黑茶', actualColor: '#6b5344', reason: '新茶近似绿茶，陈化后转为黑茶属性，跨分类', temp: '90-95°C', storage: '通风干燥，陈化' },
    { name: '普洱茶（熟）', actual: '黑茶', actualColor: '#6b5344', reason: '渥堆发酵加速陈化，属于标准后发酵黑茶', temp: '95-100°C', storage: '通风干燥' },
    { name: '金骏眉', actual: '红茶', actualColor: '#c75b39', reason: '名字含"金"，联想黄茶？实为正山小种创新品种', temp: '90°C', storage: '密封常温' },
    { name: '凤凰单丛', actual: '乌龙茶', actualColor: '#3a8a5c', reason: '广东潮州特产，单株采制，香型丰富', temp: '95-100°C', storage: '密封常温' },
    { name: '武夷岩茶', actual: '乌龙茶', actualColor: '#3a8a5c', reason: '"岩"指武夷山丹霞地貌，含肉桂、水仙、大红袍等数百品种', temp: '95-100°C', storage: '密封常温' },
    { name: '祁门红茶', actual: '红茶', actualColor: '#c75b39', reason: '安徽祁门县产，与大吉岭、锡兰并列世界三大高香红茶', temp: '90-95°C', storage: '密封常温' }
  ]
};
