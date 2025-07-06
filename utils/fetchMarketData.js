
const axios = require('axios');

const API_KEY = 'd1leki9r01qt4thfnqsgd1leki9r01qt4thfnqt0';

async function fetchMarketData() {
  try {
    const [spxRes, vixRes] = await Promise.all([
      axios.get(`https://finnhub.io/api/v1/quote?symbol=^GSPC&token=${API_KEY}`),
      axios.get(`https://finnhub.io/api/v1/quote?symbol=^VIX&token=${API_KEY}`)
    ]);

    return {
      spxOpen: spxRes.data.o,
      spxNow: spxRes.data.c,
      vix: vixRes.data.c
    };
  } catch (err) {
    console.error('❌ 获取市场数据失败:', err.message);
    return null;
  }
}

module.exports = fetchMarketData;
