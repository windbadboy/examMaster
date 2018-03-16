const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function httpRequire(url, callback) {
  wx.request({
    url: url,
    success: function (res) {
      wx.hideNavigationBarLoading();
//      console.log(res)
      callback(res)
    },
    fail: res => {
      console.log('util.httprequire:' + res)
    }
  })
}
//获取用户登录信息
function getLoginInfo(callback, url) {
  var code = ''
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log('login successfully.')
      code = res.code
    },
    fail: function (res) {
      wx.showToast({
        title: '登录异常',
        icon: 'success',
        duration: 2000
      })
      wx.setStorageSync('userId', 'null')
    }
  })
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        console.log('I can use userInfo.')
        wx.getUserInfo({
          success: res => {
            console.log('get userinfo successfully')
            //              console.log(res)
            var encryptedData = res.encryptedData
            var iv = res.iv
            wx.setStorageSync('userInfo', res.userInfo)
            //         this.globalData.userInfo = res.userInfo

            myLogin(code, encryptedData, iv, callback, url)
          },
          fail: res => {
            console.log(res)
          }
        })
      } else {
        wx.showToast({
          title: '用户信息获取失败',
          icon: 'success',
          duration: 2000
        })
        wx.setStorageSync('userId', 'null')
        wx.openSetting({
          success: function (res) {

            if (res.authSetting['scope.userInfo']) {
              console.log('获取用户数据成功。')
            }
          }
        })
      }
    },
    fail: res => {
      console.log(res)
    }
  })

}



//设置用户信息到数据库
function myLogin(code, encryptedData, iv, callback, url) {
  wx.request({
    //   url: 'https://www.badteacher.club/wxlogin/getuserInfo.php',
    url: url + 'wxlogin/getuserInfo.php?which=getUserInfo',
    data: {
      code: code,
      encryptedData: encryptedData,
      iv: iv
    },
    success: res => {
      if (res.data) {
//        console.log(res)
        if (res.data == "-41001") {
          wx.showModal({
            title: '错误',
            content: '用户信息获取异常',
            showCancel:'false',

          })

        } else {
          console.log('set userData successed.')
          wx.setStorageSync('userId', res.data[0].userId)
          wx.setStorageSync('session_key', res.data[0].session_key)
          callback(res.data[0])
        }

      }

    },
    fail: res => {
      console.log(res)
    }
  })
}




module.exports = {
  formatTime: formatTime,
  httpRequire: httpRequire,
  myLogin: myLogin,
  getLoginInfo: getLoginInfo,
}
