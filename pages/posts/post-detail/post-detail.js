// pages/post-detail/post-detail.js
var postsData = require("../../../data/posts-data.js")
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    })

    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      if (postCollected) {
        this.setData({
          collected: postCollected
        })
      }
    }
    else {
      var postsCollected = {};
      postsCollected[postId] = false;
     
      wx.setStorageSync('posts_collected', postsCollected);
    }
    //监听音乐播放器播放
    var that=this
    var BackgroundAudioManager = wx.getBackgroundAudioManager()
    BackgroundAudioManager.onPlay(function(){
      that.setData({
        isPlayingMusic:true
      })
    })
    //监听音乐播放器停止
    BackgroundAudioManager.onPause(function(){
      that.setData({
        isPlayingMusic: false
      })
    })
    BackgroundAudioManager.onEnded(function(){
      that.setData({
        isPlayingMusic: false
      })
    })
    if(app.globalData.g_isPlayingMusic&&app.globalData.g_currentMusicPostId==this.data.currentPostId){
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  onColletionTap: function (event) {
    this.getPostsCollectedSyc();
  },
  getPostsCollectedSyc: function () {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    console.log(this.data.collected)
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // 更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    // console.log(this.data.collected)

    this.showToast(postsCollected, postCollected);
  },
  showToast: function (postsCollected, postCollected) {
    // // 更新文章是否的缓存值
    // wx.setStorageSync('posts_collected', postsCollected);
    // // 更新数据绑定变量，从而实现切换图片
    // this.setData({
    //   collected: postCollected
    // })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },
  onShareTap:function(event){
    wx.showActionSheet({
      itemList: [
        "分享到微信",
        "分享到微博",
        "分享到qq",
        "分享到支付宝",
      ]
    })
  },
  //控制音乐播放
  onMusicTap: function(event){
    this.musicOperation()
   },
   musicOperation: function(event){
     var postData = this.data.postData
     var BackgroundAudioManager = wx.getBackgroundAudioManager()
     if (this.data.isPlayingMusic) {
       BackgroundAudioManager.pause()
       this.setData({
         isPlayingMusic: false
       })
       app.globalData.g_isPlayingMusic = false
     } else {
       BackgroundAudioManager.src = postData.music.url
       BackgroundAudioManager.title = postData.music.title
       BackgroundAudioManager.coverImgUrl = postData.music.coverImg
       BackgroundAudioManager.play()
       this.setData({
         isPlayingMusic: true
       })
       app.globalData.g_isPlayingMusic = true
       app.globalData.g_currentMusicPostId = this.data.currentPostId
     }
   }
})