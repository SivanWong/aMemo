// 云函数入口文件
const cloud = require('wx-server-sdk')
const template = require('./template.js');

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const params = await getDate();
  const taskRes = await db.collection('event').where(params).get();
  const task = taskRes.data[0];
  const update = await db.collection('event').where(params).update({
    data: {
      sign: 'warn'
    }
  })

  if(task) {
    const date = task.date.split('-');
    const time = date[0] + '年' + date[1] + '月' + date[2] + '日 ' + task.time;
    let data = {
      openid: task._openid,
      formId: task.formId,
      msgData: {
        keyword1: {
          value: task.title,
        },
        keyword2: {
          value: time,
        },
        keyword3: {
          value: task.details,
        }
      }
    }
    const res = await template.main(data);
    return res;
  }

}

function getDate() {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();
  let hour = today.getHours() + 8;
  let minute = today.getMinutes();
  return {
    date: year + '-' + month + '-' + date,
    remind: hour + ':' + minute
  }
}

