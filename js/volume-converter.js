// Volume Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const fromValue = document.getElementById("fromValue");
    const fromUnit = document.getElementById("fromUnit");
    const toValue = document.getElementById("toValue");
    const toUnit = document.getElementById("toUnit");

    // Conversion factors to liters (base unit)
    const conversionFactors = {
      'milliliters': 0.001,
      'liters': 1,
      'gallons': 3.78541,
      'quarts': 0.946353,
      'pints': 0.473176,
      'cups': 0.236588,
      'fluid-ounces': 0.0295735,
      'cubic-meters': 1000,
      'cubic-centimeters': 0.001,
      'cubic-inches': 0.0163871,
      'cubic-feet': 28.3168
    };

    function convertToLiters(value, unit) {
      return value * conversionFactors[unit];
    }

    function convertFromLiters(value, unit) {
      return value / conversionFactors[unit];
    }

    function convertVolume() {
      const inputValue = parseFloat(fromValue.value);
      const fromUnitValue = fromUnit.value;
      const toUnitValue = toUnit.value;

      if (isNaN(inputValue)) {
        toValue.value = "";
        return;
      }

      // Convert to liters first, then to target unit
      const liters = convertToLiters(inputValue, fromUnitValue);
      const result = convertFromLiters(liters, toUnitValue);

      toValue.value = result.toFixed(6);
    }

    // Auto-convert on input change
    if (fromValue) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertVolume, 300) : convertVolume;
      fromValue.addEventListener("input", debouncedConvert);
    }

    if (fromUnit) {
      fromUnit.addEventListener("change", convertVolume);
    }

    if (toUnit) {
      toUnit.addEventListener("change", convertVolume);
    }

    // Global functions for buttons
    window.convertVolume = convertVolume;

    window.clearVolume = () => {
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
          alert('Volume conversion copied to clipboard!');
        });
      }
    };

    // Initial conversion
    convertVolume();
  });
})();
