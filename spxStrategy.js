const moment = require('moment-timezone');
const getMarketData = require('./utils/fetchMarketData');
const getOptionsData = require('./utils/getOptionsData');

function getTimeSlot() {
  const now = moment().tz('America/New_York');
  const hour = now.hour();
  const minute = now.minute();
  const timeStr = now.format('HH:mm');

  if (hour < 10 || (hour === 9 && minute <= 45)) return '🟢 開盤時段';
  if (hour < 12) return '🟡 早盤時段';
  if (hour < 15) return '🟠 午盤時段';
  return '🔴 收盤時段';
}

async function generateStrategy() {
  const marketData = await getMarketData();
  const optionsData = await getOptionsData();

  if (!marketData || !optionsData) {
    return {
      suggestion: '⚠️ 資料錯誤',
      reason: '無法取得市場或期權資料，請稍後再試。',
    };
  }

  const { spxOpen, spxNow, vix } = marketData;
  const change = spxNow - spxOpen;
  const percentChange = (change / spxOpen) * 100;
  const timeSlot = getTimeSlot();

  let suggestion = '';
  let reason = `⏰ 當前時段：${timeSlot}\n📉 SPX 開盤 ${spxOpen}，現價 ${spxNow}，變化率 ${percentChange.toFixed(2)}%\n`;

  // 趨勢判斷
  if (percentChange > 0.3) {
    suggestion = '🔼 Buy Call（做多）';
    reason += 'SPX 上漲明顯，建議順勢做多。\n';
  } else if (percentChange < -0.3) {
    suggestion = '🔽 Buy Put（做空）';
    reason += 'SPX 下跌明顯，建議順勢做空。\n';
  } else {
    suggestion = '⏸ 觀望';
    reason += 'SPX 盤整無方向，建議觀望。\n';
  }

  // VIX 提醒
  if (vix > 20) {
    reason += `⚠️ VIX 為 ${vix}，波動風險大，注意控制倉位。\n`;
  }

  // 期權資料分析
  const topCall = optionsData.calls[0];
  const topPut = optionsData.puts[0];
  if (topCall && topPut) {
    reason += `\n🧠 選擇權參考：\n`;
    reason += `📈 Call: Strike ${topCall.strike}, Vol ${topCall.volume}, IV ${(topCall.iv * 100).toFixed(1)}%\n`;
    reason += `📉 Put: Strike ${topPut.strike}, Vol ${topPut.volume}, IV ${(topPut.iv * 100).toFixed(1)}%\n`;

    // 附加條件範例：IV 超過 30%、成交量大於 5000
    if (topCall.iv > 0.3 && topCall.volume > 5000) {
      reason += '💡 高IV且活躍的Call，可作多參考。\n';
    }
    if (topPut.iv > 0.3 && topPut.volume > 5000) {
      reason += '💡 高IV且活躍的Put，可作空參考。\n';
    }
  }

  return { suggestion, reason };
}

module.exports = generateStrategy;
