// pages/schedule/calendar/calendar.js
const { formatDate, formatTime } = require('../../../utils/format.js');

const db = wx.cloud.database();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    timeStart: '',
    date: 0,
    week: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    monthArr: [],
    currentMonth: 0,
    selectDate: '',
    selectedDate: formatDate(new Date())
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date: options.date
    })
    this.initDate();
    this.initTimePicker();
  },

  initDate: function () {
    let today = new Date().getTime();
    let monthArr = [];
    for (let i = 0; i < 12; i++) {
      let year = new Date(today).getFullYear();
      let month = new Date(today).getMonth() + 1;
      monthArr.push(year + '-' + month);
      today += 30 * 24 * 60 * 60 * 1000;
    }

    let year = new Date(this.data.date).getFullYear();
    let selectMonth = new Date(this.data.date).getMonth() + 1;
    let dateArr = this.changeMonth(year + '-' + selectMonth);

    this.setData({
      dateArr,
      monthArr,
      currentMonth: (12 + selectMonth - new Date().getMonth() - 1) % 12,
      selectDate: selectMonth.toString() +
        new Date(this.data.date).getDate().toString(),
    })


  },

  changeMonth: function (currentYM) {
    let todayM = new Date().getMonth() + 1;
    let todayD = new Date().getDate();
    let first = new Date(currentYM);
    let week = new Date(first).getDay();
    let year = new Date(first).getFullYear();
    let month = new Date(first).getMonth() + 1;
    let lastTotal = new Date(year, month - 1, 0).getDate();
    let total = new Date(year, month, 0).getDate();
    let dateArr = [];
    for (let i = week; i > 0; i--) {
      dateArr.push({
        monthdate: (month - 1).toString() + (lastTotal - i - 1).toString(),
        show: false,
        date: (lastTotal - i - 1).toString()
      });
    }
    for (let i = 1; i <= total; i++) {
      let monthdate = month.toString() + i.toString();
      dateArr.push({
        monthdate,
        show: true,
        disable: month === todayM && i < todayD ? true : false,
        date: i.toString()
      });
    }
    return dateArr;
  },

  initTimePicker: function () {
    let time = formatTime(new Date(this.data.date));
    this.setData({
      time,
      timeStart: time
    })
  },

  lastMonth: function () {
    if (this.data.currentMonth > 0) {
      this.setData({
        dateArr: this.changeMonth(this.data.monthArr[this.data.currentMonth - 1]),
        currentMonth: this.data.currentMonth - 1
      })
    }
  },

  nextMonth: function () {
    if (this.data.currentMonth < this.data.monthArr.length - 1) {
      this.setData({
        dateArr: this.changeMonth(this.data.monthArr[this.data.currentMonth + 1]),
        currentMonth: this.data.currentMonth + 1
      })
    }
  },

  selectDate: function (e) {
    if (!e.currentTarget.dataset.disable) {
      this.setData({
        selectDate: e.currentTarget.dataset.monthdate
      })

      this.setData({
        selectedDate: this.data.monthArr[this.data.currentMonth] + '-' + e.currentTarget.dataset.date
      })

      if (formatDate(new Date()) !== this.data.selectedDate) {
        this.setData({
          timeStart: '00:00'
        })
      }
    }
  },

  bindTimeChange: function (e) {
    db.collection('event').where({
      date: this.data.selectedDate,
      time: e.detail.value,
    }).get().then(res => {
      if (res.data.length !== 0) {
        wx.showToast({
          title: '该时间已经有安排啦',
          icon: 'none',
          duration: 2000
        });
      } else {
        this.setData({
          time: e.detail.value
        })
      }
    })
  },

  confirm: function () {
    this.refreshPre();
  },

  refreshPre: function () {
    // 获取当前页面的页桢
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里,这里面是触发上个界面，根据自己的设置触发更新函数
      prePage.onChangeDate({
        date: this.data.selectedDate,
        time: this.data.time
      });
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