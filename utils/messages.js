const moment = require('moment')
moment.locale('ru')

function formatMessage(username, text, img) {
  return {
    username,
    text,
    time: moment().format('LT'),
    img
  }
}

module.exports = {
  formatMessage
}