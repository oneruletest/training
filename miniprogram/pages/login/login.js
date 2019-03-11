// login.js
Page({

  data: {
    hidden: false,
    userNo: '',
    passwd: '',
    auto: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name = wx.getStorageSync('userNo');
    var passwd = wx.getStorageSync('passwd');

    this.setData({
      userNo: name,
      passwd: passwd
    })

    //已经登录则自动登录
    if (name && passwd) {
      this.loginCodyy({});
    }
  },
  //获取用户名
  inputUserName: function (e) {
    // console.log(e);
    this.setData({
      userNo: e.detail.value
    })
  },

  //获取密码
  inputPasswd: function (e) {
    // console.log(e);
    this.setData({
      passwd: e.detail.value
    })
  },

  //捕获是否自动登录
  autoSave: function (e) {
    // console.log(e);
    this.setData({
      auto: e.detail.value
    })
  },
  register: function (e) {
    console.log(e);
    // console.log("e:" + JSON.stringify(e));
    var id = e.currentTarget.id;
    var url = "../register/register?id=" + id;
    console.log(url);
    wx.navigateTo({
      url: url,
    })
  },


  loginCodyy: function (e) {
    console.log('begin login ...');
    //show progress .
    this.setData({
      hidden: true
    })

    //send post request .
    var that = this;
    var userNo = that.data.userNo;
    var passwd = that.data.passwd;
    if (userNo.length != 0 && passwd.length != 0) {
      // 初始化云
      wx.cloud.init({
        env: 'book-management-7dcca1',
        traceUser: true
      });
      // 初始化数据库
      const db = wx.cloud.database();
      db.collection('administrator').get({
        success: function (res) {
          console.log(res.data);
          var userNoSet = [];
          var passwordSet = [];
          for (var i = 0; i < res.data.length; i++) {
            userNoSet.push(res.data[i].userNo);
            passwordSet.push(res.data[i].passwd);
          }
          // console.log("userNo:"+userNo)
          // console.log("userNoSet:"+userNoSet)
          if ((userNoSet.indexOf(userNo) >= 0) && (passwordSet.indexOf(passwd) >= 0)) {
            console.log("登录成功");
            // 保存工号和密码
            that.setData({
              userNo: res.data[0].userNo,
              passwd: res.data[0].passwd
            })
            wx.switchTab({
              url: '../index/index',
            })
          } else {
            wx.showToast({
              title: '用户名或密码错误',
              icon: 'none',
              duration: 2000
            })
          }

        },
        fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
      },
      )
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})