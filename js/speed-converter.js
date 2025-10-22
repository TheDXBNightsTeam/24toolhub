// Speed Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const fromValue = document.getElementById("fromValue");
    const fromUnit = document.getElementById("fromUnit");
    const toValue = document.getElementById("toValue");
    const toUnit = document.getElementById("toUnit");

    // Conversion factors to km/h (base unit)
    const conversionFactors = {
      'kmh': 1,
      'mph': 1.60934,
      'ms': 3.6,
      'knots': 1.852,
      'fps': 1.09728,
      'fpm': 0.018288,
      'mach': 1234.8, // at sea level
      'c': 1079252848.8
    };

    function convertToKmh(value, unit) {
      return value * conversionFactors[unit];
    }

    function convertFromKmh(value, unit) {
      return value / conversionFactors[unit];
    }

    function convertSpeed() {
      const inputValue = parseFloat(fromValue.value);
      const fromUnitValue = fromUnit.value;
      const toUnitValue = toUnit.value;

      if (isNaN(inputValue)) {
        toValue.value = "";
        return;
      }

      // Convert to km/h first, then to target unit
      const kmh = convertToKmh(inputValue, fromUnitValue);
      const result = convertFromKmh(kmh, toUnitValue);

      toValue.value = result.toFixed(6);
    }

    // Auto-convert on input change
    if (fromValue) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertSpeed, 300) : convertSpeed;
      fromValue.addEventListener("input", debouncedConvert);
    }

    if (fromUnit) {
      fromUnit.addEventListener("change", convertSpeed);
    }

    if (toUnit) {
      toUnit.addEventListener("change", convertSpeed);
    }

    // Global functions for buttons
    window.convertSpeed = convertSpeed;

    window.clearSpeed = () => {
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
          alert('Speed conversion copied to clipboard!');
        });
      }
    };

    // Initial conversion
    convertSpeed();
  });
})();
