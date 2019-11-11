// pages/memo/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind: {},
    img: '',
    title: '',
    details: '',
    date: '',
    time: '',
    remind: '',
    kindname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initKind();
    this.initData(options.id);
  },

  initKind() {
    this.setData({
      kind: wx.getStorageSync('kind') || {},
    })
  },

  initData: function (id) {
    const db = wx.cloud.database();
    db.collection('event').doc(id).get().then(res => {
      this.setData({
        img: '../../../images/' + this.data.kind[res.data.kind].key + '.png',
        title: res.data.title,
        details: res.data.details,
        date: res.data.date,
        time: res.data.time,
        remind: res.data.remind,
        kindname: this.data.kind[res.data.kind].name
      })
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