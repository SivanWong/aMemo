// components/simple_calendar/simple_calendar.js
const { formatDate } = require('../../utils/format.js');

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    'selectableDate': {
      // 目前接受的类型包括：String, Number, Boolean, Object, Array, null
      type: Array,
      value: [], //默认值
      observer: function (selectableDate) {
        this.setData({
          selectableDate
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arr: []
  },

  observers: {
    'selectableDate': function (selectableDate) {
      // 在 date被设置时，执行这个函数
     this.init();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    init: function () {
      // 在组件实例进入页面节点树时执行
      let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      let dateArr = this.data.selectableDate || [];
      let arr = [];
      for (let i = 0; i < dateArr.length; i++) {
        let date = new Date(dateArr[i].date);
        arr.push({
          yearmonth: dateArr[i].date.split('/')[0] + '-' + dateArr[i].date.split('/')[1],
          monthdate: dateArr[i].date.split('/')[1] + '-' + dateArr[i].date.split('/')[2],
          day: date.getDate(),
          week: week[date.getDay()],
          id: dateArr[i]._id
        })
        if(i === 0 && !this.data.yearmonth && !this.data.selected) {
          this.setData({
            yearmonth: dateArr[i].date.split('/')[0] + '-' + dateArr[i].date.split('/')[1],
            selected: dateArr[i].date.split('/')[1] + '-' + dateArr[i].date.split('/')[2]
          })
        }
      }
      this.setData({
        arr
      })
    },

    onChangeDate: function (e) {
      this.setData({
        yearmonth: e.currentTarget.dataset.yearmonth,
        selected: e.currentTarget.dataset.monthdate,
      })
      let params = {
        date: e.currentTarget.dataset.yearmonth + '-' + 
        e.currentTarget.dataset.day,
        id: e.currentTarget.dataset.id
      }
      this.triggerEvent('changeDate', params)
    }

  }
})
