// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const APPID = 'wx7be1661a81bde137';
const APPSECRET = '549610860142b0313f52738e0698bc89';

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const rp = options =>
      new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) {
            reject(error);
          }
          resolve(response);
        });
      });

    const result = await rp({
      url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET,
      method: 'GET'
    })
    let body = (typeof result.body === 'object') ? result.body : JSON.parse(result.body);

    await db.collection('access_token').doc('ACCESS_TOKEN').update({
      data: {
        token: body.access_token
      }
    })

    await db.collection('access_token').doc('ACCESS_TOKEN').update({
      data: {
        expires: new Date().getTime() + body.expires_in
      }
    })

    return body;

  } catch (e) {
    console.error(e)
  }
}
