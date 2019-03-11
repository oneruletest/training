// register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    progress: false,
    userno: '',
    passwd: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  showTip: function (e) {
    console.log('showTip()~');
    var value = this.data.hidden;
    this.setData({
      hidden: !value
    })
  },
  //获取用户工号
  inputUserNo: function (e) {
    // console.log(e);
    this.setData({
      userno: e.detail.value
    })
  },

  //获取密码
  inputPasswd: function (e) {
    // console.log(e);
    this.setData({
      passwd: e.detail.value
    })
  },
  //注册用户
  register: function (e) {
    //show progress .
    this.setData({
      progress: true
    })

    var userNo = this.data.userno;
    var passwd = this.data.passwd;

    var param = {
      userId: userNo,
      password: passwd
    }

    console.log(param);

    //send post request .
    // 初始化云
    wx.cloud.init({
      env: 'book-management-7dcca1',
      traceUser: true
    });
    // 初始化数据库

    if (this.userNo != userNo) {
      const db = wx.cloud.database()
      db.collection('administrator').add(
        {
          data: {
            userNo: userNo,
            passwd: passwd
          },
          success: function (res) {
            console.log(res)
            console.log(res.errMsg);
            wx.showToast({
              title: '注册成功',
            })
            wx.switchTab({
              url: '../index/index',
            })
          }
        }

      )
    } else {
      wx.showToast({
        title: '用户注册失败,工号已存在',
        icon: 'none',
        duration: 2000
      })

    }
  }

})