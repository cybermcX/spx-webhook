const moment = require('moment-timezone');

function isMarketOpen() {
  const now = moment().tz('America/New_York');
  const day = now.day(); // 0 = Sunday, 6 = Saturday
  const hour = now.hour();

  // 周末关闭
  if (day === 0 || day === 6) return false;

  // 可选：更严格判断是否处于交易时间，例如早上9点半到下午4点
  // if (hour < 9 || hour >= 16) return false;

  return true;
}

module.exports = isMarketOpen;