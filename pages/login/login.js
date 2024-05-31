Page({
  data: {
    phoneNumber: '',
    password: '',
    loginFailedCount: 0, // 登录失败次数
    phoneTips: '',
    phoneTipsColor: '',
    passwordTips: '',
    passwordTipsColor: '',
    errorMsg: '' // 添加错误消息字段
  },
  handlePhoneNumberInput(e) {
    const phoneNumber = e.detail.value;
    const phoneRegex = /^[1][3-9][0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      this.setData({
        phoneTips: '手机号格式不正确',
        phoneTipsColor: 'red'
      });
    } else {
      this.setData({
        phoneNumber: phoneNumber,
        phoneTips: '',
        phoneTipsColor: ''
      });
    }
    console.log('Phone Number:', this.data.phoneNumber); // 调试输出
  },
  handlePasswordInput(e) {
    this.setData({
      password: e.detail.value,
      passwordTips: '',
      passwordTipsColor: ''
    });
    console.log('Password:', this.data.password); // 调试输出
  },
  handleLogin() {
    const { phoneNumber, password } = this.data;
    console.log('Phone Number (in handleLogin):', phoneNumber); // 调试输出
    console.log('Password (in handleLogin):', password); // 调试输出

    if (!phoneNumber) {
      this.setData({
        phoneTips: '请输入手机号',
        phoneTipsColor: 'red'
      });
      return;
    }
    if (!password) {
      this.setData({
        passwordTips: '请输入密码',
        passwordTipsColor: 'red'
      });
      return;
    }

    console.log('Sending request to server...'); // 调试输出
    wx.request({
      url: 'http://192.168.31.165:5005/login', // 更新为您的IP地址
      method: 'POST',
      data: {
        phone_number: phoneNumber,
        password: password
      },
      header: {
        'Content-Type': 'application/json' // 确保使用正确的Content-Type
      },
      success: (res) => {
        console.log('Server response:', res.data); // 调试输出
        if (res.data.success) {
          this.showToast('登录成功', 'success');
          // 清除失败次数并跳转到主页或其他页面
          this.setData({
            loginFailedCount: 0,
            phoneTips: '',
            passwordTips: '',
            errorMsg: ''
          });
          // 页面跳转到主页
          wx.navigateTo({
            url: '/pages/index/index'
          });
        } else {
          // 确保loginFailedCount不为undefined
          const failedCount = res.data.failed_count !== undefined ? res.data.failed_count : 0;
          this.setData({ loginFailedCount: failedCount, errorMsg: res.data.error || '' });

          console.log('Login failed count:', failedCount, this.data.errorMsg); // 调试输出
          if (res.data.locked) {
            this.showToast('账户已锁定，请联系管理员');
          } else {
            this.showToast(`手机号或密码错误，失败次数：${failedCount}`);
          }
        }
      },
      fail: (err) => {
        console.error('Request failed:', err); // 调试输出
        this.setData({ errorMsg: '登录失败，请重试' });
        this.showToast('登录失败，请重试');
      }
    });
  },
  showToast(message, theme = 'warning') {
    const toast = this.selectComponent('#t-message');
    toast.show({
      content: message,
      theme: theme,
      duration: 2000
    });
  }
});
