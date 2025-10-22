// ROT13 Cipher Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const outputSection = document.getElementById("outputSection");
    const outputText = document.getElementById("outputText");

    function rot13(str) {
      return str.replace(/[A-Za-z]/g, function(c) {
        return String.fromCharCode(
          c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13)
        );
      });
    }

    function encodeROT13() {
      const text = inputText.value;
      
      if (!text.trim()) {
        outputSection.style.display = "none";
        return;
      }

      const encoded = rot13(text);
      outputText.textContent = encoded;
      outputSection.style.display = "block";
    }

    function decodeROT13() {
      const text = inputText.value;
      
      if (!text.trim()) {
        outputSection.style.display = "none";
        return;
      }

      const decoded = rot13(text);
      outputText.textContent = decoded;
      outputSection.style.display = "block";
    }

    // Auto-encode/decode on input change
    if (inputText) {
      const debouncedEncode = window.Utils ? window.Utils.debounce(encodeROT13, 300) : encodeROT13;
      inputText.addEventListener("input", debouncedEncode);
    }

    // Global functions for buttons
    window.encodeROT13 = encodeROT13;
    window.decodeROT13 = decodeROT13;

    window.clearROT13 = () => {
      inputText.value = "";
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
          alert('ROT13 result copied to clipboard!');
        });
      }
    };

    // Initial encode
    encodeROT13();
  });
})();
