// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse:wx.canIUse("button.open-type.getUserInfo")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   //查看用户是否授权
   wx.getSetting({
     success(res){
       if(res.authSetting['scope.userInfo']){
         wx.getUserInfo({
           success:function(res){
             console.log(res.userInfo)
           }
         })
       }
     }
   })
  },
  bindGetUserInfo: function(){
    console.log(1)
    wx.switchTab({
      url: '../posts/posts',
    })
  }
})