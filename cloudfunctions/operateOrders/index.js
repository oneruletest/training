const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var action = event.action //0:借 1:还
  var openId = event.openId
  var isbn = event.isbn
  var time = formatTime(new Date());   
  // var time=new Date()
  try {
    await db.collection('orders').add({
      data: {
        action: action,
        openId: openId,
        isbn: isbn,
        time: time
      }
    })
    const _ = db.command
    if(action==0){
      await db.collection('Books').where({
        isbn: isbn
      }).update({
        data:{
          number:_.inc(-1)
        }
      })
    }else{
      await db.collection('Books').where({
        isbn: isbn
        }).update({
        data: {
        number: _.inc(1)
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}


function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
