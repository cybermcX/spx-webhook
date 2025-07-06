// spxStrategy.js
const moment = require('moment-timezone');

/**
 * 生成 SPX 策略建议
 * @param {Object} options - 参数对象
 * @param {number} options.spxOpen - 今日开盘价
 * @param {number} options.spxNow - 当前价格
 * @param {number} options.vix - 当前VIX指数
 * @param {boolean} options.isPowellSpeaking - 是否有美联储讲话
 * @param {string} [options.strategyType='basic'] - 策略类型（保守 conservative、激进 aggressive）
 * @returns {Object} 返回建议和理由
 */
function generateStrategy({
  spxOpen = 5520,
  spxNow = 5558,
  vix = 13.8,
  isPowellSpeaking = false,
  strategyType = 'basic'
}) {
  const timeNow = moment().tz('America/New_York').format('HH:mm');
  let suggestion = '';
  let reason = '';

  const change = spxNow - spxOpen;
  const percentChange = (change / spxOpen) * 100;

  if (percentChange > 0.3) {
    suggestion = '🔼 Buy Call（做多看涨期权）';
    reason = `SPX 当前上涨约 ${percentChange.toFixed(2)}%，市场表现强劲，考虑顺势做多。`;
  } else if (percentChange < -0.3) {
    suggestion = '🔽 Buy Put（做空看跌期权）';
    reason = `SPX 当前下跌约 ${percentChange.toFixed(2)}%，可考虑做空或买 Put。`;
  } else {
    suggestion = '⏸ Wait & See（暂不进场）';
    reason = `SPX 变动幅度 ${percentChange.toFixed(2)}%，暂无明确方向，建议观望。`;
  }

  // ⚠ 风险控制
  if (vix > 20) {
    reason += `⚠ 注意：VIX 当前为 ${vix}，市场波动较大，注意控制仓位。`;
  }

  if (isPowellSpeaking) {
    reason += `📢 注意：今天有美联储主席讲话，市场可能剧烈波动。`;
  }

  // ⏰ 时间判断提示（午后追涨预警）
  if (timeNow > '12:00' && suggestion.includes('Call')) {
    reason += `🌞 午后做多需留意回调风险。`;
  }

  // 🎯 策略扩展（预留）
  if (strategyType === 'aggressive') {
    reason += `🔥 当前为激进策略模式，可能更频繁交易，注意风控。`;
  }

  return { suggestion, reason };
}

module.exports = generateStrategy;
