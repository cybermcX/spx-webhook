// spxStrategy.js
const moment = require('moment-timezone');

function getCurrentTimeSlot() {
  const now = moment().tz('America/Los_Angeles');
  const hour = now.hour();
  const minute = now.minute();
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes < 390) return '开盘前（06:45 PST）';
  if (totalMinutes < 720) return '开盘时段（09:30 PST）';
  if (totalMinutes < 885) return '午盘时段（12:00 PST）';
  return '收盘前（15:45 PST）';
}

function generateStrategy() {
  const spxOpen = 5520;
  const spxNow = 5558;
  const vix = 13.8;
  const isPowellSpeaking = false;

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
    reason = `SPX 波动幅度仅 ${percentChange.toFixed(2)}%，暂无明确方向，建议观望。`;
  }

  if (vix > 20) {
    reason += `⚠ 当前 VIX 为 ${vix}，市场波动加剧，请控制仓位。`;
  }

  if (isPowellSpeaking) {
    reason += `📢 今天有美联储主席讲话，市场可能剧烈波动。`;
  }

  const timeSlot = getCurrentTimeSlot();

  return { suggestion, reason, timeSlot };
}

module.exports = generateStrategy;
