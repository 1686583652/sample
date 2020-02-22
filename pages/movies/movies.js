// pages/movie/movie.js
var app=getApp()
// var util=require("../../utils/utils.js")
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
    text: ""
    // currentTitles:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl,"inTheaters","正在热播");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣好评");
  },
  getMovieListData: function (url, settedKey, categoryTitle){
    var that=this
    wx.request({
      url:url,
      method:"GET",
      header:{
        "Content-Type":"json"
      },
      success: function(res){
        that.processDoubanData(res.data, settedKey,categoryTitle);
        
      }
    })
  },
 
  //处理接口数据函数
  processDoubanData: function (moviesDouban, settedKey, categoryTitle){
    var movies=[];
    for (var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx]
      var title=subject.title
      if(title.length>=6){
        title=title.substring(0,8)+"...";
      }
      var temp={
        stars: util.convertToStarsArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl: subject.images.large,
        movieId:subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
    // console.log(readyData)
  },

   //加载更多电影函数
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },
  bindFocus:function(){
    console.log(1)
    this.setData({
      searchPanelShow:true,
      containerShow: false
    })
  },
  bindcomfirm:function(event){
    var text=event.detail.value
    this.setData({
      text
    })
    var serchUrl = app.globalData.doubanBase +"/v2/movie/search?q="+text
    this.getMovieListData(serchUrl,"searchResult","")
    
  },
  onCancelImgTap: function(event){
    this.setData({
      searchPanelShow: false,
      containerShow: true
    })
  },
  onMovieTap: function(event){
    var movieid = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieid,
    })
  }
})