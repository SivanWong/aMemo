// pages/index/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '欢迎使用aMemo',
    btnText: '开始使用'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initUserInfo();
  },

  initUserInfo: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.onGetOpenId();
              app.globalData.userInfo = res.userInfo;
              wx.switchTab({
                url: '../today/today'
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    // 获取用户信息
    if (e.detail.userInfo) {
      this.onGetOpenId();
      app.globalData.userInfo = e.detail.userInfo;
      wx.switchTab({
        url: '../today/today'
      })
    } else {
      this.setData({
        title: '请重新进行授权',
        btnText: '重新授权'
      })
    }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})