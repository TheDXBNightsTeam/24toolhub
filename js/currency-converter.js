// Currency Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const fromValue = document.getElementById("fromValue");
    const fromUnit = document.getElementById("fromUnit");
    const toValue = document.getElementById("toValue");
    const toUnit = document.getElementById("toUnit");

    // Approximate exchange rates (as of 2024 - for reference only)
    const exchangeRates = {
      'USD': 1.0,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110.0,
      'AUD': 1.35,
      'CAD': 1.25,
      'CHF': 0.92,
      'CNY': 6.45,
      'AED': 3.67,
      'SAR': 3.75,
      'EGP': 15.7,
      'JOD': 0.71,
      'KWD': 0.30,
      'QAR': 3.64,
      'BHD': 0.38
    };

    function convertCurrency() {
      const inputValue = parseFloat(fromValue.value);
      const fromCurrency = fromUnit.value;
      const toCurrency = toUnit.value;

      if (isNaN(inputValue)) {
        toValue.value = "";
        return;
      }

      // Convert to USD first, then to target currency
      const usdValue = inputValue / exchangeRates[fromCurrency];
      const result = usdValue * exchangeRates[toCurrency];

      // Format result based on currency
      let formattedResult;
      if (toCurrency === 'JPY' || toCurrency === 'KRW' || toCurrency === 'VND') {
        formattedResult = Math.round(result).toLocaleString();
      } else {
        formattedResult = result.toFixed(2);
      }

      toValue.value = formattedResult;
    }

    // Auto-convert on input change
    if (fromValue) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertCurrency, 300) : convertCurrency;
      fromValue.addEventListener("input", debouncedConvert);
    }

    if (fromUnit) {
      fromUnit.addEventListener("change", convertCurrency);
    }

    if (toUnit) {
      toUnit.addEventListener("change", convertCurrency);
    }

    // Global functions for buttons
    window.convertCurrency = convertCurrency;

    window.clearCurrency = () => {
      fromValue.value = "";
      toValue.value = "";
    };

    window.copyResult = () => {
      if (!toValue.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No result to copy");
        } else {
          alert("No result to copy");
        }
        return;
      }

      const fromCurrencyName = fromUnit.options[fromUnit.selectedIndex].text;
      const toCurrencyName = toUnit.options[toUnit.selectedIndex].text;
      const result = `${fromValue.value || '0'} ${fromCurrencyName} = ${toValue.value} ${toCurrencyName}`;
      
      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(result);
      } else {
        navigator.clipboard.writeText(result).then(() => {
          alert('Currency conversion copied to clipboard!');
        });
      }
    };

    // Initial conversion
    convertCurrency();
  });
})();