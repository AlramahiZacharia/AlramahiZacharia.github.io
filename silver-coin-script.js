function calculateCoins() {
    const ounces = parseFloat(document.getElementById("ounces").value);
    
    if (isNaN(ounces) {
        alert("Please enter a valid amount of silver.");
        return;
    }
    
    // Calculate number of each coin type
    document.getElementById("morgan").textContent = Math.floor(ounces / 0.7734);
    document.getElementById("peace").textContent = Math.floor(ounces / 0.7734);
    document.getElementById("walking").textContent = Math.floor(ounces / 0.3617);
    document.getElementById("franklin").textContent = Math.floor(ounces / 0.3617);
    document.getElementById("kennedy64").textContent = Math.floor(ounces / 0.3617);
    document.getElementById("kennedy65").textContent = Math.floor(ounces / 0.1479);
    document.getElementById("washington").textContent = Math.floor(ounces / 0.1808);
    document.getElementById("roosevelt").textContent = Math.floor(ounces / 0.0723);
    document.getElementById("mercury").textContent = Math.floor(ounces / 0.0723);
    document.getElementById("barber").textContent = Math.floor(ounces / 0.1808); // Using quarter as average
}
