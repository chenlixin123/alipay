var app = getApp();
import api from "../../utils/network.js"
Page({
  data: {
    title: 'maomao',
    modalOpened: false,
    data: '',
    starttime: '',
    endtime: ''
  },
  onLoad(query) {
    // 页面加载
    let that = this
    that.pay_list()
  },
  //订单渲染
  pay_list() {
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    let that = this
    api.GET({
      url: app.url.pay_check,
      params: {
        orderId: app.orderId
      },
      success: (res) => {
        console.log(res)
        if (!res.data.status) {
          my.hideLoading();
          return
        }
        my.hideLoading();
        that.setData({
          data: res.data.data,
          starttime: api.Time(res.data.data.startTime),
          endtime: api.Time(res.data.data.endTime),
        })
      }
    }, app.token)
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
     my.reLaunch({
      url: "/pages/index/index"
    })
  },
  onUnload() {
    // 页面被关闭
     my.reLaunch({
      url: "/pages/index/index"
    })
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
  pay_click() {
    console.log('支付完成')
    // let pages = getCurrentPages(); //当前页面栈
    // my.navigateBack(-5)
    my.reLaunch({
      url: "/pages/index/index"
    })
  }
});
