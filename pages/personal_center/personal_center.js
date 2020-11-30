var app = getApp();
import api from "../../utils/network.js"
Page({
  data: {
    title: '',
    user_mobile: '155****2257',
    login: '',
    plateList: [],
    loading: true,
    modalOpened_delete: false,
    buttons5: [
      { text: '取消', extClass: 'buttoncancel' },
      { text: '确定', extClass: 'buttonBold' },
    ],
    plateid: '',
    platenumber: ''
  },
  onLoad(query) {
    console.log(query)
    let that = this
    // 页面加载
    // console.log(app)
    // console.log('走了')
    that.setData({
      login: app.login
    })
    if (app.login == true) {
      that.setData({
        user_mobile: app.mobile
      })
    }
    console.log(app.login)

  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    let that = this
    if (app.login) {
      that.carList()
    }

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
  //登录授权
  onGetAuthorize(e) {
    let that = this
    let mobile = ''
    console.log(e)
    // console.log(app.login)
    //获取用户手机号（需授权）
    my.getPhoneNumber({
      success: (res) => {
        let encryptedData = res.response;
        console.log(res.response, 6666666666666666)
        api.GET({
          url: app.url.open_phone,
          params: {
            response: res.response
          },
          success: (res) => {
            if (!res.data.status) {
              return
            }
            console.log(res.data.data)
            mobile = res.data.data
            //绑定授权手机号
            api.POST({
              url: app.url.bind_auth_phone + '?mobile=' + mobile,
              data: {},
              success(res) {
                if (!res.data.status) {
                  return
                }
                console.log(res, "绑定授权手机号")
                app.newUserFlag = res.data.data.newUserFlag;
                app.globalData = res.data.data;
                app.token = res.data.data.token
                if (res.data.status == true) {
                  app.mobile = res.data.data.mobile
                  that.setData({
                    login: true,
                    user_mobile: res.data.data.mobile
                  })
                  app.login = true
                  my.showToast({
                    type: 'success',
                    content: '绑定成功',
                    duration: 2000
                  });
                  that.carList()
                } else {
                  my.showToast({
                    type: 'fail',
                    content: '绑定失败',
                    duration: 2000
                  });
                }
              },
              fail() {
                my.showToast({
                  type: 'fail',
                  content: '登录失败',
                  duration: 2000
                });
              }
            }, app.token)
          }
        }, app.token)
      },
      fail: (res) => {
        console.log(res);
        console.log('getPhoneNumber_fail');
      },
    });
    // console.log(app.token)


  },
  //拒接授权
  onAuthError(e) {
    console.log(e)
  },
  //请求车牌列表
  carList() {
    my.showLoading({
      content: '加载中...',
      delay: 0,
    });
    let that = this
    api.GET({
      url: app.url.plate_list,
      params: {},
      success: (res) => {
        if (!res.data.status) {
          return
        }
        my.hideLoading();
        console.log(res)
        that.setData({
          plateList: res.data.data
        })
      }
    }, app.token)
  },
  //添加车牌号
  add_plate() {
    my.navigateTo({
      url: '/pages/addPlate/addPlate'
    });
  },
  delPlate(e) {
    console.log(e.target.dataset.plateid, e.target.dataset.platenumber)
    let that = this
    that.setData({
      modalOpened_delete: true,
      plateid: e.target.dataset.plateid,
      platenumber: e.target.dataset.platenumber
    })
  },
  //删除车牌
  onButtonClick_delete(e) {
    console.log(e.target.dataset.index)
    let that = this
    that.setData({
      modalOpened_delete: false
    })
    if (e.target.dataset.index == 0) {
      return
    }
        my.showLoading({
      content: '删除中...',
      delay: 0,
    });
    api.DELETE({
      url: app.url.del_plate + '?id=' + that.data.plateid,
      params: {
      },
      success(res) {
        console.log(res);
        my.hideLoading();
        if (res.data.status == true) {
          my.showToast({
            type: 'success',
            content: '删除成功',
            duration: 2000
          });
          that.carList()
        }
      },
      fail() {
        my.hideLoading();
        my.showToast({
          type: 'fail',
          content: '删除失败',
          duration: 2000
        });
      },
      complete() {

      }
    }, app.token)

  },
  //用户指南
  goNorth(){
    console.log('用户指南')
  },
  //联系客服
  goCall(){
    my.makePhoneCall({ number: '010-85841631' });
  },
  //投诉建议
  goComplaint(){
    my.navigateTo({
      url:"/pages/complaint/complaint"
    })
  },
  //关于
  aboutLm(){
      my.navigateTo({
        url:'/pages/aboutLm/aboutLm'
      })
  }
});
