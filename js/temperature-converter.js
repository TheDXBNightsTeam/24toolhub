// Temperature Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const celsiusInput = document.getElementById("celsius");
    const fahrenheitInput = document.getElementById("fahrenheit");
    const kelvinInput = document.getElementById("kelvin");

    let isUpdating = false;

    function celsiusToFahrenheit(celsius) {
      return (celsius * 9 / 5) + 32;
    }

    function celsiusToKelvin(celsius) {
      return celsius + 273.15;
    }

    function fahrenheitToCelsius(fahrenheit) {
      return (fahrenheit - 32) * 5 / 9;
    }

    function kelvinToCelsius(kelvin) {
      return kelvin - 273.15;
    }

    function updateAllTemperatures(sourceInput) {
      if (isUpdating) return;
      isUpdating = true;

      const value = parseFloat(sourceInput.value);
      
      if (isNaN(value)) {
        isUpdating = false;
        return;
      }

      let celsius, fahrenheit, kelvin;

      if (sourceInput === celsiusInput) {
        celsius = value;
        fahrenheit = celsiusToFahrenheit(celsius);
        kelvin = celsiusToKelvin(celsius);
      } else if (sourceInput === fahrenheitInput) {
        fahrenheit = value;
        celsius = fahrenheitToCelsius(fahrenheit);
        kelvin = celsiusToKelvin(celsius);
      } else if (sourceInput === kelvinInput) {
        kelvin = value;
        celsius = kelvinToCelsius(kelvin);
        fahrenheit = celsiusToFahrenheit(celsius);
      }

      // Update other inputs
      if (sourceInput !== celsiusInput) {
        celsiusInput.value = celsius.toFixed(2);
      }
      if (sourceInput !== fahrenheitInput) {
        fahrenheitInput.value = fahrenheit.toFixed(2);
      }
      if (sourceInput !== kelvinInput) {
        kelvinInput.value = kelvin.toFixed(2);
      }

      isUpdating = false;
    }

    // Add event listeners
    if (celsiusInput) {
      const debouncedUpdate = window.Utils ? window.Utils.debounce(() => updateAllTemperatures(celsiusInput), 300) : () => updateAllTemperatures(celsiusInput);
      celsiusInput.addEventListener("input", debouncedUpdate);
    }

    if (fahrenheitInput) {
      const debouncedUpdate = window.Utils ? window.Utils.debounce(() => updateAllTemperatures(fahrenheitInput), 300) : () => updateAllTemperatures(fahrenheitInput);
      fahrenheitInput.addEventListener("input", debouncedUpdate);
    }

    if (kelvinInput) {
      const debouncedUpdate = window.Utils ? window.Utils.debounce(() => updateAllTemperatures(kelvinInput), 300) : () => updateAllTemperatures(kelvinInput);
      kelvinInput.addEventListener("input", debouncedUpdate);
    }

    // Global functions for buttons
    window.clearTemperature = () => {
      celsiusInput.value = "";
      fahrenheitInput.value = "";
      kelvinInput.value = "";
    };

    window.copyResults = () => {
      const results = `Celsius: ${celsiusInput.value || '0'}°C\nFahrenheit: ${fahrenheitInput.value || '32'}°F\nKelvin: ${kelvinInput.value || '273.15'}K`;
      
      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(results);
      } else {
        navigator.clipboard.writeText(results).then(() => {
          alert('Temperature values copied to clipboard!');
        });
      }
    };
  });
})();
