// Remove Duplicates Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const originalCount = document.getElementById("originalCount");
    const uniqueCount = document.getElementById("uniqueCount");
    const removedCount = document.getElementById("removedCount");

    function removeDuplicates() {
      const text = inputText.value;
      if (!text) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Please enter some text first");
        } else {
          alert("Please enter some text first");
        }
        return;
      }

      const removeType = document.querySelector('input[name="removeType"]:checked').value;
      const caseSensitive = document.getElementById("caseSensitive").checked;

      const items = removeType === "lines" ? text.split("\n") : text.split(/\s+/);
      const original = items.length;

      const seen = new Set();
      const unique = items.filter((item) => {
        const key = caseSensitive ? item : item.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });

      originalCount.textContent = original;
      uniqueCount.textContent = unique.length;
      removedCount.textContent = original - unique.length;

      outputText.value = removeType === "lines" ? unique.join("\n") : unique.join(" ");
    }

    // Auto-remove duplicates on input change
    if (inputText) {
      const debouncedRemove = window.Utils ? window.Utils.debounce(removeDuplicates, 300) : removeDuplicates;
      inputText.addEventListener("input", debouncedRemove);
    }

    // Global functions for buttons
    window.removeDuplicates = removeDuplicates;

    window.clearAll = () => {
      inputText.value = "";
      outputText.value = "";
      originalCount.textContent = "0";
      uniqueCount.textContent = "0";
      removedCount.textContent = "0";
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
    removeDuplicates();
  });
})();
