async function getSilverPrice() {
    const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
    const url = `https://metals-api.com/api/latest?base=USD&symbols=XAG&access_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.rates["XAG"]; // Silver price per gram
    } catch (error) {
        console.error("Error fetching silver price:", error);
        return 1.00; // Fallback price
    }
}

async function calculateSilverPrice() {
    const grams = document.getElementById("grams").value;
    if (grams <= 0) {
        alert("Please enter a valid amount of silver.");
        return;
    }

    const silverPricePerGram = await getSilverPrice();
    const totalPrice = (grams * silverPricePerGram).toFixed(2);

    document.getElementById("result").innerText = `Total Price: $${totalPrice}`;
}

// Automatically update silver price every minute
setInterval(async () => {
    const silverPricePerGram = await getSilverPrice();
    document.getElementById("result").innerText = `Current Silver Price: $${silverPricePerGram.toFixed(2)} per gram`;
}, 60000); // Updates every 60 seconds
