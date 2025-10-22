// Time Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const fromValue = document.getElementById("fromValue");
    const fromUnit = document.getElementById("fromUnit");
    const toValue = document.getElementById("toValue");
    const toUnit = document.getElementById("toUnit");

    // Conversion factors to seconds (base unit)
    const conversionFactors = {
      'nanoseconds': 0.000000001,
      'microseconds': 0.000001,
      'milliseconds': 0.001,
      'seconds': 1,
      'minutes': 60,
      'hours': 3600,
      'days': 86400,
      'weeks': 604800,
      'months': 2629746, // Average month length
      'years': 31556952 // Average year length (including leap years)
    };

    function convertToSeconds(value, unit) {
      return value * conversionFactors[unit];
    }

    function convertFromSeconds(value, unit) {
      return value / conversionFactors[unit];
    }

    function convertTime() {
      const inputValue = parseFloat(fromValue.value);
      const fromUnitValue = fromUnit.value;
      const toUnitValue = toUnit.value;

      if (isNaN(inputValue)) {
        toValue.value = "";
        return;
      }

      // Convert to seconds first, then to target unit
      const seconds = convertToSeconds(inputValue, fromUnitValue);
      const result = convertFromSeconds(seconds, toUnitValue);

      toValue.value = result.toFixed(6);
    }

    // Auto-convert on input change
    if (fromValue) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertTime, 300) : convertTime;
      fromValue.addEventListener("input", debouncedConvert);
    }

    if (fromUnit) {
      fromUnit.addEventListener("change", convertTime);
    }

    if (toUnit) {
      toUnit.addEventListener("change", convertTime);
    }

    // Global functions for buttons
    window.convertTime = convertTime;

    window.clearTime = () => {
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
          alert('Time conversion copied to clipboard!');
        });
      }
    };

    // Initial conversion
    convertTime();
  });
})();
