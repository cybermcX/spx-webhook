const moment = require('moment-timezone');
const fetchMarketData = require('./fetchMarketData');

async function generateStrategy() {
  const data = await fetchMarketData();
  if (!data) {
    return {
      suggestion: '❌ 数据获取失败',
      reason: '无法获取 SPX 实时数据，请检查 API 配置或网络连接。'
    };
  }

  const { spxOpen, spxNow, vix, isPowellSpeaking } = data;
  const timeNow = moment().tz('America/New_York').format('HH:mm');

  let suggestion = '';
  let reason = '';

  // 趋势判断
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

  if (vix > 20) {
    reason += `⚠ 注意：VIX 当前为 ${vix}，市场波动较大，注意控制仓位。`;
  }

  if (isPowellSpeaking) {
    reason += `📢 注意：今天有美联储主席讲话，市场可能剧烈波动。`;
  }

  if (timeNow > '12:00' && suggestion.includes('Buy Call')) {
    reason += `🌞 午后做多需留意回调风险。`;
  }

  return { suggestion, reason };
}

module.exports = generateStrategy;
