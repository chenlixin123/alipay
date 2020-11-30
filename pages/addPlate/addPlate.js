import api from "../../utils/network.js"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyWord: false,
    eightWord: false,
    carPlete: ["京", "津", "冀", "晋", "蒙", "辽", "吉", "黑", "沪",
      "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "粤",
      "桂", "琼", "渝", "川", "贵", "云", "藏", "陕", "甘", "青",
      "宁", "新", "使"
    ], //中文键盘key
    descWord: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
      "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L",
      "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
      "Y", "Z", "领", "警", "学", "使", "港", "澳"
    ], //中文键盘key
    zhData: [],
    zhDatas: [],
    CanNum: 7,
    types: "",
    numes: "",
    preId: "",
    distance: "",
    statues: "",
    preIds: "",
    data: "",
    //本地经纬度
    location: {
      longitude: "116.41361",
      latitude: "39.91106"
    },
    preName: '',
    val: '',
    stallEndTime: '',
    plate: '',
    stallId: '',
    battery: '',
    gatewayStatus: '',
    carlist: [],
    obj: '',
    longitude: "116.41361",
    latitude: "39.91106",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let self = this;
    // api.GET({
    //   url: app.url.plate_list,//车牌列表
    //   params: {},
    //   success(res) {
    //     console.log(res,"kKKKKKKKKKKKKKKKKK")
    //     let plateList = res.data.data;
    //     self.setData({
    //       carlist: plateList,
    //     })
    //   },
    // }, app.token)
  },
  onShow() {
    this.setData({
      zhData: []
    })
  },
  onHide() {
    // 页面隐藏
    this.setData({
      zhData: []
    })
  },
  onUnload() {
    // 页面被关闭
    //  this.setData({
    //   zhData:[]
    // })
  },
  //调取车牌区域软键盘
  plateZh() {
    let btns = this.data.carPlete;
    this.setData({
      keyBtn: btns,
      keyWord: true
    })
  },
  //调取车牌号软键盘
  inMsg() {
    let btns = this.data.descWord;
    this.setData({
      keyBtn: btns,
      keyWord: true
    })
  },

  //键盘删除
  keyDel() {
    let zhData = this.data.zhData;
    zhData.pop();
    this.setData({
      zhData: zhData
    })
  },
  //键盘确定
  keyTrue() {
    this.setData({
      keyWord: false
    })
  },
  //输入
  inPleteNumber(e) {
    console.log(e.currentTarget.dataset.key);
    let zh = e.currentTarget.dataset.key;
    let zhData = this.data.zhData;
    let keword2 = this.data.descWord;
    if (zhData.length == 0) {
      this.setData({
        inpStyle: "border: 1px solid #f66913",
        keyBtn: keword2
      })
    }
    //可输车牌号数量
    let CanNum = this.data.CanNum;
    if (zhData.length < CanNum) {
      zhData.push(zh);
      this.setData({
        zhData: zhData
      })
    }
  },

  //是否启用8位车牌
  changeNum() {
    if (this.data.CanNum == 7) {
      this.setData({
        CanNum: 8
      })
    } else {
      this.setData({
        CanNum: 7
      })
    }
  },
  //提交车牌
  addPlete() {
    let self = this;
    let that = this
    let nums = this.data.zhData;
    let list = []
    console.log(self.data.carlist)
    console.log(nums)
    nums = nums.toString().replace(/,/g, '');
    console.log(nums)
    if (nums == "") {
      my.alert('请输入正确的车牌号');
    }
    my.getStorage({
      key: 'abc',
      success: function (res) {
        console.log(res.data, "KKKKKKKK")
        self.setData({
          obj: res.data
        })
      },
    })
    self.data.carlist.map((res) => {
      console.log(res, 'ppppppppppppppppppppp' + self.data.zhData)
      if (res.vehMark == nums) {
        list.push(res.vehMark)
        console.log(list, "LLLLAAAAAAAAAAAAAAAAAAAAAAAAAA")
      }
    })
    if (list.length != 0) {
      list.map((res) => {
        if (res == nums) {
          // wx.showToast({
          //   title: '添加失败，车牌号已存在',
          //   icon: 'none'
          // })
          my.showToast({
            type: 'fail',
            content: '添加失败，车牌号已存在',
            duration: 2000
          });
          return
        }
      })
    } else {
      // let xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
      // let creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
      my.showLoading({
          content: '保存中...',
          delay: 0,
        });
      if (nums.length == 7) {
        console.log(nums)
        console.log(self.data.preId)
        api.POST({
          url: app.url.add_plate,
          params: {
            vehMark: nums,
            preId: self.data.preId
          },
          success(res) {
            console.log(res)
            if (res.data.status == false) {
              //    my.showToast({
              //   type: 'fail',
              //   content: res.data.message.content,
              //   duration: 2000
              // });
              my.hideLoading();
            } else {
              my.hideLoading();
              self.setData({
                statues: res.data.status,
                data: res.data.data
              })
              my.showToast({
                type: 'success',
                content: '添加成功',
                duration: 2000
              });
              my.navigateBack();
            }
          },
          fail() {
            my.hideLoading();
            my.showToast({
              type: 'fail',
              content: '添加失败',
              duration: 2000
            });
          }
        }, app.token)
      } else if (nums.length == 8) {
        api.POST({
          url: app.url.add_plate,
          params: {
            vehMark: nums
          },
          success(res) {
            console.log(res)
            if (res.data.status == false) {
              my.hideLoading();
              my.showToast({
                type: 'success',
                content: res.data.message.content,
                duration: 2000
              });
              // my.alert(res.data.message.content);
            } else {
              my.hideLoading();
              //添加成功之后跳转到首页
              console.log(res, "这是添加车牌的数据")
              my.showToast({
                type: 'success',
                content: '添加成功',
                duration: 2000
              });
              my.navigateBack();
            }
          },
          fail() {
            my.hideLoading();
            my.showToast({
              type: 'fail',
              content: '添加失败',
              duration: 2000
            });
          }
        }, app.token)
      } else {
        my.hideLoading();
        my.showToast({
          type: 'fail',
          content: '请输入正确的车牌号',
          duration: 2000
        });
      };
    }
  }
})