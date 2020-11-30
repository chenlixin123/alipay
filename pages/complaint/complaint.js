var app = getApp();
import api from "../../utils/network.js"
Page({
  data: {
     descNum: 0,
      btnFlag: true,
      descTxt:'',
      inputBottom:''
  },
     //输入建议
   inDesc(e) {
     console.log(e)
      let descNum = e.detail.cursor;
      let descTxt = e.detail.value;
      if (descNum > 2) {
         this.setData({
            descNum: descNum,
            btnFlag:false,
            descTxt: descTxt
         })
      } else {
         this.setData({
            descNum: descNum,
            btnFlag: true
         })
      }
   },
   //提交建议
   switchs(){
      const descTxts = this.data.descTxt;   //其他原因的内容
      api.POST({
         url: app.url.complaint,
         params: {
            content: descTxts
         },
         success() {
            my.reLaunch({
               url: '/pages/index/index',
            })
         },
         fail() {

         }
      },app.token)
   },
  onLoad(query) {
    // 页面加载
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
  },
  //输入聚焦
 
foucus: function (e) {
var that = this;
that.setData({
inputBottom: e.detail.height
})
},
//失去聚焦
blur: function (e) {
var that = this;
that.setData({
inputBottom: 0
})
}
})
