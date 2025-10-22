// Character Counter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const clearBtn = document.getElementById("clearBtn");
    const copyBtn = document.getElementById("copyBtn");

    function updateCharacterCounter() {
      const text = inputText.value;
      
      if (text.length > 50000 && window.Utils) {
        window.Utils.warnLargeData(text.length, 50000);
      }

      const stats = {
        total: text.length,
        noSpace: text.replace(/\s/g, '').length,
        letters: (text.match(/[a-zA-Z\u0600-\u06FF]/g) || []).length,
        numbers: (text.match(/[0-9]/g) || []).length,
        spaces: (text.match(/\s/g) || []).length,
        special: text.length - (text.match(/[a-zA-Z0-9\s\u0600-\u06FF]/g) || []).length
      };
      
      document.getElementById('totalChars').textContent = stats.total;
      document.getElementById('noSpaceChars').textContent = stats.noSpace;
      document.getElementById('letters').textContent = stats.letters;
      document.getElementById('numbers').textContent = stats.numbers;
      document.getElementById('spaces').textContent = stats.spaces;
      document.getElementById('special').textContent = stats.special;
    }

    const debouncedUpdate = window.Utils ? window.Utils.debounce(updateCharacterCounter, 300) : updateCharacterCounter;

    if (inputText) {
      inputText.addEventListener("input", debouncedUpdate);
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        inputText.value = "";
        updateCharacterCounter();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        if (window.Utils && window.Utils.copyToClipboard) {
          window.Utils.copyToClipboard(inputText.value);
        } else {
          // Fallback
          const textarea = document.createElement("textarea");
          textarea.value = inputText.value;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
      });
    }
  });
})();
