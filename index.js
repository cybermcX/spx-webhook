const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const generateStrategy = require('./spxStrategy');
const isMarketOpen = require('./utils/isMarketOpen');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ SPX Webhook Server is running.');
});

const webhookUrl = 'https://discord.com/api/webhooks/1390777914148126760/2adD9jhpnkqA_UmQde2o_xWREozPxkbYnrucktOkkHUXzOG-vIuq00neFkahywxlliy-';

// ✅ 日志写入函数
function writeLogToFile(content) {
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const logFile = path.join(logsDir, `spx-${dateStr}.txt`);
  const timeStr = new Date().toISOString();
  const logContent = `[${timeStr}]\n${content}\n\n`;

  fs.appendFile(logFile, logContent, (err) => {
    if (err) {
      console.error('❌ 写入日志失败:', err);
    } else {
      console.log('📝 策略已写入日志:', logFile);
    }
  });
}

app.get('/trigger', async (req, res) => {
  if (!isMarketOpen()) {
    const msg = "📅 今天美股休市，不发送策略。";
    console.log(msg);
    res.send(msg);
    return;
  }

  // ✅ 模拟调用新版 generateStrategy 函数（未来可接入真实数据）
  const { suggestion, reason } = generateStrategy({
    spxOpen: 5520,
    spxNow: 5558,
    vix: 13.8,
    isPowellSpeaking: false,
    strategyType: 'basic' // 可切换为 'aggressive'
  });

  const content = `📈 SPX 0DTE 策略通知：${suggestion}\n📌 理由：${reason}`;

  try {
    await axios.post(webhookUrl, { content });

    writeLogToFile(content); // ✅ 写入日志
    res.send('✅ 已成功发送到 Discord 并记录日志');
  } catch (err) {
    console.error('❌ 推送失败:', err.message);
    res.status(500).send('❌ 推送失败');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 服务器已启动，监听端口 ${PORT}`);
});
