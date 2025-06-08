// Fallback price (manually update this if API fails)
const FALLBACK_PRICE_PER_OZ = 30.50; // Example: $28.50/troy oz (update to today's price)

async function fetchSilverPrice() {
    try {
        // API: CoinGecko (free, no API key needed)
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=silver&vs_currencies=usd");
        const data = await response.json();

        if (!data.silver || !data.silver.usd) {
            throw new Error("Invalid API response");
        }

        // CoinGecko returns price per gram, convert to troy oz
        const pricePerGram = data.silver.usd;
        const pricePerTroyOz = pricePerGram * 31.1035; // 1 troy oz = 31.1035g
        return { pricePerGram, pricePerTroyOz };

    } catch (error) {
        console.error("API Error:", error);
        // Use fallback price (manually updated)
        const pricePerGram = FALLBACK_PRICE_PER_OZ / 31.1035;
        return {
            pricePerGram: pricePerGram,
            pricePerTroyOz: FALLBACK_PRICE_PER_OZ
        };
    }
}

function calculateValue() {
    const grams = parseFloat(document.getElementById("grams").value);
    const resultDiv = document.getElementById("result");
    const priceDiv = document.getElementById("price-per-gram");

    if (!grams || grams <= 0) {
        resultDiv.innerHTML = "⚠️ Please enter valid grams!";
        return;
    }

    fetchSilverPrice().then(({ pricePerGram, pricePerTroyOz }) => {
        const totalValue = grams * pricePerGram;

        // Display results
        resultDiv.innerHTML = `
            ${grams} grams of silver = <strong>$${totalValue.toFixed(2)} USD</strong>
        `;
        priceDiv.innerHTML = `
            Price per gram: <strong>$${pricePerGram.toFixed(4)}</strong><br>
            Price per troy oz: <strong>$${pricePerTroyOz.toFixed(2)}</strong>
        `;
    });
}

// Debugging & extra features
console.log("Script loaded!"); // Check browser console
document.getElementById("grams").addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateValue();
});
