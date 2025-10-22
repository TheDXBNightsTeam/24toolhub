// Length Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const fromValue = document.getElementById("fromValue");
    const fromUnit = document.getElementById("fromUnit");
    const toValue = document.getElementById("toValue");
    const toUnit = document.getElementById("toUnit");

    // Conversion factors to meters
    const conversionFactors = {
      'millimeters': 0.001,
      'centimeters': 0.01,
      'meters': 1,
      'kilometers': 1000,
      'inches': 0.0254,
      'feet': 0.3048,
      'yards': 0.9144,
      'miles': 1609.34,
      'nautical-miles': 1852
    };

    function convertToMeters(value, unit) {
      return value * conversionFactors[unit];
    }

    function convertFromMeters(value, unit) {
      return value / conversionFactors[unit];
    }

    function convertLength() {
      const inputValue = parseFloat(fromValue.value);
      const fromUnitValue = fromUnit.value;
      const toUnitValue = toUnit.value;

      if (isNaN(inputValue)) {
        toValue.value = "";
        return;
      }

      // Convert to meters first, then to target unit
      const meters = convertToMeters(inputValue, fromUnitValue);
      const result = convertFromMeters(meters, toUnitValue);

      toValue.value = result.toFixed(6);
    }

    // Auto-convert on input change
    if (fromValue) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertLength, 300) : convertLength;
      fromValue.addEventListener("input", debouncedConvert);
    }

    if (fromUnit) {
      fromUnit.addEventListener("change", convertLength);
    }

    if (toUnit) {
      toUnit.addEventListener("change", convertLength);
    }

    // Global functions for buttons
    window.convertLength = convertLength;

    window.clearLength = () => {
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

      const result = `${fromValue.value || '0'} ${fromUnit.options[fromUnit.selectedIndex].text} = ${toValue.value} ${toUnit.options[toUnit.selectedIndex].text}`;
      
      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(result);
      } else {
        navigator.clipboard.writeText(result).then(() => {
          alert('Conversion result copied to clipboard!');
        });
      }
    };

    // Initial conversion
    convertLength();
  });
})();