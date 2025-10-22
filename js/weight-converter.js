// Weight Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const fromValue = document.getElementById("fromValue");
    const fromUnit = document.getElementById("fromUnit");
    const toValue = document.getElementById("toValue");
    const toUnit = document.getElementById("toUnit");

    // Conversion factors to grams (base unit)
    const conversionFactors = {
      'micrograms': 0.000001,
      'milligrams': 0.001,
      'grams': 1,
      'kilograms': 1000,
      'tons': 1000000,
      'ounces': 28.3495,
      'pounds': 453.592,
      'stones': 6350.29
    };

    function convertToGrams(value, unit) {
      return value * conversionFactors[unit];
    }

    function convertFromGrams(value, unit) {
      return value / conversionFactors[unit];
    }

    function convertWeight() {
      const inputValue = parseFloat(fromValue.value);
      const fromUnitValue = fromUnit.value;
      const toUnitValue = toUnit.value;

      if (isNaN(inputValue)) {
        toValue.value = "";
        return;
      }

      // Convert to grams first, then to target unit
      const grams = convertToGrams(inputValue, fromUnitValue);
      const result = convertFromGrams(grams, toUnitValue);

      toValue.value = result.toFixed(6);
    }

    // Auto-convert on input change
    if (fromValue) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertWeight, 300) : convertWeight;
      fromValue.addEventListener("input", debouncedConvert);
    }

    if (fromUnit) {
      fromUnit.addEventListener("change", convertWeight);
    }

    if (toUnit) {
      toUnit.addEventListener("change", convertWeight);
    }

    // Global functions for buttons
    window.convertWeight = convertWeight;

    window.clearWeight = () => {
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

      const fromUnitName = fromUnit.options[fromUnit.selectedIndex].text;
      const toUnitName = toUnit.options[toUnit.selectedIndex].text;
      const result = `${fromValue.value || '0'} ${fromUnitName} = ${toValue.value} ${toUnitName}`;
      
      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(result);
      } else {
        navigator.clipboard.writeText(result).then(() => {
          alert('Weight conversion copied to clipboard!');
        });
      }
    };

    // Initial conversion
    convertWeight();
  });
})();
