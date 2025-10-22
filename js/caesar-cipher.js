// Caesar Cipher Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const shiftAmount = document.getElementById("shiftAmount");
    const outputSection = document.getElementById("outputSection");
    const outputText = document.getElementById("outputText");

    function caesarCipher(str, shift) {
      return str.replace(/[A-Za-z]/g, function(c) {
        const base = c < 'a' ? 65 : 97;
        return String.fromCharCode(
          ((c.charCodeAt(0) - base + shift) % 26) + base
        );
      });
    }

    function encodeCaesar() {
      const text = inputText.value;
      const shift = parseInt(shiftAmount.value);
      
      if (!text.trim()) {
        outputSection.style.display = "none";
        return;
      }

      if (isNaN(shift) || shift < 1 || shift > 25) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Please enter a valid shift amount (1-25)");
        } else {
          alert("Please enter a valid shift amount (1-25)");
        }
        return;
      }

      const encoded = caesarCipher(text, shift);
      outputText.textContent = encoded;
      outputSection.style.display = "block";
    }

    function decodeCaesar() {
      const text = inputText.value;
      const shift = parseInt(shiftAmount.value);
      
      if (!text.trim()) {
        outputSection.style.display = "none";
        return;
      }

      if (isNaN(shift) || shift < 1 || shift > 25) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Please enter a valid shift amount (1-25)");
        } else {
          alert("Please enter a valid shift amount (1-25)");
        }
        return;
      }

      const decoded = caesarCipher(text, -shift);
      outputText.textContent = decoded;
      outputSection.style.display = "block";
    }

    // Auto-encode on input change
    if (inputText) {
      const debouncedEncode = window.Utils ? window.Utils.debounce(encodeCaesar, 300) : encodeCaesar;
      inputText.addEventListener("input", debouncedEncode);
    }

    if (shiftAmount) {
      const debouncedEncode = window.Utils ? window.Utils.debounce(encodeCaesar, 300) : encodeCaesar;
      shiftAmount.addEventListener("input", debouncedEncode);
    }

    // Global functions for buttons
    window.encodeCaesar = encodeCaesar;
    window.decodeCaesar = decodeCaesar;

    window.clearCaesar = () => {
      inputText.value = "";
      shiftAmount.value = "3";
      outputSection.style.display = "none";
      outputText.textContent = "";
    };

    window.copyResult = () => {
      const result = outputText.textContent;
      if (!result) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No result to copy");
        } else {
          alert("No result to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(result);
      } else {
        navigator.clipboard.writeText(result).then(() => {
          alert('Caesar cipher result copied to clipboard!');
        });
      }
    };

    window.setShift = (shift) => {
      shiftAmount.value = shift;
      encodeCaesar();
    };

    // Initial encode
    encodeCaesar();
  });
})();
