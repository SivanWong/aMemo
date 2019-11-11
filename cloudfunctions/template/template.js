// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');
const APPID = 'wx7be1661a81bde137';
const APPSECRET = '549610860142b0313f52738e0698bc89';

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event) => {
  let token = await getToken();
  const rp = options =>
    new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
    
  const addResult = await rp({
    json: true,
    method: 'POST',
    url: 'https://api.weixin.qq.com/cgi-bin/wxopen/template/add?access_token=' + token,
    body: {
      id: 'AT0845',
      keyword_id_list: [1, 2, 3]
    }
  })

  let addResBody = (typeof addResult.body === 'object') ? addResult.body : JSON.parse(result.body)

  const template_id = addResBody.template_id

  const sendResult = await rp({
    json: true,
    method: 'POST',
    url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token,
    body: {
      touser: event.openid,
      template_id: template_id,
      page: 'pages/today/today',
      form_id: event.formId,
      data: event.msgData
    }
  })

  const deleteRes = await rp({
    json: true,
    method: 'POST',
    url: 'https://api.weixin.qq.com/cgi-bin/wxopen/template/del?access_token=' + token,
    body: {
      template_id: template_id
    }
  })

  return sendResult;
}

async function getToken () {
  let result = await db.collection('access_token').doc('ACCESS_TOKEN').get();
  return result.data.token
}