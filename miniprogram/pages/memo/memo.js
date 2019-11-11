// pages/memo/memo.js
const { quickSort } = require('../../utils/quickSort.js');
const { formatDate } = require('../../utils/format.js');
const db = wx.cloud.database();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noData: true, //无数据
    date: '',
    dateId: '',
    selectableDate: [],
    selected: false,
    currentId: '',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData(this.data.date);
  },

  getData: function (date) {
    if(app.globalData.logged) {
      db.collection('date').where({
        _openid: app.globalData.openid
      }).get().then(res => {
        return quickSort(res.data, 'date')
      }).then(arr => {
        if (arr.length !== 0) {
          let selectableDate = [];
          for (let i in arr) {
            selectableDate.push(Object.assign(arr[i],{
              date: arr[i].date.split('-').join('/'),
              id: arr[i]._id
            }));
          }
          this.setData({
            selectableDate,
            date: this.data.date || selectableDate[0].date.split('/').join('-'),
            dateId: this.data.dateId || selectableDate[0].id
          })
          return selectableDate[0].date.split('/').join('-');
        }
      }).then(currentDate => {
        db.collection('event').where({
          date: date || currentDate,
          _openid: app.globalData.openid
        }).get().then(res => {
          if (res.data.length !== 0) {
            this.setData({
              noData: false,
              list: quickSort(res.data, 'time')
            })
          } else {
            this.setData({
              noData: true,
              list: []
            })
          }
        })
      })
    }
  },

  handleChangeDate: function (e) {
    this.setData({
      date: e.detail.date,
      dateId: e.detail.id
    })
    console.log(this.data.dateId)
    this.getData(e.detail.date);
  },

  cardClick: function (e) {
    if (!this.data.currentId) {
      this.setData({
        currentId: e.currentTarget.dataset.id,
        selected: !this.data.selected
      })
    }else if (e.currentTarget.dataset.id !== this.data.currentId) {
      this.setData({
        currentId: e.currentTarget.dataset.id,
        selected: this.data.selected
      })
    } else {
      this.setData({
        currentId: '',
        selected: !this.data.selected
      })
    }
  },

  check: function () {
    wx.navigateTo({
      url: './info/info?id=' + this.data.currentId
    });
  },

  modify: function (e) {
    if (e.currentTarget.dataset.sign !== 'none') {
      wx.showToast({
        title: '该事件完成时间已过，不可修改',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.navigateTo({
        url: '../schedule/schedule?opr=modify&id=' + this.data.currentId
      });
    }
  },

  delete: function () {
    if (this.data.selected) {
      wx.showModal({
        content: '是否删除该事件？',
        success: (res) => {
          if (res.confirm) {
            db.collection('event').doc(this.data.currentId).remove({
              success: () => {
                this.update(this.data.date);
              }
            })
          }
        }
      })
    }
  },

  add: function () {
    wx.navigateTo({
      url: '../schedule/schedule?opr=add&previous=' + this.data.date + ' 00:00'
    });
  },

  update: function (date) {
    this.setData({
      date
    })
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