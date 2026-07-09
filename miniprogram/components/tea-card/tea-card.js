// components/tea-card/tea-card.js
Component({
  properties: {
    tea: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onTap() {
      // 将点击透传给页面，携带茶叶 id
      this.triggerEvent('tap', { id: this.data.tea.id });
    }
  }
});
