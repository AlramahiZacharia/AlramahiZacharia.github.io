// Fallback prices (update these manually if needed)
const FALLBACK_PRICE_PER_OZ = 30.50;
const FALLBACK_PRICE_PER_GRAM = FALLBACK_PRICE_PER_OZ / 31.1035;

async function fetchSilverPrice() {
    try {
        // Use a CORS proxy
        const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Free public proxy
        const targetUrl = "https://query1.finance.yahoo.com/v8/finance/chart/SI=F";
        
        const response = await fetch(proxyUrl + targetUrl);
        const data = await response.json();
        
        // Extract price (Yahoo Finance format)
        const pricePerTroyOz = data.chart.result[0].meta.regularMarketPrice;
        const pricePerGram = pricePerTroyOz / 31.1035;
        
        return { pricePerGram, pricePerTroyOz };
    } catch (error) {
        console.error("API failed:", error);
        return {
            pricePerGram: FALLBACK_PRICE_PER_GRAM,
            pricePerTroyOz: FALLBACK_PRICE_PER_OZ
        };
    }
}

async function calculateValue() {
    const grams = parseFloat(document.getElementById("grams").value);
    const resultDiv = document.getElementById("result");
    const priceDiv = document.getElementById("price-per-gram");

    if (!grams || grams <= 0) {
        resultDiv.innerHTML = "⚠️ Please enter valid grams!";
        return;
    }

    try {
        const { pricePerGram, pricePerTroyOz } = await fetchSilverPrice();
        const totalValue = grams * pricePerGram;

        resultDiv.innerHTML = `
            ${grams} grams of silver = <strong>$${totalValue.toFixed(2)} USD</strong>
        `;
        priceDiv.innerHTML = `
            Price per gram: <strong>$${pricePerGram.toFixed(4)}</strong><br>
            Price per troy oz: <strong>$${pricePerTroyOz.toFixed(2)}</strong>
        `;
    } catch (error) {
        resultDiv.innerHTML = "Error fetching prices. Please try again later.";
        console.error("Calculation error:", error);
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded!");
    document.getElementById("grams").addEventListener("keypress", (e) => {
        if (e.key === "Enter") calculateValue();
    });
});
