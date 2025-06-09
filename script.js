// Fallback price (manually update this if API fails)
const FALLBACK_PRICE_PER_OZ = 30.50; // Example: $28.50/troy oz (update to today's price)

async function fetchSilverPrice() {
    const pricePerTroyOz = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/SI=F` // Replace AMZN with any ticker
  ); // Manually update this
    const pricePerGram = pricePerTroyOz / 31.1035;
    return { pricePerGram, pricePerTroyOz };
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
