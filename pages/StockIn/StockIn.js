Page({
  data: {
    activeTab: 'StockIn'
  },
  onLoad() {
    // 页面加载时的逻辑
  },
  onTabChange(event) {
    const { value } = event.detail;
    this.setData({
      activeTab: value
    });
  }
});
