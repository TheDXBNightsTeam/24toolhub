// SHA256 Hash Generator Tool Logic
;(() => {
  'use strict';
  
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const hashOutput = document.getElementById("hashOutput");
    const includeSalt = document.getElementById("includeSalt");
    const uppercase = document.getElementById("uppercase");
    const hashLength = document.getElementById("hashLength");
    const inputLength = document.getElementById("inputLength");
    const hashType = document.getElementById("hashType");
    const processingTime = document.getElementById("processingTime");

    async function generateHash() {
      const text = inputText.value;
      const addSalt = includeSalt.checked;
      const toUpper = uppercase.checked;

      if (!text.trim()) {
        hashOutput.value = "";
        updateHashInfo("", "", 0);
        return;
      }

      try {
        const startTime = performance.now();
        
        // Add salt if requested
        const textToHash = addSalt ? text + generateSalt() : text;
        
        // Generate SHA256 hash
        const hash = await sha256(textToHash);
        const finalHash = toUpper ? hash.toUpperCase() : hash.toLowerCase();
        
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        hashOutput.value = finalHash;
        updateHashInfo(text, finalHash, duration);
        
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('SHA256 hash generated successfully!', 'success');
        }
      } catch (error) {
        hashOutput.value = `Error: ${error.message}`;
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('Error generating hash', 'error');
        }
      }
    }

    async function sha256(message) {
      // Convert string to Uint8Array
      const msgBuffer = new TextEncoder().encode(message);
      
      // Hash the message
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      
      // Convert ArrayBuffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex;
    }

    function generateSalt() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let salt = '';
      for (let i = 0; i < 16; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return salt;
    }

    function updateHashInfo(input, hash, duration) {
      inputLength.textContent = input.length;
      hashLength.textContent = hash.length;
      hashType.textContent = "SHA256";
      processingTime.textContent = `${duration}ms`;
    }

    // Auto-generate on input change
    if (inputText) {
      const debouncedGenerate = window.Utils ? window.Utils.debounce(generateHash, 500) : generateHash;
      inputText.addEventListener("input", debouncedGenerate);
    }

    if (includeSalt) {
      includeSalt.addEventListener("change", generateHash);
    }

    if (uppercase) {
      uppercase.addEventListener("change", generateHash);
    }

    // Global functions for buttons
    window.generateHash = generateHash;

    window.clearAll = () => {
      inputText.value = "";
      hashOutput.value = "";
      updateHashInfo("", "", 0);
    };

    window.copyHash = () => {
      if (!hashOutput.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('No hash to copy', 'warning');
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(hashOutput.value);
      } else {
        navigator.clipboard.writeText(hashOutput.value).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('Hash copied to clipboard!', 'success');
          } else {
            alert('Hash copied to clipboard!');
          }
        });
      }
    };

    // Initial generation
    generateHash();
  });
})();
