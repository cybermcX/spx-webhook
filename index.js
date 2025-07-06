const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const generateStrategy = require('./spxStrategy');
const isMarketOpen = require('./utils/isMarketOpen');

const app = express();
const PORT = process.env.PORT || 3000;

// 測試根路由
app.get('/', (req, res) => {
  res.send('✅ SPX Webhook Server is running.');
});

// Discord webhook（請自行更新成你的最新網址）
const webhookUrl = 'https://discord.com/api/webhooks/1391536828863090871/OGXVInFJ8NfEHNouBCsGI3cQWthqQKwt8P_kU_LvHgwRom7009jNLH43Pa2M9_vYIW2-';

// ✅ 寫入日誌文件
function writeLogToFile(content) {
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const logFile = path.join(logsDir, `spx-${dateStr}.txt`);
  const timeStr = new Date().toISOString();
  const logContent = `[${timeStr}]\n${content}\n\n`;

  fs.appendFile(logFile, logContent, (err) => {
    if (err) console.error('❌ 寫入日誌失敗:', err);
    else console.log('📝 策略已寫入日誌:', logFile);
  });
}

// /trigger 路由
app.get('/trigger', async (req, res) => {
  if (!isMarketOpen()) {
    const msg = "📅 今天美股休市，不发送策略。";
    console.log(msg);
    return res.send(msg);
  }

  try {
    const { suggestion, reason } = await generateStrategy();
    const content = `📊 SPX 策略推送：${suggestion}\n📌 理由：${reason}`;

    await axios.post(webhookUrl, { content });
    writeLogToFile(content);

    res.send('✅ 策略已成功推送到 Discord 並寫入日誌');
  } catch (err) {
    console.error('❌ 推送失敗:', err.message);
    res.status(500).send('❌ 策略推送出錯');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 伺服器已啟動，監聽端口 ${PORT}`);
});
