// QR Code Generator Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const contentType = document.getElementById("contentType");
    const qrContent = document.getElementById("qrContent");
    const qrSize = document.getElementById("qrSize");
    const errorLevel = document.getElementById("errorLevel");
    const qrOutput = document.getElementById("qrOutput");
    const qrCodeContainer = document.getElementById("qrCodeContainer");
    const downloadBtn = document.getElementById("downloadBtn");

    let currentQRCodeDataURL = null;

    function generateQR() {
      const content = qrContent.value.trim();
      const size = parseInt(qrSize.value);
      const errorCorrectionLevel = errorLevel.value;

      if (!content) {
        qrOutput.style.display = "none";
        downloadBtn.disabled = true;
        return;
      }

      try {
        // Clear previous QR code
        qrCodeContainer.innerHTML = "";

        // Generate QR code
        QRCode.toCanvas(qrCodeContainer, content, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: errorCorrectionLevel
        }, function (error, canvas) {
          if (error) {
            console.error('QR Code generation error:', error);
            qrCodeContainer.innerHTML = '<p style="color: var(--error, #ef4444);">Error generating QR code. Please check your content.</p>';
            return;
          }

          if (canvas) {
            // Store the data URL for downloading
            currentQRCodeDataURL = canvas.toDataURL('image/png');
            downloadBtn.disabled = false;
            qrOutput.style.display = "block";
          }
        });

      } catch (error) {
        console.error('QR Code generation error:', error);
        qrCodeContainer.innerHTML = '<p style="color: var(--error, #ef4444);">Error generating QR code. Please check your content.</p>';
        qrOutput.style.display = "block";
        downloadBtn.disabled = true;
      }
    }

    function updatePlaceholder() {
      const type = contentType.value;
      const placeholders = {
        'text': 'Enter any text content...',
        'url': 'https://example.com',
        'email': 'contact@example.com',
        'phone': '+1234567890',
        'sms': '+1234567890:Your message here',
        'wifi': 'WIFI:T:WPA;S:NetworkName;P:Password;H:false;;',
        'vcard': 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD'
      };
      
      qrContent.placeholder = placeholders[type] || 'Enter the content for your QR code...';
    }

    // Auto-generate on input change
    if (qrContent) {
      const debouncedGenerate = window.Utils ? window.Utils.debounce(generateQR, 500) : generateQR;
      qrContent.addEventListener("input", debouncedGenerate);
    }

    if (contentType) {
      contentType.addEventListener("change", updatePlaceholder);
      updatePlaceholder(); // Set initial placeholder
    }

    if (qrSize) {
      qrSize.addEventListener("change", generateQR);
    }

    if (errorLevel) {
      errorLevel.addEventListener("change", generateQR);
    }

    // Global functions for buttons
    window.generateQR = generateQR;

    window.clearQR = () => {
      qrContent.value = "";
      qrOutput.style.display = "none";
      qrCodeContainer.innerHTML = "";
      downloadBtn.disabled = true;
      currentQRCodeDataURL = null;
    };

    window.downloadQR = () => {
      if (!currentQRCodeDataURL) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No QR code to download");
        } else {
          alert("No QR code to download");
        }
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = currentQRCodeDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (window.Utils && window.Utils.showNotification) {
        window.Utils.showNotification("QR code downloaded successfully!");
      }
    };

    // Initial generation
    generateQR();
  });
})();
