const express = require('express');
const axios = require('axios');
const generateStrategy = require('./spxStrategy');

const app = express();
const PORT = process.env.PORT || 3000;

const webhookUrl = 'https://discord.com/api/webhooks/1390777914148126760/2adD9jhpnkqA_UmQde2o_xWREozPxkbYnrucktOkkHUXzOG-vIuq00neFkahywxlliy-';

app.get('/', (req, res) => {
  res.send('✅ SPX Webhook 服务运行中');
});

app.get('/trigger', async (req, res) => {
  const { suggestion, reason } = generateStrategy();
  const content = `📈 SPX 0DTE 策略通知：${suggestion}\n📌 理由：${reason}`;

  try {
    await axios.post(webhookUrl, { content });
    res.send('✅ 已成功发送到 Discord');
  } catch (err) {
    console.error('❌ 发送失败:', err.message);
    res.status(500).send('❌ 推送失败');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 服务器已启动，监听端口 ${PORT}`);
});