Component({
  properties: {
    activeTab: {
      type: String,
      value: 'home'
    }
  },
  methods: {
    onTabChange(event) {
      const { value } = event.detail;
      this.triggerEvent('change', { value });
      switch (value) {
        case 'home':
          wx.redirectTo({
            url: '../../pages/index/index'
          });
          break;
        case 'StockIn':
          wx.redirectTo({
            url: '../../pages/StockIn/StockIn'
          });
          break;
        case 'CheckOut':
          wx.redirectTo({
            url: '../../pages/CheckOut/CheckOut'
          });
          break;
        case 'profile':
          wx.redirectTo({
            url: '../../pages/profile/profile'
          });
          break;
      }
    }
  }
});
