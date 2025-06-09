// 1. CONFIGURATION (update these as needed)
const FALLBACK_PRICE_PER_OZ = 28.50; // Manual fallback (update weekly)
const CACHE_MINUTES = 15; // How long to cache prices

// 2. Main Price Fetching Function
async function getSilverPrice() {
  // Try cached price first
  const cached = getCachedPrice();
  if (cached) return cached;

  // Try MetalPriceAPI (most reliable free tier)
  try {
    const response = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=silver&base=XAG&currencies=USD');
    const data = await response.json();
    
    if (data.rates?.USD) {
      const pricePerOz = 1 / data.rates.USD; // Their API returns USD per XAG
      cachePrice(pricePerOz);
      return pricePerOz;
    }
  } catch (error) {
    console.log("API failed, trying fallback...");
  }

  // Final fallback
  return FALLBACK_PRICE_PER_OZ;
}

// 3. Cache Helpers (stores prices in browser)
function getCachedPrice() {
  const cache = localStorage.getItem('silverPrice');
  if (!cache) return null;
  
  const { price, timestamp } = JSON.parse(cache);
  const ageMinutes = (Date.now() - timestamp) / 60000;
  
  return ageMinutes < CACHE_MINUTES ? price : null;
}

function cachePrice(price) {
  localStorage.setItem('silverPrice', JSON.stringify({
    price: price,
    timestamp: Date.now()
  }));
}

// 4. Calculation Function
async function calculateValue() {
  const grams = parseFloat(document.getElementById('grams').value);
  const resultDiv = document.getElementById('result');
  const priceDiv = document.getElementById('price-info');

  if (!grams || grams <= 0) {
    resultDiv.innerHTML = '⚠ Please enter valid grams';
    return;
  }

  resultDiv.innerHTML = '🔄 Calculating...';
  
  const pricePerOz = await getSilverPrice();
  const pricePerGram = pricePerOz / 31.1035;
  const value = (grams * pricePerGram).toFixed(2);

  resultDiv.innerHTML = `${grams}g silver = <strong>$${value}</strong>`;
  priceDiv.innerHTML = `
    Rate: $${pricePerGram.toFixed(4)}/g ($${pricePerOz.toFixed(2)}/oz)<br>
    <small>${pricePerOz === FALLBACK_PRICE_PER_OZ ? 'Fallback price' : 'Live price'} • Updated: ${new Date().toLocaleTimeString()}</small>
  `;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('grams').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateValue();
  });
});
