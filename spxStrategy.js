// spxStrategy.js
const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-CA'); // 格式如 2025-07-04
};

const generateSPXStrategy = () => {
  const date = getTodayDate();

  // 以下是伪逻辑：未来我们可以改为接入数据分析
  const direction = Math.random() > 0.5 ? '看涨 ✅' : '看跌 🔻';
  const strike = direction.includes('涨') ? 5500 : 5450;
  const optionType = direction.includes('涨') ? 'Call' : 'Put';

  const suggestion = '买入 SPX 0DTE ${optionType}，行权价 ${strike}，止损 -20%，止盈 +40%';
  const reason = '随机模拟策略（下一步可接入 AI 判断）';

  return `📈 SPX 0DTE 策略通知（${date}）
方向：${direction}
建议：${suggestion}
依据：${reason}`;
};

module.exports = generateSPXStrategy;