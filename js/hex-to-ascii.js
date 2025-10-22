// Hex to ASCII Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");

    function convertHexToAscii() {
      const hex = inputText.value.replace(/\s+/g, '').replace(/0x/gi, '');
      
      if (!hex) {
        outputText.value = "";
        return;
      }

      // Validate hex input
      if (!/^[0-9A-Fa-f]*$/.test(hex)) {
        outputText.value = "Invalid hexadecimal input";
        return;
      }

      if (hex.length % 2 !== 0) {
        outputText.value = "Invalid hex length (must be even)";
        return;
      }

      let ascii = "";
      for (let i = 0; i < hex.length; i += 2) {
        const hexByte = hex.substr(i, 2);
        const charCode = parseInt(hexByte, 16);
        ascii += String.fromCharCode(charCode);
      }

      outputText.value = ascii;
    }

    // Auto-convert as user types
    if (inputText) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertHexToAscii, 300) : convertHexToAscii;
      inputText.addEventListener("input", debouncedConvert);
    }

    // Global functions for buttons
    window.convertHexToAscii = convertHexToAscii;

    window.copyOutput = () => {
      if (!outputText.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No output to copy");
        } else {
          alert("No output to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(outputText.value);
      } else {
        navigator.clipboard.writeText(outputText.value).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('ASCII output copied to clipboard!');
          } else {
            alert('ASCII output copied to clipboard!');
          }
        });
      }
    };

    window.clearAll = () => {
      inputText.value = "";
      outputText.value = "";
    };

    // Initial conversion
    convertHexToAscii();
  });
})();