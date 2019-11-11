// pages/schedule/kind/kind.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind: 0,
    currentkind: '',
    kindArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initKind(options);
  },

  initKind: function (options) {
    let kind = wx.getStorageSync('kind') || [];
    for (let i in kind) {
      Object.assign(kind[i], {
        img: '../../../images/' + kind[i].key + '.png'
      })
    }
    this.setData({
      currentkind: options.kind,
      kindArr: kind,
    })
  },

  onChangeKind: function (e) {
    this.setData({
      kind: e.currentTarget.dataset.kind,
      currentkind: e.currentTarget.dataset.currentkind,
    })
  },

  confirmKind: function () {
    this.refreshPre();
  },

  refreshPre: function () {
    // 获取当前页面的页桢
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里,这里面是触发上个界面，根据自己的设置触发更新函数
      prePage.onChangeKind(this.data);
      wx.navigateBack();
    }
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