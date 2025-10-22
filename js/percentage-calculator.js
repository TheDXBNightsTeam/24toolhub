// Percentage Calculator Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const percent1 = document.getElementById("percent1");
    const number1 = document.getElementById("number1");
    const result1 = document.getElementById("result1");
    
    const number2 = document.getElementById("number2");
    const number3 = document.getElementById("number3");
    const result2 = document.getElementById("result2");
    
    const oldValue = document.getElementById("oldValue");
    const newValue = document.getElementById("newValue");
    const result3 = document.getElementById("result3");

    function calculatePercentages() {
      // What is X% of Y?
      if (percent1 && number1 && result1) {
        const percent = parseFloat(percent1.value);
        const num = parseFloat(number1.value);
        if (!isNaN(percent) && !isNaN(num)) {
          result1.value = ((percent / 100) * num).toFixed(2);
        }
      }

      // X is what % of Y?
      if (number2 && number3 && result2) {
        const num2 = parseFloat(number2.value);
        const num3 = parseFloat(number3.value);
        if (!isNaN(num2) && !isNaN(num3) && num3 !== 0) {
          result2.value = ((num2 / num3) * 100).toFixed(2);
        }
      }

      // Percentage Increase/Decrease
      if (oldValue && newValue && result3) {
        const old = parseFloat(oldValue.value);
        const newVal = parseFloat(newValue.value);
        if (!isNaN(old) && !isNaN(newVal) && old !== 0) {
          const change = ((newVal - old) / old) * 100;
          result3.value = change.toFixed(2);
        }
      }
    }

    // Auto-calculate as user types
    const debouncedCalculate = window.Utils ? window.Utils.debounce(calculatePercentages, 300) : calculatePercentages;

    if (percent1) percent1.addEventListener("input", debouncedCalculate);
    if (number1) number1.addEventListener("input", debouncedCalculate);
    if (number2) number2.addEventListener("input", debouncedCalculate);
    if (number3) number3.addEventListener("input", debouncedCalculate);
    if (oldValue) oldValue.addEventListener("input", debouncedCalculate);
    if (newValue) newValue.addEventListener("input", debouncedCalculate);

    // Global functions for buttons
    window.calculatePercentages = calculatePercentages;

    window.clearPercentages = () => {
      if (percent1) percent1.value = "";
      if (number1) number1.value = "";
      if (result1) result1.value = "";
      if (number2) number2.value = "";
      if (number3) number3.value = "";
      if (result2) result2.value = "";
      if (oldValue) oldValue.value = "";
      if (newValue) newValue.value = "";
      if (result3) result3.value = "";
    };

    window.copyResults = () => {
      let results = [];
      
      if (percent1 && number1 && result1 && percent1.value && number1.value && result1.value) {
        results.push(`${percent1.value}% of ${number1.value} = ${result1.value}`);
      }
      
      if (number2 && number3 && result2 && number2.value && number3.value && result2.value) {
        results.push(`${number2.value} is ${result2.value}% of ${number3.value}`);
      }
      
      if (oldValue && newValue && result3 && oldValue.value && newValue.value && result3.value) {
        const change = parseFloat(result3.value);
        const changeText = change >= 0 ? "increase" : "decrease";
        results.push(`From ${oldValue.value} to ${newValue.value} = ${Math.abs(change)}% ${changeText}`);
      }

      if (results.length === 0) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No results to copy");
        } else {
          alert("No results to copy");
        }
        return;
      }

      const resultText = results.join('\n');
      
      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(resultText);
      } else {
        navigator.clipboard.writeText(resultText).then(() => {
          alert('Percentage calculations copied to clipboard!');
        });
      }
    };

    // Initial calculation
    calculatePercentages();
  });
})();
