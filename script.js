// Fallback price (manually update if API fails)
const FALLBACK_PRICE_PER_OZ = 28.50;

async function fetchSilverPrice() {
    try {
        // CoinGecko API (no CORS issues)
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=silver&vs_currencies=usd");
        const data = await response.json();
        
        // CoinGecko returns price per gram, convert to troy oz
        const pricePerGram = data.silver.usd;
        const pricePerTroyOz = pricePerGram * 31.1035;
        
        return {
            pricePerGram: pricePerGram,
            pricePerTroyOz: pricePerTroyOz,
            lastUpdated: new Date().toLocaleTimeString()
        };
    } catch (error) {
        console.log("API failed, using fallback price");
        return {
            pricePerGram: FALLBACK_PRICE_PER_OZ / 31.1035,
            pricePerTroyOz: FALLBACK_PRICE_PER_OZ,
            lastUpdated: "(fallback value)"
        };
    }
}

async function calculateValue() {
    const grams = parseFloat(document.getElementById("grams").value);
    const resultDiv = document.getElementById("result");
    const priceDiv = document.getElementById("price-info");

    if (!grams || grams <= 0) {
        resultDiv.innerHTML = "Please enter a valid amount";
        return;
    }

    resultDiv.innerHTML = "Calculating...";
    
    const { pricePerGram, pricePerTroyOz, lastUpdated } = await fetchSilverPrice();
    const value = (grams * pricePerGram).toFixed(2);
    
    resultDiv.innerHTML = `${grams}g silver = <strong>$${value}</strong>`;
    priceDiv.innerHTML = `
        Price: $${pricePerGram.toFixed(4)}/g ($${pricePerTroyOz.toFixed(2)}/oz)<br>
        <small>Last updated: ${lastUpdated}</small>
    `;
}

// Allow pressing Enter key
document.getElementById("grams").addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateValue();
});
