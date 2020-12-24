var app = getApp();
import api from "../../utils/network.js"
Page({
  data: {
    title: 'maomao',
    modalOpened_occupy: false,//占用
    modalOpened_explain: false,//预约说明
    modalOpened_yuyue: false,//预约
    modalOpened_chepai: false,//车牌
    showBottom: false,//授权弹出框
    groupName: '',//车场名称
    buttons5: [
      { text: '取消', extClass: 'buttoncancel' },
      { text: '确定预约', extClass: 'buttonBold' },
    ],
    buttons4: [
      { text: '取消', extClass: 'buttoncancel' },
      { text: '确定', extClass: 'buttonBold' },
    ],
    car_data: [
    ],
    indexs: -1,
    ss: '',
    freeMins: '',
    businessTime: '',
    desc: '',
    currentFee: '',
    currentTimePeriod: '',
    topFee: '',
    parkingMap: '',
    chessboardXvalue: '',
    chessboardYvalue: '',
    text: '',
    carname: "",
    ind: -1,
    value: '',
    name_text: '',
    plateList: [],
    plateId: '',//车牌ID
    prefectureId: '',//车区ID
    stallId: '',//车位ID
    setInterval: '',
    parkCode: ''
  },
  onLoad(options) {
    // 页面加载
    // my.alert({
    //   title: JSON.stringify(options.shopid)
    // });
    // console.log(options.shopid)
    if (!app.token) {
      let that = this
        app.parkCode = options.shopid ? options.shopid : "35305761"
        my.showLoading({
          content: '加载中...',
          delay: 0,
        });
        my.getAuthCode({
          scopes: ['auth_base'],//获取登录authCode
          success: (res) => {
            if (res.authCode) {
              console.log('继续请求本公司接口')
              my.request({
                url: app.url.vx_login + '?authCode=' + res.authCode,//登录接口
                method: 'GET',
                data: {},
                success: (result) => {
                  console.log(result)
                  if (result.data.status == false) {
                    my.hideLoading();
                    return
                  }
                  app.token = result.data.data.token
                  app.globalData = result.data.data
                  api.GET({
                    url: app.url.car_list + '?parkCode=' + app.parkCode,//渲染车位接口
                    params: {},
                    success: (res) => {
                      // console.log(res)
                      if (!res.data.status) {
                        my.setNavigationBar({
                          title: '凌猫智行'
                        })
                        my.hideLoading();
                        return
                      }
                      let ss = []
                      res.data.data.parkingDataMap.map((res) => {
                        if (res.name != undefined && res.status == 1) {
                          ss.push(res)
                          that.setData({
                            ss: ss
                          })
                        }
                      })
                      if (res.data && res.data.data) {
                        my.setNavigationBar({
                          title: res.data.data.groupName
                        })
                        that.setData({
                          freeMins: res.data.data.freeMins,
                          businessTime: res.data.data.businessTime,
                          desc: res.data.data.descList,
                          currentFee: res.data.data.currentFee,
                          currentTimePeriod: res.data.data.currentTimePeriod + "   |  ",
                          topFee: res.data.data.topFee,
                          prefectureId: res.data.data.preId,
                          groupName: res.data.data.groupName
                        })
                        if (res.data.data.parkingDataMap == "") {
                          that.setData({
                            parkingMap: null
                          })
                        } else if (res.data && res.data.data) {
                          let parkingMap = {};
                          res.data.data.parkingDataMap.forEach(item => {
                            let key = (item.x) + ',' + (item.y)
                            parkingMap[key] = item
                          })
                          // console.log(parkingMap)
                          that.setData({
                            chessboardXvalue: res.data.data.gridX,
                            chessboardYvalue: res.data.data.gridY,
                            parkingMap: parkingMap,
                          })
                        }
                      }
                    }
                  }, app.token)

                  if (!result.data.data.id) {
                    console.log('用户未注册')
                    my.hideLoading();
                    app.login = false
                    return
                  }
                  app.login = true
                  app.mobile = result.data.data.mobile
                  console.log('已经注册')

                  api.GET({
                    url: app.url.current,//当前订单
                    params: {},
                    success(res) {
                      // console.log(res, "LLLLLLLLLLLLLLLLLSSSSSSSSSSS")
                      if (!res.data.status) {
                        my.hideLoading();
                        return
                      }
                      if (res.data.data == null) {
                      } else {
                        console.log('跳转页面')
                        my.navigateTo({
                          url: '/pages/mycarmodule/mycarmodule',
                        })
                      }
                      my.hideLoading();
                    }
                  }, app.token)
                },
                fail: (error) => {
                  console.log(error)
                  my.showToast({
                    type: 'fail',
                    content: error.data,
                    duration: 2000
                  });
                  my.hideLoading();
                }
              }, app.token)
            } else {
              my.hideLoading();
            }
          }
        })
    }
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    let that = this
    console.log("zouleS")
    that.setData({
      ind: -1
    })
    // 页面显示
    if (app.token) {
      // my.showLoading({
      //   content: '加载中...',
      //   delay: 0,
      // });
      that.plate_list()
      api.GET({
        url: app.url.current,//当前订单
        params: {},
        success(res) {
          if (!res.data.status) {
            my.hideLoading();
            return
          }
          if (res.data.data == null) {
            api.GET({
              url: app.url.car_list + '?parkCode=' + app.parkCode,//渲染车位接口
              params: {},
              success: (res) => {
                // console.log(res)
                if (!res.data.status) {
                  my.hideLoading();
                  return
                }
                my.hideLoading();
                let ss = []
                res.data.data.parkingDataMap.map((res) => {
                  if (res.name != undefined && res.status == 1) {
                    ss.push(res)
                    that.setData({
                      ss: ss
                    })
                  }
                })
                if (res.data && res.data.data) {
                  that.setData({
                    freeMins: res.data.data.freeMins,
                    businessTime: res.data.data.businessTime,
                    desc: res.data.data.descList,
                    currentFee: res.data.data.currentFee,
                    currentTimePeriod: res.data.data.currentTimePeriod + "   |  ",
                    topFee: res.data.data.topFee,
                    prefectureId: res.data.data.preId,
                    groupName: res.data.data.groupName
                  })
                  if (res.data.data.parkingDataMap == "") {
                    that.setData({
                      parkingMap: null
                    })
                  } else if (res.data && res.data.data) {
                    let parkingMap = {};
                    res.data.data.parkingDataMap.forEach(item => {
                      let key = (item.x) + ',' + (item.y)
                      parkingMap[key] = item
                    })
                    // console.log(parkingMap)
                    that.setData({
                      chessboardXvalue: res.data.data.gridX,
                      chessboardYvalue: res.data.data.gridY,
                      parkingMap: parkingMap,
                    })
                  }
                }
              }
            }, app.token)
            if (app.number == true) {
              api.GET({
                url: app.url.plate_list,//车牌号列表
                params: {},
                success: (res) => {
                  if (!res.data.status) {
                    return
                  }
                  if (res.data.data.length == 0) {
                    // my.navigateTo({
                    //   url: '/pages/addPlate/addPlate'
                    // })
                    return
                  }
                  that.setData({
                    plateList: res.data.data,
                    modalOpened_chepai: true
                  })
                  // console.log(res, '下一步之前')
                }
              }, app.token)
              app.number = false
            }
          } else {
            console.log('跳转页面')
            my.hideLoading();
            my.navigateTo({
              url: '/pages/mycarmodule/mycarmodule',
            })
          }
        }
      }, app.token)
    }
    that.setData({
      setInterval: setInterval(function () {
        if (app.token) {
          that.list()
        }
      }, 180000)
    })
  },
  //定时刷新页面
  list() {
    let that = this
    api.GET({
      url: app.url.car_list + '?parkCode=' + app.parkCode,//渲染车位接口
      params: {},
      success: (res) => {
        // console.log(res)
        if (!res.data.status) {
          return
        }
        let ss = []
        res.data.data.parkingDataMap.map((res) => {
          if (res.name != undefined && res.status == 1) {
            ss.push(res)
            that.setData({
              ss: ss
            })
          }
        })
        if (res.data && res.data.data) {
          that.setData({
            freeMins: res.data.data.freeMins,
            businessTime: res.data.data.businessTime,
            desc: res.data.data.descList,
            currentFee: res.data.data.currentFee,
            currentTimePeriod: res.data.data.currentTimePeriod + "   |  ",
            topFee: res.data.data.topFee,
            prefectureId: res.data.data.preId,
            groupName: res.data.data.groupName
          })
          if (res.data.data.parkingDataMap == "") {
            that.setData({
              parkingMap: null
            })
          } else if (res.data && res.data.data) {
            let parkingMap = {};
            res.data.data.parkingDataMap.forEach(item => {
              let key = (item.x) + ',' + (item.y)
              parkingMap[key] = item
            })
            // console.log(parkingMap)
            that.setData({
              chessboardXvalue: res.data.data.gridX,
              chessboardYvalue: res.data.data.gridY,
              parkingMap: parkingMap,
            })
          }
        }
      }
    }, app.token)
  },
  //车牌号列表
  plate_list() {
    let that = this
    api.GET({
      url: app.url.plate_list,//车牌号列表
      params: {},
      success: (res) => {
        if (!res.data.status) {
          return
        }
        that.setData({
          plateList: res.data.data,
        })
      }
    }, app.token)
  },
  onHide() {
    // 页面隐藏
    clearInterval(this.data.setInterval)
    my.hideLoading();
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
  //点击预约说明
  tap_explain() {
    this.setData({
      modalOpened_explain: true,
    });
  },
  //关闭预约说明弹框
  onModalClick_explain() {
    this.setData({
      modalOpened_explain: false,
    });
  },
  //点击个人中心
  tap_Personal() {
    // console.log('点击个人中心')
    my.showLoading({
      content: '跳转中...',
      delay: 0,
    });
    my.navigateTo({
      url: '/pages/personal_center/personal_center'
    });
  },
  //关闭占用弹框
  onModalClick_occupy() {
    this.setData({
      modalOpened_occupy: false,
    });
  },

  // 点击车位
  park(e) {
    let that = this
    console.log(e.target.dataset)
    this.setData({
      carname: e.target.dataset.item
    })
    this.setData({
      status: e.target.dataset.status,
      text: e.target.dataset.item,
      stallId: e.target.dataset.val,
      ind: e.target.dataset.dex,
      value: e.target.dataset.item
    })
    if (this.data.status == 1) {
      if (app.login == false) {
        //获取用户手机号（需授权）
        that.setData({
          showBottom: true
        })
        return
      }
      my.showLoading({
        content: '加载中...',
        delay: 0,
      });
      this.setData({
        ind: e.target.dataset.dex,
        value: e.target.dataset.item
      })
      api.GET({
        url: app.url.plate_list,//车牌号列表
        params: {},
        success: (res) => {
          if (!res.data.status) {
            my.hideLoading();
            return
          }
          if (res.data.data.length == 0) {
            my.hideLoading();
            app.number = true
            my.navigateTo({
              url: '/pages/addPlate/addPlate'
            })
            return
          }
          my.hideLoading();
          that.setData({
            plateList: res.data.data,
            modalOpened_chepai: true
          })
          console.log(res, '下一步之前')
        }
      }, app.token)
    } else if (this.data.status == 2) {
      this.setData({
        ind: -1,
        modalOpened_occupy: true,
        name_text: '该车位已被他人使用,请选择其他车位',
      })
    } else if (this.data.status == 4) {
      this.setData({
        ind: -1,
        modalOpened_occupy: true,
        name_text: '该车位已下线,请选择其他车位',
      })
    }
  },
  //选择车牌号
  img_tap(e) {
    // console.log(e.target.dataset.index)
    // console.log(e.target.dataset.item)
    this.setData({
      indexs: e.target.dataset.index,
      plateId: e.target.dataset.item.id
    })
  },
  //确定选择的车牌号
  onButtonClick_chepai(e) {
    let that = this

    // console.log(e.target.dataset.index)
    if (e.target.dataset.index == 0) {
      that.setData({
        modalOpened_chepai: false,
        indexs: -1,
        ind: -1,
      })
      console.log('取消了')
      return
    }
    if (that.data.indexs == -1) {
      my.showToast({
        type: 'fail',
        content: '请选择车牌号',
        duration: 2000
      });
      return
    }
    that.setData({
      modalOpened_chepai: false,
      indexs: -1,
      modalOpened_yuyue: true
    })
    // console.log('确定了')
  },
  //添加车牌号
  img_add() {
    // console.log(this.data.plateList.length)
    if (this.data.plateList.length >= 3) {
      my.showToast({
        type: 'fail',
        content: '最多可添加三个车牌号',
        duration: 2000
      });
      return
    }
    app.number = true
    my.navigateTo({
      url: '/pages/addPlate/addPlate'
    })
  },
  //登录授权
  onGetAuthorize(e) {
    let that = this
    my.showLoading({
      content: '授权中...',
      delay: 0,
    });
    that.setData({
      showBottom: false
    })
    let mobile = ''
    // console.log(e)
    // console.log(app.login)
    //获取用户手机号（需授权）
    my.getPhoneNumber({
      success: (res) => {
        let encryptedData = res.response;
        console.log(encryptedData)
        api.GET({
          url: app.url.open_phone,
          params: {
            response: encryptedData
          },
          success: (res) => {
            if (!res.data.status) {
              my.hideLoading();
              return
            }
            if (!res.data.data) {
              my.hideLoading();
              my.showToast({
                type: 'fail',
                content: '手机号授权失败，请重新授权',
                duration: 2000
              });
              return
            }
            mobile = res.data.data
            console.log(mobile, '解密后的手机号')
            //绑定授权手机号
            api.POST({
              url: app.url.bind_auth_phone + '?mobile=' + mobile,
              data: {},
              success(res) {
                console.log('绑定成功的返回')
                if (!res.data.status) {
                  my.hideLoading();
                  return
                }
                app.newUserFlag = res.data.data.newUserFlag;
                app.globalData = res.data.data;
                app.token = res.data.data.token
                my.hideLoading();
                if (res.data.status == true) {
                  app.login = true
                  that.setData({
                    login: true,
                    user_mobile: res.data.data.mobile
                  })
                  app.mobile = res.data.data.mobile
                  my.showToast({
                    type: 'success',
                    content: '授权成功',
                    duration: 2000
                  });

                  api.GET({
                    url: app.url.plate_list,//车牌号列表
                    params: {},
                    success: (res) => {
                      if (!res.data.status) {
                        return
                      }
                      if (res.data.data.length == 0) {
                        app.number = true
                        my.navigateTo({
                          url: '/pages/addPlate/addPlate'
                        })
                        return
                      }
                      that.setData({
                        plateList: res.data.data,
                        modalOpened_chepai: true
                      })
                    }
                  }, app.token)

                } else {
                  my.showToast({
                    type: 'fail',
                    content: '授权失败',
                    duration: 2000
                  });
                }
              }
            }, app.token)
          }
        }, app.token)
      }
    });
  },
  //拒接授权
  onAuthError(e) {
    // console.log(e)
  },
  //取消授权
  cancel_btn() {
    this.setData({
      showBottom: false
    })
  },
  //确定预约
  onButtonClick_yuyue(e) {
    let that = this
    that.setData({
      modalOpened_yuyue: false
    })
    // console.log(e.target.dataset.index)
    if (e.target.dataset.index == 0) {
      that.setData({
        ind: -1
      })
      return
    }
    // console.log('走预约')
    that.appointmentes()
  },
  //预约车位操作
  appointmentes() {
    let that = this;
    my.showLoading({
      content: '预约中...',
      delay: 0,
    });
    that.setData({
      text: that.data.value
    })
    api.POST({
      url: app.url.Create_Submit, //选择车位预约下单
      params: {
        ordersource: 1, //订单来源标识  1 预约 2 扫码
        plateId: that.data.plateId,  //车牌ID
        prefectureId: that.data.prefectureId, // 车区ID
        stallId: that.data.stallId,
      },
      success(res) {
        console.log(res)
        if (res.data.status == true) {
          setTimeout(function () {
            api.GET({
              url: app.url.current,//当前订单
              params: {},
              success(res) {
                if (res.data.data == null) {
                  console.log('null')
                  setTimeout(() => {
                    my.hideLoading();
                    my.navigateTo({
                      url: '/pages/mycarmodule/mycarmodule',
                    })
                  }, 2000)
                } else {
                  console.log('跳转页面')
                  my.hideLoading();
                  my.navigateTo({
                    url: '/pages/mycarmodule/mycarmodule',
                  })
                }
              }
            }, app.token)
          }, 4000)
        } else {
          my.hideLoading();
          my.showToast({
            type: 'fail',
            content: '预约车位失败，请重新预约',
            duration: 2000
          })
        }
      }
    }, app.token)
  }
});
