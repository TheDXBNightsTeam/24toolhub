// URL Encoder Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const modeRadios = document.querySelectorAll('input[name="mode"]');

    function updateMode() {
      const selectedMode = document.querySelector('input[name="mode"]:checked').value;
      const inputLabel = document.querySelector('label[for="inputText"]');
      const outputLabel = document.querySelector('label[for="outputText"]');
      
      if (selectedMode === 'encode') {
        inputLabel.textContent = 'Input Text:';
        outputLabel.textContent = 'Encoded Output:';
        inputText.placeholder = 'Enter text to encode...';
        outputText.placeholder = 'Encoded text will appear here...';
      } else {
        inputLabel.textContent = 'Encoded Text:';
        outputLabel.textContent = 'Decoded Output:';
        inputText.placeholder = 'Enter encoded text to decode...';
        outputText.placeholder = 'Decoded text will appear here...';
      }
      
      processText();
    }

    function processText() {
      const text = inputText.value;
      const selectedMode = document.querySelector('input[name="mode"]:checked').value;
      
      if (!text) {
        outputText.value = "";
        return;
      }

      try {
        if (selectedMode === 'encode') {
          outputText.value = encodeURIComponent(text);
        } else {
          outputText.value = decodeURIComponent(text);
        }
      } catch (error) {
        outputText.value = "Error: Invalid encoded text";
      }
    }

    // Auto-process as user types
    if (inputText) {
      const debouncedProcess = window.Utils ? window.Utils.debounce(processText, 300) : processText;
      inputText.addEventListener("input", debouncedProcess);
    }

    // Update mode when radio buttons change
    modeRadios.forEach(radio => {
      radio.addEventListener("change", updateMode);
    });

    // Global functions for buttons
    window.updateMode = updateMode;
    window.processText = processText;

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
            window.Utils.showNotification('Output copied to clipboard!');
          } else {
            alert('Output copied to clipboard!');
          }
        });
      }
    };

    window.clearAll = () => {
      inputText.value = "";
      outputText.value = "";
    };

    // Initial processing
    processText();
  });
})();
