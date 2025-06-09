// Current silver price (update this manually if needed)
const FALLBACK_PRICE_PER_OZ = 28.50; // Update this value occasionally

async function fetchSilverPrice() {
  // Try 3 different methods until one works
  try {
    // Method 1: CoinGecko API (usually works)
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=silver&vs_currencies=usd");
    const data = await response.json();
    if (data.silver?.usd) {
      const pricePerGram = data.silver.usd;
      return {
        pricePerGram: pricePerGram,
        pricePerTroyOz: pricePerGram * 31.1035,
        source: "Live (CoinGecko)"
      };
    }
  } catch (e) {}

  try {
    // Method 2: Metals-API (no key needed for silver)
    const response = await fetch("https://api.metals.live/v1/spot/silver");
    const data = await response.json();
    if (data.price) {
      return {
        pricePerGram: data.price / 31.1035,
        pricePerTroyOz: data.price,
        source: "Live (Metals-API)"
      };
    }
  } catch (e) {}

  // Method 3: Fallback (always works)
  return {
    pricePerGram: FALLBACK_PRICE_PER_OZ / 31.1035,
    pricePerTroyOz: FALLBACK_PRICE_PER_OZ,
    source: "Fallback (manual)"
  };
}

async function calculateValue() {
  const grams = parseFloat(document.getElementById("grams").value);
  const resultDiv = document.getElementById("result");
  const priceDiv = document.getElementById("price-info");

  if (!grams || grams <= 0) {
    resultDiv.innerHTML = "⚠ Please enter valid grams";
    return;
  }

  resultDiv.innerHTML = "🔄 Calculating...";
  
  try {
    const { pricePerGram, pricePerTroyOz, source } = await fetchSilverPrice();
    const value = (grams * pricePerGram).toFixed(2);
    
    resultDiv.innerHTML = `${grams}g silver = <strong>$${value}</strong>`;
    priceDiv.innerHTML = `
      Price: $${pricePerGram.toFixed(4)}/g ($${pricePerTroyOz.toFixed(2)}/oz)<br>
      <small>Source: ${source} | ${new Date().toLocaleTimeString()}</small>
    `;
  } catch (error) {
    resultDiv.innerHTML = "⚠ Network error - try again later";
    console.error("Calculation failed:", error);
  }
}

// Handle Enter key
document.getElementById("grams").addEventListener("keypress", (e) => {
  if (e.key === "Enter") calculateValue();
});
