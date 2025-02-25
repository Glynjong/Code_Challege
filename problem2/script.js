// Crypto Price Data (replace this with live API call if needed)
const prices = {
    "BLUR": 0.20811525423728813,
    "bNEO": 7.1282679,
    "BUSD": 0.9998782611186441,
    "USD": 1,
    "ETH": 1645.9337373737374,
    "GMX": 36.345114372881355,
    "STEVMOS": 0.07276706779661017,
    "LUNA": 0.40955638983050846,
    "ATOM": 7.186657333333334,
    "USDC": 1,
    "WBTC": 26002.82202020202,
    "ZIL": 0.01651813559322034
  };
  
  // Populate the dropdowns with available currencies
  function populateDropdowns() {
    const selectElements = document.querySelectorAll(".currency-select");
    selectElements.forEach(select => {
      for (const currency in prices) {
        let option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        select.appendChild(option);
      }
    });
  }
  
  // Function to convert the input amount based on selected currencies
  function convertAmount() {
    const fromCurrency = document.getElementById("from-currency").value;
    const toCurrency = document.getElementById("to-currency").value;
    const inputAmount = parseFloat(document.getElementById("input-amount").value);
    const outputField = document.getElementById("output-amount");
  
    if (!prices[fromCurrency] || !prices[toCurrency] || isNaN(inputAmount) || inputAmount <= 0) {
      outputField.value = "Invalid input";
      return;
    }
  
    const convertedAmount = (inputAmount * prices[fromCurrency]) / prices[toCurrency];
    outputField.value = convertedAmount.toFixed(4);
  }
  
  // Swap the selected currencies
  function swapCurrencies() {
    const fromSelect = document.getElementById("from-currency");
    const toSelect = document.getElementById("to-currency");
  
    const tempValue = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tempValue;
  
    convertAmount();
  }
  
  // Handle form submission
  document.getElementById("swap-button").addEventListener("click", function () {
    alert("Swap Confirmed!");
  });
  
  // Event Listeners
  document.getElementById("input-amount").addEventListener("input", convertAmount);
  document.getElementById("from-currency").addEventListener("change", convertAmount);
  document.getElementById("to-currency").addEventListener("change", convertAmount);
  document.getElementById("swap-icon").addEventListener("click", swapCurrencies);
  
  // Initialize dropdowns
  populateDropdowns();
  