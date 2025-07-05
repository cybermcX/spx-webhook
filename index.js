
const axios = require('axios');
const generateSPXStrategy = require('./spxStrategy');

const webhookUrl = '你的 Discord Webhook 地址';

const message = generateSPXStrategy(); // 动态生成策略内容

axios.post(webhookUrl, {
  content: message
}).then(() => {
  console.log('✅ 已成功发送 SPX 策略到 Discord');
}).catch((err) => {
  console.error('❌ 发送失败:', err.message);
});