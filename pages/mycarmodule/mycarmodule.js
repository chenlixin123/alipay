var app = getApp();
import api from "../../utils/network.js"
Page({
  data: {
    title: 'maomao',
    modalOpened_drop: false,//降锁弹框
    modalOpened_check_out: false,//结账弹框
    buttons5: [
      { text: '未到达', extClass: 'buttoncancel' },
      { text: '已到达', extClass: 'buttonBold' },
    ],
    buttons4: [
      { text: '取消', extClass: 'buttoncancel' },
      { text: '结账离场', extClass: 'buttonBold' },
    ],
    prefectureName: '',//车场名称
    stallName: '',//车位号
    plateNumber: "",//车牌号
    amount: '',//费用
    parkingTime: '',//停车时长
    total_data: '',//总数据
    setInterval: ''
  },
  onLoad(query) {
    // 页面加载
      my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    let that = this
    api.GET({
      url: app.url.current,//当前订单
      params: {},
      success(res) {
        console.log(res, "LLLLLLLLLLLLLLLLLSSSSSSSSSSS")
        if (!res.data.status) {
          my.hideLoading();
          return
        }
        my.hideLoading();
        that.setData({
          prefectureName: res.data.data.prefectureName,//车场名称
          stallName: res.data.data.stallName,//车位号
          plateNumber: res.data.data.plateNumber,//车牌号
          amount: res.data.data.amount,//费用
          parkingTime: that.ChangeHourMinutestr(res.data.data.parkingTime),//停车时长
          total_data: res.data.data,//总数据
        })
        app.orderId = res.data.data.id
      }
    }, app.token)
  },
  //订单请求
  list() {
    let that = this
    api.GET({
      url: app.url.current,//当前订单
      params: {},
      success(res) {
        console.log(res, "LLLLLLLLLLLLLLLLLSSSSSSSSSSS")
        if (!res.data.status) {
          return
        }
        that.setData({
          prefectureName: res.data.data.prefectureName,//车场名称
          stallName: res.data.data.stallName,//车位号
          plateNumber: res.data.data.plateNumber,//车牌号
          amount: res.data.data.amount,//费用
          parkingTime: that.ChangeHourMinutestr(res.data.data.parkingTime),//停车时长
          total_data: res.data.data,//总数据
        })
        app.orderId = res.data.data.id
      }
    }, app.token)
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    let that = this
    that.setData({
      setInterval: setInterval(function () {
        that.list()
      }, 180000)
    })
  },
  //计算时间  1天1小时2分钟
  // formatDuring(millisecond) {
  //   let days = parseInt(millisecond / (1000 * 60 * 60 * 24));
  //   let hours = parseInt((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   let minutes = parseInt((millisecond % (1000 * 60 * 60)) / (1000 * 60));
  //   let seconds = (millisecond % (1000 * 60)) / 1000;
  //   return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
  // },
  //计算时间  01:02
  ChangeHourMinutestr(str) {
    if (str !== "0" && str !== "" && str !== null) {
      return ((Math.floor(str / 60)).toString().length < 2 ? "0" + (Math.floor(str / 60)).toString() :
        (Math.floor(str / 60)).toString()) + ":" + ((str % 60).toString().length < 2 ? "0" + (str % 60).toString() : (str % 60).toString());
    }
    else {
      return "";
    }
  },

  onHide() {
    // 页面隐藏
    clearInterval(this.data.setInterval)
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  //当前订单
  //结账离场
  check_out() {
    console.log('结账离场')
    let that = this
    that.setData({
      modalOpened_check_out: true
    })
  },
  //降下地锁
  drop() {
    console.log('降下地锁')
    let that = this
    that.setData({
      modalOpened_drop: true
    })
  },
  //降锁弹框点击
  onButtonClick_drop(e) {
    let that = this
    that.setData({
      modalOpened_drop: false
    })
    // console.log(e.target.dataset.index)
    if (e.target.dataset.index == 0) {
      console.log('未到达')
      return
    }
    console.log('已到达,降下地锁')
    my.showLoading({
      content: '降锁中...',
    });
    api.POST({
      url: app.url.control_down,
      params: {
        orderId: that.data.total_data.id,
        parkingStatus: 1,
        stallId: that.data.total_data.stallId
      },
      success: (res) => {
        console.log(res, "HHHHHHHHHHHHHHH")
        if (res.data.data == true && res.data.status == true) {
          //订单信息
          this.list()
          my.hideLoading();
          my.showToast({
            type: 'success',
            content: '车位锁降下成功',
            duration: 2000
          })
        } else {
          if (res.data.message.code == '8005091') {
            my.showToast({
              type: 'fail',
              content: res.data.message.content,
              duration: 2000
            })
          } else if (res.data.message.code == '8005092') {
            my.showToast({
              type: 'fail',
              content: res.data.message.content,
              duration: 2000
            })
          }
          my.hideLoading();
        }
      }
    }, app.token)
  },
  //离场弹框点击
  onButtonClick_check_out(e) {
    let that = this
    that.setData({
      modalOpened_check_out: false
    })
    // console.log(e.target.dataset.index)
    if (e.target.dataset.index == 0) {
      console.log('取消')
      return
    }
    console.log('结账离场')
    my.navigateTo({
      url: '/pages/bill/bill'
    });
  }
});
