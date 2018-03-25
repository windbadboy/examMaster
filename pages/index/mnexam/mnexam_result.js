// pages/index/mnexam/mnexam_result.js
const app = getApp()
var utils = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    examData: {},
    examRight:0,
    examError:0,
    timeused:'',
    wrongData:{},
    rightRate:0,
    totalCount: 0,
    isEmpty:true,
    totalData:[],
    tempMiddle:[],
    commentHidden:true,
    userComment:'',
    itemNum:0,
    examTitle:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  console.log(options.examdata.length)

    var temp1 = options.examData
    this.data.examTitle = options.examTitle
//  console.log('inResult afterCatch:')
//  console.log(temp1)

   //处理错题重做
//   console.log("\r\n\r\n in result:")
//   console.log(temp1)
//    console.log(JSON.parse(temp1))
    var tempData = JSON.parse(temp1)
//    console.log(JSON.parse(temp1))
    this.data.tempMiddle = JSON.parse(temp1)
    var tempError = 0
    var tempRight = 0
    var tempWrong = []
    var uploadData = []
    for (var i = 0; i < tempData.length;i++) {
      var str = "{" + '"examSn":"'  + tempData[i].examSn +'",'
      str += '"userAnswer":"' + tempData[i].userAnswer + '",'
      //console.log(str)
      if(tempData[i].correctAnswer==tempData[i].userAnswer) {
          tempRight++
          str += '"firstRight":' + '"1"}'          
      } else {
        str +=  '"firstRight":' + '"0"}'         
        // for(var j = 0; j<tempData[i].examAnswer.length;j++) {
        //   tempData[i].examAnswer[j].checked = 0
        // }
          tempData[i].userAnswer = ''
          tempData[i].isSubmitted = 0
          tempWrong.push(tempData[i])
          tempError++
      }
     uploadData.push(JSON.parse(str))
   //       console.log(str)
    }
//    console.log(uploadData)
    
 //   console.log(tempWrong)
 //   console.log(tempRight)

    var tempPage = [];
    this.data.itemNum = tempRight+tempError
//    console.log(this.data.itemNum)
    if (this.data.itemNum % 10 == 0 || this.data.itemNum>10) {
      for (var i = this.data.totalCount; i < this.data.totalCount+10; i++) {
        tempPage.push(tempData[i])
      }      
      this.data.totalCount +=  10
    } else {
      for (var i = this.data.totalCount; i < this.data.itemNum; i++) {
        tempPage.push(tempData[i])
      }
      this.data.totalCount = this.data.itemNum
    }


    this.data.totalData = tempPage
    
      this.data.isEmpty = false;

    this.setData({
      userInfo: app.globalData.userInfo,
      examData: tempPage,
      timeused: options.m +'分'+options.s+'秒',
      examRight : tempRight,
      examError : tempError,
      rightRate : parseInt((tempRight /(tempError+tempRight))*100) +'%',
      wrongData: tempWrong,
    })
//console.log(this.data.examData)
    wx.checkSession({
      success: res => {
        var url = app.globalData.url + 'wxlogin/getuserInfo.php?which=uploadExam&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key
        wx.request({
          url: url,
          method:'POST',
          header: {
            "content-type": "application/json"
          },
          data: uploadData,
          success: res => {
//            console.log(res)
          }
        })
        //        console.log(url)
   //     utils.httpRequire(url, this.callback)
      },    
      fail: res=> {
        wx.showModal({
          title: '提示',
          content: '数据未上传',
          showCancel: false,
        })
      }  
    })
  },
  comment: function(res) {
    var tempSn = res.currentTarget.dataset.index
//    console.log(this.data.examData[tempSn].answerButtonShow)
    if (this.data.examData[tempSn].answerButtonShow==1) {
      this.data.examData[tempSn].answerButtonShow = 0
    } else
    {
      this.data.examData[tempSn].answerButtonShow = 1     
    }

    this.setData({
      examData: this.data.examData
    })


  },

  bindFormSubmit: function (res) {
 //   console.log(res.currentTarget.dataset.examsn)
//    console.log(res.detail.value.commentContent)
//console.log(res)
    if (res.detail.value.commentContent.trim()=='') {
      wx.showToast({
        title: '没有写内容',
      })
    }
    else {
      var tempStr = res.detail.value.commentContent.trim()
      var tempSn = res.currentTarget.dataset.examsn
      wx.checkSession({
        success: res => {
          var url = app.globalData.url + 'wxlogin/getuserInfo.php?which=uploadComment&examSn=' + tempSn + '&userId=' + app.globalData.userId + '&session_key=' + app.globalData.session_key + '&commentContent=' + tempStr + '&avatarUrl=' + app.globalData.userInfo.avatarUrl + '&nickName=' + app.globalData.userInfo.nickName
          wx.showNavigationBarLoading();
          utils.httpRequire(url, this.callback)
        }
      })
      this.data.examData[res.currentTarget.dataset.tempsn].userComment =''
      var tempArr = {
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        commentContent: tempStr,
        commentDate: utils.formatTime(new Date)
      }
      this.data.examData[res.currentTarget.dataset.tempsn].examComment.push(tempArr)
      this.setData({
        examData : this.data.examData
      })
//      console.log(this.data.examData)
    }

  },
  callback: function(res) {
//      console.log(res)
    wx.hideNavigationBarLoading()
  },
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    if (this.data.totalCount < this.data.tempMiddle.length) {


    var tempPage = [];
    for (var i = this.data.totalCount; i < this.data.totalCount + 10; i++) {
      if (this.data.totalCount <= this.data.itemNum) {
        tempPage.push(this.data.tempMiddle[i])
      }

    }   
    this.data.totalData = this.data.totalData.concat(tempPage)
    this.data.totalCount += 10

    this.setData({
      examData: this.data.totalData
    })
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
    wx.hideNavigationBarLoading();

  },  

  onPullDownRefresh: function () {
    var tempPage = [];
    this.data.totalCount = 0
    for (var i = this.data.totalCount; i < this.data.totalCount + 10; i++) {
      if (this.data.totalCount <= this.data.itemNum) {
        tempPage.push(this.data.tempMiddle[i])
      }
    }
    this.data.totalCount += 10   

    this.data.totalCount += this.data.itemNum;
    this.setData({
      examData: tempPage
    })
  },
  good: function(res) {
    console.log(res)
  },
  errorRetry: function(res) {
  if(this.data.examError!=0) {
    for (var i = 0; i < this.data.wrongData.length; i++) {
      for (var j = 0; j < this.data.wrongData[i].examAnswer.length; j++) {
        this.data.wrongData[i].examAnswer[j].checked = 0
      }

    }
    wx.redirectTo({
      url: 'mnexam_body?num=' + this.data.examError + '&retry=1&wrongData=' + JSON.stringify(this.data.wrongData) + '&examPage=0&examTitle=' + this.data.examTitle,
    })
  } else {
    wx.showToast({
      title: '没有错题了',
    })
  }
//    console.log(this.data.examError)

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})