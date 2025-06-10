async function getSilverPrice() {
    // Hardcoded silver price per gram (update dynamically if needed)
    return 1.16; // Example price in USD per gram
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
