// MD5 Hash Generator Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");

    function generateMD5() {
      const text = inputText.value;
      if (!text) {
        outputText.value = "";
        return;
      }

      const hash = window.simpleMD5 ? window.simpleMD5(text) : "MD5 function not available";
      outputText.value = hash;
    }

    // Auto-generate hash as user types
    if (inputText) {
      const debouncedGenerate = window.Utils ? window.Utils.debounce(generateMD5, 300) : generateMD5;
      inputText.addEventListener("input", debouncedGenerate);
    }

    // Global functions for buttons
    window.generateMD5 = generateMD5;

    window.copyHash = () => {
      if (!outputText.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No hash to copy");
        } else {
          alert("No hash to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(outputText.value);
      } else {
        navigator.clipboard.writeText(outputText.value).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('MD5 hash copied to clipboard!');
          } else {
            alert('MD5 hash copied to clipboard!');
          }
        });
      }
    };

    window.clearAll = () => {
      inputText.value = "";
      outputText.value = "";
    };

    // Generate initial hash if there's text
    generateMD5();
  });
})();
