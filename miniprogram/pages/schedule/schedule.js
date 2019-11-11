// pages/event/event.js
const { formatDate, formatTime } = require('../../utils/format.js');
const db = wx.cloud.database();
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    previous: '',
    date: '',
    time: '',
    remind: '',
    remindEnd: '',
    kindArr: '',
    kind: 0,
    currentkind: '',
    id: '',
    title: '',
    details: '',
    sign: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options
    });
    this.initDate();
    this.initTime();
    this.initKind();
    this.initPage();
  },

  initDate: function () {
    let date = formatDate(new Date()) || '';
    this.setData({
      date: date,
    })
  },

  initTime: function () {
    let time = formatTime(new Date()) || '';
    this.setData({
      time: time,
      remind: time,
      remindEnd: time
    })
  },

  initKind: function (options) {
    let kindArr = wx.getStorageSync('kind') || [];
    this.setData({
      kindArr,
      currentkind: kindArr[0].name,
      kind: 0
    })
  },

  initPage: function () {
    wx.setNavigationBarTitle({
      title: this.options.opr === 'add' ? '添加' : '修改'
    });
    if (this.options.opr === 'modify') {
      this.setData({
        id: this.options.id
      })
      this.initData();
    }
  },

  initData: function () {
    db.collection('event').doc(this.options.id).get().then(res => {
      let data = res.data;
      this.setData({
        title: data.title,
        details: data.details,
        previous: data.date + ' ' + data.time,
        date: data.date,
        time: data.time,
        remind: data.remind,
        currentkind: this.data.kindArr[data.kind].name,
        sign: data.sign
      });
    });
  },

  bindTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindDetailsInput: function (e) {
    this.setData({
      details: e.detail.value
    })
  },

  onSelectDate: function () {
    wx.navigateTo({
      url: './calendar/calendar?date=' + new Date((this.data.date + ' ' + this.data.time).replace(/-/g, '/'))
    });
  },

  onChangeDate: function (data) {
    this.setData({
      date: data.date,
      time: data.time,
      remind: data.time,
      remindEnd: data.time
    });
  },

  onSelectRemind: function (e) {
    this.setData({
      remind: e.detail.value
    })
  },

  onSelectKind: function () {
    wx.navigateTo({
      url: './kind/kind?kind=' + this.data.currentkind
    });
  },

  onChangeKind: function ({ currentkind, kind }) {
    this.setData({
      currentkind,
      kind
    })
  },

  add: function (e) {
    if (!app.globalData.logged)  {
      wx.showToast({
        title: '请先进行授权登录',
        icon: 'none',
        duration: 2000
      });
    } else if (!this.data.title) {
      wx.showToast({
        title: '标题不可为空',
        icon: 'none',
        duration: 2000
      });
    } else {
      db.collection('event').where({
        date: this.data.date,
        time: this.data.time,
      }).get().then(res => {
        if (res.data.length !== 0) {
          wx.showToast({
            title: '该时间已经有安排啦',
            icon: 'none',
            duration: 2000
          });
        } else {
          db.collection('date').get().then(res => {
            let dateArr = [];
            for (let i in res.data) {
              dateArr.push(res.data[i].date);
            }
            if (dateArr.indexOf(this.data.date) === -1) {
              db.collection('date').add({
                data: {
                  date: this.data.date
                }
              })
            }
          })

          db.collection('event').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              date: this.data.date,
              time: this.data.time,
              details: this.data.details,
              kind: this.data.kind,
              title: this.data.title,
              remind: this.data.remind,
              formId: e.detail.formId,
              sign: 'none'
            }
          }).then(() => {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                this.refreshPre();
              }
            });
          })
        }
      });
    }
  },

  modify: function () {
    if (!this.data.title) {
      wx.showToast({
        title: '标题不可为空',
        icon: 'none',
        duration: 2000
      });
    } else {
      if (this.data.previous !== (this.data.date + ' ' + this.data.time)) {
        db.collection('event').where({
          date: this.data.date,
          time: this.data.time,
        }).get().then(res => {
          if (res.data.length !== 0) {
            wx.showToast({
              title: '该时间已经有安排啦',
              icon: 'none',
              duration: 2000
            });
          } else {
            db.collection('event').doc(this.data.id).update({
              data: {
                date: this.data.date,
                time: this.data.time,
                details: this.data.details,
                kind: this.data.kind,
                title: this.data.title,
                remind: this.data.remind,
                sign: this.data.sign
              },
              success: () => {
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 2000,
                  success: () => {
                    this.refreshPre();
                  }
                });
              }
            })
          }
        })
      } else {
        db.collection('event').doc(this.data.id).update({
          data: {
            date: this.data.date,
            time: this.data.time,
            details: this.data.details,
            kind: this.data.kind,
            title: this.data.title,
            remind: this.data.remind,
            sign: this.data.sign
          },
          success: () => {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                this.refreshPre();
              }
            });
          }
        })
      }
     
    }
  },

  refreshPre: function () {
    // 获取当前页面的页桢
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里,这里面是触发上个界面，根据自己的设置触发更新函数
      var param = this.data.options.previous || this.data.previous
      prePage.update(param.split(' ')[0].split('/').join('-'));
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