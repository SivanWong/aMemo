// pages/today/today.js
const { quickSort } = require('../../utils/quickSort.js');
const { formatDate } = require('../../utils/format.js');
const app = getApp()
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged: false,
    noData: true,
    date: '',
    week: '',
    kindArr: [],
    images: [],
    shaft: [],
    currentTime: '',
    schedule: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.initDate();
    this.initKind();
    this.initData();
  },

  initDate () {
    let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    this.setData({
      date: formatDate(new Date()),
      week: week[new Date().getDay()]
    })
  },

  initKind () {
    this.setData({
      kindArr: wx.getStorageSync('kind') || [],
    })
  },

  initData () {
    if (app.globalData.logged) {
      db.collection('event').where({
        date: this.data.date,
        _openid: app.globalData.openid
      }).get().then(res => {
        if (res.data.length !== 0) {
          let todos = res.data;
          let images = [];
          let shaft = [];
          for (let i in todos) {
            images.push('../../images/' + this.data.kindArr[todos[i].kind].key + '.png');
            shaft.push({
              id: todos[i]._id,
              time: todos[i].time,
              sign: todos[i].sign
            });
          }
          this.setData({
            images,
            noData: false,
            shaft: quickSort(shaft, 'time')
          });
        }
      }).then(() => {
        if (this.data.shaft.length !== 0) {
          db.collection('event').doc(this.data.shaft[0].id).get().then(res => {
            this.setData({
              schedule: Object.assign(res.data, {
                img: '../../images/' + this.data.kindArr[res.data.kind].key + '.png'
              }),
              currentTime: res.data.time
            })
          })
        }
      });
    }
  },

  switch: function (e) {
    db.collection('event').doc(e.currentTarget.dataset.id).get().then(res => {
      this.setData({
        schedule: Object.assign(res.data, {
          img: '../../images/' + this.data.kindArr[res.data.kind].key + '.png'
        }),
        currentTime: res.data.time
      })
    })
  },

  sign: function () {
    if (this.data.schedule.sign !== 'none') {
      wx.showModal({
        title: '标记事件',
        content: '是否完成该事件？',
        success: (res) => {
          if (res.confirm) {
            db.collection('event').doc(this.data.schedule._id).update({
              data: {
                sign: 'success'
              },
              success: () => {
                this.update();
              }
            })
          }
        }
      })
    }
  },

  add: function () {
    wx.navigateTo({
      url: '../schedule/schedule?opr=add'
    });
  },

  update: function () {
    this.onShow();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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