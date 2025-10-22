// JWT Decoder Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const headerText = document.getElementById("headerText");
    const payloadText = document.getElementById("payloadText");
    const signatureText = document.getElementById("signatureText");

    function decodeJWT() {
      const token = inputText.value.trim();
      
      if (!token) {
        clearOutputs();
        return;
      }

      try {
        // Split JWT into parts
        const parts = token.split('.');
        
        if (parts.length !== 3) {
          throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.');
        }

        const [headerPart, payloadPart, signaturePart] = parts;

        // Decode header
        const header = JSON.parse(atob(headerPart.replace(/-/g, '+').replace(/_/g, '/')));
        headerText.value = JSON.stringify(header, null, 2);

        // Decode payload
        const payload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
        payloadText.value = JSON.stringify(payload, null, 2);

        // Display signature (not decoded, just shown)
        signatureText.value = signaturePart;

        // Check for expiration
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          const now = new Date();
          if (expDate < now) {
            if (window.Utils && window.Utils.showNotification) {
              window.Utils.showNotification("⚠️ This token has expired");
            }
          }
        }

      } catch (error) {
        clearOutputs();
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Error decoding JWT: " + error.message);
        } else {
          alert("Error decoding JWT: " + error.message);
        }
      }
    }

    function clearOutputs() {
      headerText.value = "";
      payloadText.value = "";
      signatureText.value = "";
    }

    function clearAll() {
      inputText.value = "";
      clearOutputs();
    }

    function copyHeader() {
      if (!headerText.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No header to copy");
        } else {
          alert("No header to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(headerText.value);
      } else {
        navigator.clipboard.writeText(headerText.value).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('Header copied to clipboard!');
          } else {
            alert('Header copied to clipboard!');
          }
        });
      }
    }

    function copyPayload() {
      if (!payloadText.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No payload to copy");
        } else {
          alert("No payload to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(payloadText.value);
      } else {
        navigator.clipboard.writeText(payloadText.value).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('Payload copied to clipboard!');
          } else {
            alert('Payload copied to clipboard!');
          }
        });
      }
    }

    function copySignature() {
      if (!signatureText.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No signature to copy");
        } else {
          alert("No signature to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(signatureText.value);
      } else {
        navigator.clipboard.writeText(signatureText.value).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('Signature copied to clipboard!');
          } else {
            alert('Signature copied to clipboard!');
          }
        });
      }
    }

    // Auto-decode as user types
    if (inputText) {
      const debouncedDecode = window.Utils ? window.Utils.debounce(decodeJWT, 500) : decodeJWT;
      inputText.addEventListener("input", debouncedDecode);
    }

    // Global functions for buttons
    window.decodeJWT = decodeJWT;
    window.clearAll = clearAll;
    window.copyHeader = copyHeader;
    window.copyPayload = copyPayload;
    window.copySignature = copySignature;
  });
})();