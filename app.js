const apiKey = 'YOUR_FINANCIAL_API_KEY';
const apiUrl = 'https://api.marketstack.com/v1/';

const searchStock = async () => {
  const searchInput = document.getElementById('search-input').value.trim();
  if (searchInput === '') {
    alert('Please enter a stock symbol.');
    return;
  }

  try {
    const companyInfo = await fetchCompanyInfo(searchInput);
    const stockPrice = await fetchStockPrice(searchInput);
    const stockChart = await fetchStockChart(searchInput);
    const newsArticles = await fetchStockNews(searchInput);

    displayStockInfo(companyInfo, stockPrice, stockChart, newsArticles);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    alert('Error fetching stock data. Please try again later.');
  }
};

const fetchCompanyInfo = async (symbol) => {
  const response = await fetch(`${apiUrl}companies/${symbol}?access_key=${apiKey}`);
  const data = await response.json();
  return data;
};

const fetchStockPrice = async (symbol) => {
  const response = await fetch(`${apiUrl}eod/latest?access_key=${apiKey}&symbols=${symbol}`);
  const data = await response.json();
  return data.data[0].close;
};

const fetchStockChart = async (symbol) => {
  const response = await fetch(`${apiUrl}eod?access_key=${apiKey}&symbols=${symbol}&limit=30`);
  const data = await response.json();
  const dates = data.data.map(item => item.date);
  const prices = data.data.map(item => item.close);
  return { dates, prices };
};

const fetchStockNews = async (symbol) => {
  const response = await fetch(`${apiUrl}news?access_key=${apiKey}&symbols=${symbol}&limit=5`);
  const data = await response.json();
  return data.data;
};

const displayStockInfo = (companyInfo, stockPrice, stockChart, newsArticles) => {
  document.getElementById('company-name').textContent = companyInfo.name;
  document.getElementById('stock-price').textContent = `Price: $${stockPrice}`;
  
  const chartContainer = document.getElementById('stock-chart');
  chartContainer.innerHTML = `<img src="https://quickchart.io/chart?c={type:'line',data:{labels:${JSON.stringify(stockChart.dates)},datasets:[{label:'Price',data:${JSON.stringify(stockChart.prices)}}]}}">`;

  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = '';
  newsArticles.forEach(article => {
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');
    newsItem.innerHTML = `
      <a href="${article.url}" target="_blank">${article.title}</a>
      <p>${article.source} - ${new Date(article.published_at).toLocaleDateString()}</p>
    `;
    newsContainer.appendChild(newsItem);
  });
};
