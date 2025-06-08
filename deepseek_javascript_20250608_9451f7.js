// Fetch current silver price (USD per troy ounce) from a free API
async function fetchSilverPrice() {
    try {
        const response = await fetch("https://api.metals.live/v1/spot/silver");
        const data = await response.json();
        return data.price; // Returns price per troy ounce
    } catch (error) {
        console.error("Failed to fetch silver price:", error);
        return 23.00; // Fallback price (replace with current manual value if API fails)
    }
}

// Convert grams to troy ounces (1 troy ounce = 31.1035 grams)
function gramsToTroyOunces(grams) {
    return grams / 31.1035;
}

// Calculate the total value
async function calculateValue() {
    const grams = parseFloat(document.getElementById("grams").value);
    if (isNaN(grams) || grams <= 0) {
        document.getElementById("result").innerHTML = "Please enter a valid number!";
        return;
    }

    const pricePerOz = await fetchSilverPrice();
    const troyOunces = gramsToTroyOunces(grams);
    const totalValue = (troyOunces * pricePerOz).toFixed(2);

    document.getElementById("result").innerHTML = 
        `${grams} grams of silver ≈ <strong>$${totalValue} USD</strong>`;
    document.getElementById("price-per-gram").innerHTML = 
        `Current price: $${(pricePerOz / 31.1035).toFixed(4)} per gram`;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    calculateValue(); // Optional: Display price on load
});