// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let params = await getDate();
  await db.collection('date').where(params).remove();
  let res = await db.collection('event').where(params).remove();
  return res;
}

function getDate() {
  let today = new Date(new Date().getTime() - 7*24*60*60*1000);
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();
  return {
    date: year + '-' + month + '-' + date,
  }
}