// ASCII to Hex Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");

    function convertAsciiToHex() {
      const text = inputText.value;
      if (!text) {
        outputText.value = "";
        return;
      }

      let hex = "";
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        hex += charCode.toString(16).toUpperCase().padStart(2, '0');
      }

      outputText.value = hex;
    }

    // Auto-convert as user types
    if (inputText) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertAsciiToHex, 300) : convertAsciiToHex;
      inputText.addEventListener("input", debouncedConvert);
    }

    // Global functions for buttons
    window.convertAsciiToHex = convertAsciiToHex;

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
            window.Utils.showNotification('Hex output copied to clipboard!');
          } else {
            alert('Hex output copied to clipboard!');
          }
        });
      }
    };

    window.clearAll = () => {
      inputText.value = "";
      outputText.value = "";
    };

    // Initial conversion
    convertAsciiToHex();
  });
})();