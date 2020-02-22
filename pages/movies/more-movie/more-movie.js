// pages/movies/more-movie/more-movie.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: "",
    movies: [],
    requestUrl:"",
    start: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var category = options.category;
    this.setData({
      category
    })
    var start=0
    var dataUrl = "";
    console.log(category)
    switch (category) {
      case "正在热播":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"
        break;
      case "豆瓣好评":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250"
        break;

    }
    this.setData({ 
      requestUrl: dataUrl,
        start: start
      })
    //加载更多电影数据
    util.http(dataUrl, this.processDoubanData)
    
   
  },
  processDoubanData: function (moviesDouban) {
    // 将新加载的数组追加进去
    if(this.data.isEmpty){
      var movies=[]
      this.data.isEmpty=false
    }
    else {
      var movies=this.data.movies
    }

    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx]
      var title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 8) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }

    this.setData({
      movies:movies
      })
      wx.hideNavigationBarLoading()
  },
  onPullDownRefresh(){
    wx.showNavigationBarLoading()
    util.http(this.data.requestUrl+"?start=0&count=14", this.processDoubanData)
    this.setData({
      isEmpty:true
    })
  },
  //触底加载更多
  scrollToLower: function(){
    wx.showNavigationBarLoading()
    this.data.start+=14
    var nextUrl=this.data.requestUrl+"?start="+this.data.start+"&count=14"
    // console.log(nextUrl)
    util.http(nextUrl, this.processDoubanData)
    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.category
    })
  },


})