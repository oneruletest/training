const app = getApp()
Page({
  data: {
    hidden: true,
    employeeId:"未填写",
    name:"未填写",
    openId:"",
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    borrowTips:"",
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  borrowBook: function () {
    var that = this;
    var isbn;
    var action=0
    wx.scanCode({
      success: (res) => {
        that.isbn=res.result
        //查询书名
        wx.cloud.callFunction({
          name: 'operateBooks',
          data: {
            isbn: that.isbn
          }, success: function (res) {
              if(res.result.data.length!=0){
              var book=res.result.data[0]
              wx.showModal({
                title: '确认',
                content: '确定借出：' + book.bookName,
                success: function (res) {
                  if (res.confirm) {
                    wx.cloud.callFunction({
                      name: 'operateOrders',
                      data: {
                        action: 0,
                        isbn: book.isbn,
                        openId: wx.getStorageSync("openId")
                      }, success: function (res) {
                        wx.showToast({
                          title: '成功借书',
                          icon: 'success',
                          duration: 2000
                        })},fail: function(res){
                          console.log(res)
                      }})

                  } else if (res.cancel) {
                    //取消借阅
                  }
                }
              })
            }else{
              wx.showToast({
                title: '书没有录入',
                icon: 'fail',
                duration: 2000
              })
            }

          }, fail: function (res) {
             console.log(res)
          }
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '扫描失败',
          icon: 'fail',
          duration: 2000
        })
      },

      complete: (res) => {

      }
    })
  },


  returnBook: function () {
    var that = this;
    var isbn;
    var action = 1
    wx.scanCode({
      success: (res) => {
        this.isbn = res.result
        that.setData({
          isbn: this.isbn
        })
        //查询书名
        wx.cloud.callFunction({
          name: 'operateBooks',
          data: {
            isbn: that.isbn
          }, success: function (res) {
            console.log(res)
            if (res.result.data.length != 0) {
              var book = res.result.data[0]
              wx.showModal({
                title: '确认',
                content: '确定还书：' + book.bookName,
                success: function (res) {
                  if (res.confirm) {
                    console.log()
                    wx.cloud.callFunction({
                      name: 'operateOrders',
                      data: {
                        action: 1,
                        isbn: book.isbn,
                        openId: wx.getStorageSync("openId")
                      }, success: function (res) {
                        wx.showToast({
                          title: '成功还书',
                          icon: 'success',
                          duration: 2000
                        })
                      }, fail: function (res) {
                        console.log(res)
                      }
                    })

                  } else if (res.cancel) {
                    //取消借阅
                  }
                }
              })
            } else {
              wx.showToast({
                title: '书没有录入',
                icon: 'fail',
                duration: 2000
              })
            }

          }, fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '扫描失败',
          icon: 'fail',
          duration: 2000
        })
      },

      complete: (res) => {

      }
    })
  },




  onLoad: function() {
    var that = this
    if(wx.getStorageSync("openId")=="")
    {
      console.log("进入获取")
      wx.cloud.callFunction({
        name: 'login',
        data: {
        }, success: function (res) {
          wx.setStorageSync("openId", res.result.event.userInfo.openId)
        
          console.log(wx.getStorageSync("openId"))
          //TODO 输入弹窗出来
          wx.cloud.callFunction({
            name: 'operateEmployees',
            data: {
              action: 1,
              openId: wx.getStorageSync("openId")
            }, success: function (res) {
              if (res.result.data.length == 0) {
                that.setData({
                  hidden:false
                })
              }else{
                //填写姓名
                that.setData({
                  name: res.result.data[0].name,
                  employeeId: res.result.data[0].employeeId
                })
              }
            }, fail: function (res) {
              console.log(res)
            }
          }) 
        }, fail: function (res) {
          return "fail"
        }
      })
    }else{
      wx.cloud.callFunction({
        name: 'operateEmployees',
        data: {
          action: 1,
          openId: wx.getStorageSync("openId")
        }, success: function (res) {
            that.setData({
              name: res.result.data[0].name,
              employeeId: res.result.data[0].employeeId
            })
            //加载姓名
        }, fail: function (res) {
          console.log(res)
        }
      }) 
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },


  //初次进入模态窗口提交个人信息事件
  confirm: function () {
    if(this.data.name==""||this.data.employeeId=="")
    {
      wx.showToast({
        title: '没有填写完',
      })
      return ;
    }
    //TODO插入employees 一条记录
    wx.cloud.callFunction({
      name: 'operateEmployees',
      data: {
        action:0,
        name: this.data.name,
        employeeId: this.data.employeeId,
        openId: wx.getStorageSync("openId")
      }, success: function (res) {
        console.log("success")
      },fail: function(res){
        console.log(res)
      }})
    this.setData({
      hidden: true
    });
  },


  //输入框信息同步函数
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  employeeIdInput: function (e) {
    this.setData({
      employeeId: e.detail.value
    })
  },
})
