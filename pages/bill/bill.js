var app = getApp();
import api from "../../utils/network.js"
Page({
  data: {
    title: 'maomao',
    modalOpened: false,
    total_data: '',//总数据
    starttime: '',
    endtime: ''
  },
  onLoad(query) {
    // 页面加载
    this.list()
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
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
  //订单请求
  list() {
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    let that = this
    api.GET({
      url: app.url.create_bill,
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
          prefectureName: res.data.data.prefectureName,//车场名称
          stallName: res.data.data.stallName,//车位号
          plateNumber: res.data.data.plateNumber,//车牌号
          amount: res.data.data.accountAmount,//费用
          parkingTime: that.ChangeHourMinutestr(res.data.data.parkingTime),//停车时长
          total_data: res.data.data,//总数据
          starttime: api.Time(res.data.data.startTime),
          endtime: api.Time(res.data.data.endTime)
        })
      }
    }, app.token)
  },
  //确认支付
  bill_click() {
    console.log('确认支付')
    my.showLoading({
      content: '请稍候...',
      delay: 0,
    });
    let that = this
    api.GET({
      url: app.url.create_bill,
      params: {
        orderId: app.orderId
      },
      success: (res) => {
        console.log(res)
        if (!res.data.status) {
           my.hideLoading();
          return
        }
        that.setData({
          prefectureName: res.data.data.prefectureName,//车场名称
          stallName: res.data.data.stallName,//车位号
          plateNumber: res.data.data.plateNumber,//车牌号
          amount: res.data.data.accountAmount,//费用
          parkingTime: that.ChangeHourMinutestr(res.data.data.parkingTime),//停车时长
          total_data: res.data.data,//总数据
          starttime: api.Time(res.data.data.startTime),
          endtime: api.Time(res.data.data.endTime)
        })
        api.POST({
          url: app.url.pay_true,
          params: {
            couponId: 0,
            orderId: that.data.total_data.orderId,
            payType: 10
          },
          success: (res) => {
            console.log(res)
            if (res.data.status) {
              if (!res.data.data.alipayMini) {
                 my.hideLoading();
                my.navigateTo({
                  url: "/pages/payment_successful/payment_successful"
                });
                return
              }
              my.hideLoading();
              my.tradePay({
                // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
                tradeNO: res.data.data.alipayMini,
                success: (res) => {
                  console.log(res)
                  if (res.resultCode == 9000) {
                    // my.showToast({
                    //   type: 'success',
                    //   content: '支付成功',
                    //   duration: 800,
                    // });
                    // setTimeout(() => {
                      my.navigateTo({
                        url: "/pages/payment_successful/payment_successful"
                      });
                    // }, 1500)
                  } else if (res.resultCode == 6001) {
                    my.showToast({
                      type: 'fail',
                      content: '取消支付',
                      duration: 1000,
                    });
                  } else if (res.resultCode == 6002) {
                    my.showToast({
                      type: 'fail',
                      content: '网络连接出错',
                      duration: 1000,
                    });
                  }

                },
                fail: (res) => {
                  console.log(res)
                }
              });
            }else{
               my.hideLoading();
            }
          },
          fail: (err) => {
            console.log(err)
            my.hideLoading();
          }
        }, app.token)
      },
      fail: (err) => {
        console.log(err)
        my.hideLoading();
      }
    }, app.token)
  }
});
