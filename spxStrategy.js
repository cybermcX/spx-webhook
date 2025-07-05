// spxStrategy.js
const moment = require('moment-timezone');

function generateStrategy() {
  // 模拟数据：这些应该未来接入实际市场数据API，如Alpha Vantage、Polygon、Finnhub等
  const spxOpen = 5520;
  const spxNow = 5558;
  const vix = 13.8; // 恐慌指数
  const isPowellSpeaking = false; // 是否有重要美联储讲话
  const timeNow = moment().tz('America/New_York').format('HH:mm');

  let suggestion = '';
  let reason = '';

  // 趋势判断
  const change = spxNow - spxOpen;
  const percentChange = (change / spxOpen) * 100;

  if (percentChange > 0.3) {
    suggestion = '🔼 Buy Call（做多看涨期权）';
    reason = SPX当前上涨约 ${percentChange.toFixed(2)}%，市场表现强劲，考虑顺势做多。;
  } else if (percentChange < -0.3) {
    suggestion = '🔽 Buy Put（做空看跌期权）';
    reason = SPX当前下跌约 ${percentChange.toFixed(2)}%，可考虑做空或买Put。;
  } else {
    suggestion = '⏸ Wait & See（暂不进场）';
    reason = SPX变动幅度 ${percentChange.toFixed(2)}%，暂无明确方向，建议观望。;
  }

  // 风险调整
  if (vix > 20) {
    reason += ⚠ 注意：VIX当前为${vix}，市场波动较大，注意控制仓位。;
  }

  // 美联储讲话加一层条件
  if (isPowellSpeaking) {
    reason += 📢 注意：今天有美联储主席讲话，市场可能剧烈波动。;
  }

  // 时段提醒
  if (timeNow > '12:00' && suggestion.includes('Buy Call')) {
    reason += 🌞 午后做多需留意回调风险。;
  }

  return { suggestion, reason };
}

module.exports = generateStrategy;