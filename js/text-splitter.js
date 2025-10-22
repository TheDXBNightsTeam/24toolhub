// Text Splitter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const delimiter = document.getElementById("delimiter");
    const customDelimiter = document.getElementById("customDelimiter");
    const customDelimiterGroup = document.getElementById("customDelimiterGroup");
    const outputText = document.getElementById("outputText");
    const partCount = document.getElementById("partCount");

    if (delimiter && customDelimiterGroup) {
      delimiter.addEventListener("change", () => {
        customDelimiterGroup.style.display = delimiter.value === "custom" ? "block" : "none";
      });
    }

    function splitText() {
      const text = inputText.value;
      if (!text) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Please enter some text first");
        } else {
          alert("Please enter some text first");
        }
        return;
      }

      let sep;
      switch (delimiter.value) {
        case "newline":
          sep = "\n";
          break;
        case "space":
          sep = " ";
          break;
        case "comma":
          sep = ",";
          break;
        case "semicolon":
          sep = ";";
          break;
        case "pipe":
          sep = "|";
          break;
        case "tab":
          sep = "\t";
          break;
        case "custom":
          sep = customDelimiter.value;
          if (!sep) {
            if (window.Utils && window.Utils.showNotification) {
              window.Utils.showNotification("Please enter a custom delimiter");
            } else {
              alert("Please enter a custom delimiter");
            }
            return;
          }
          break;
      }

      const parts = text.split(sep);
      partCount.textContent = parts.length;
      outputText.value = parts.join("\n");
    }

    // Auto-split on input change
    if (inputText) {
      const debouncedSplit = window.Utils ? window.Utils.debounce(splitText, 300) : splitText;
      inputText.addEventListener("input", debouncedSplit);
    }

    if (delimiter) {
      delimiter.addEventListener("change", splitText);
    }

    if (customDelimiter) {
      const debouncedSplit = window.Utils ? window.Utils.debounce(splitText, 300) : splitText;
      customDelimiter.addEventListener("input", debouncedSplit);
    }

    // Global functions for buttons
    window.splitText = splitText;

    window.clearAll = () => {
      inputText.value = "";
      outputText.value = "";
      partCount.textContent = "0";
    };

    window.copyResult = () => {
      if (!outputText.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No result to copy");
        } else {
          alert("No result to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(outputText.value);
      } else {
        navigator.clipboard.writeText(outputText.value).then(() => {
          alert('Result copied to clipboard!');
        });
      }
    };

    // Initial processing
    splitText();
  });
})();
