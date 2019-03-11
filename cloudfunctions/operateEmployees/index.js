const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var action=event.action
  switch(action){
    //插入
    case 0:
      var name = event.name
      var employeeId= event.employeeId
      var openId=event.openId
      try {
        return await db.collection('employees').add({
          data: {
            name: name,
            employeeId: employeeId,
            openId: openId
          }
        })
      } catch (e) {
        console.log(e)
      }
      break;
    //查询是否存在
    case 1:
      try {
      var openId = event.openId
      return await  db.collection('employees').where({
        openId:openId
      }).get({
        success(res) {
          return res
        },
        fail(res){
          return res
        }
      })
      } catch (e) {
        console.log(e)
      }
      break;
    //用户更新姓名和工号

    case 2:
      break;
  }
}