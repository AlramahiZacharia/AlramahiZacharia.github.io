// Current silver price (USD per troy ounce) - updated manually if API fails
const FALLBACK_PRICE_PER_OZ = 30.00; // Update this with today's price

async function fetchSilverPrice() {
    try {
        // API 1: Metals-API (requires free API key)
        // const apiKey = "YOUR_FREE_API_KEY"; // Get one: https://metals-api.com/
        // const response = await fetch(`https://metals-api.com/api/latest?access_key=${apiKey}&base=XAG&symbols=USD`);
        // const data = await response.json();
        // return data.rates.USD;

        // API 2: CoinGecko (no key, but less precise)
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=silver&vs_currencies=usd");
        const data = await response.json();
        return data.silver.usd * 31.1035; // Convert from per-gram to per-troy-oz

    } catch (error) {
        console.error("API failed, using fallback price:", error);
        return FALLBACK_PRICE_PER_OZ;
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

    fetchSilverPrice().then(pricePerOz => {
        // Calculate price per gram and total value
        const pricePerGram = pricePerOz / 31.1035;
        const totalValue = grams * pricePerGram;

        // Display results
        resultDiv.innerHTML = `
            ${grams} grams of silver = <strong>$${totalValue.toFixed(2)} USD</strong>
        `;
        priceDiv.innerHTML = `
            Current price: <strong>$${pricePerGram.toFixed(4)}/gram</strong><br>
            ($${pricePerOz.toFixed(2)} per troy ounce)
        `;
    });
}

// Debug
console.log("Script loaded!");
document.getElementById("grams").addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateValue();
});
