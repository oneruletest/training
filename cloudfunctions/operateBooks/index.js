// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Books').where({
      isbn: event.isbn // 填入当前用户 openid
    }).get({
      success(res) {
       return res
      }
    })
  } catch (e) {
    console.error(e);
  }
}