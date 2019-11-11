// pages/me/me.js
const app = getApp()

Page({
  data: {
    logged: false,
    avatarUrl: './images/user-unlogin.png',
    nickName: '请登录',
  },

  onLoad: function() {
    this.initUserInfo();
  },

  disabled: function () {
    wx.showToast({
      title: '此功能暂未开放',
      icon: 'none',
      duration: 2000
    });
  },

  initUserInfo: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.onGetOpenId();
              app.globalData.userInfo = res.userInfo;
              app.globalData.logged = true;
              this.setData({
                logged: true,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                nickName: app.globalData.userInfo.nickName
              })
            }
          })
        }
      }
    })
  },

  onGetOpenId: function () {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid;
      }
    })
  },

  onGetUserInfo: function (e) {
    // 获取用户信息
    if (!this.data.logged && e.detail.userInfo) {
      this.onGetOpenId();
      app.globalData.userInfo = e.detail.userInfo;
      app.globalData.logged = true;
      this.setData({
        logged: true,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
      })
    }
  }


})
