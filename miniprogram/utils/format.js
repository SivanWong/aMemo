// format.js

const formatDate = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  return year + '-' + month + '-' + day;
}

const formatTime = (time) => {
  let hour = time.getHours();
  let minute = time.getMinutes();

  return hour + ':' + minute;
}

module.exports = {
  formatDate: formatDate,
  formatTime: formatTime
}