// XML Formatter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const xmlInput = document.getElementById("xmlInput");
    const xmlOutput = document.getElementById("xmlOutput");
    const xmlResult = document.getElementById("xmlResult");
    const xmlError = document.getElementById("xmlError");
    const errorMessage = document.getElementById("errorMessage");
    const indentation = document.getElementById("indentation");

    function formatXML() {
      const xml = xmlInput.value.trim();
      
      if (!xml) {
        xmlOutput.style.display = "none";
        xmlError.style.display = "none";
        return;
      }

      try {
        // Hide previous results
        xmlOutput.style.display = "none";
        xmlError.style.display = "none";

        // Parse XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        
        // Check for parsing errors
        const parseError = xmlDoc.querySelector("parsererror");
        if (parseError) {
          throw new Error("Invalid XML: " + parseError.textContent);
        }

        // Get format type
        const formatType = document.querySelector('input[name="formatType"]:checked').value;
        
        if (formatType === "validate") {
          // Just validate
          xmlResult.textContent = "XML is valid and well-formed!";
          xmlOutput.style.display = "block";
          return;
        }

        // Format XML
        let formattedXML;
        if (formatType === "minify") {
          formattedXML = minifyXML(xml);
        } else {
          formattedXML = beautifyXML(xmlDoc, indentation.value);
        }

        xmlResult.textContent = formattedXML;
        xmlOutput.style.display = "block";

      } catch (error) {
        errorMessage.textContent = error.message;
        xmlError.style.display = "block";
        xmlOutput.style.display = "none";
      }
    }

    function beautifyXML(xmlDoc, indentType) {
      const serializer = new XMLSerializer();
      let xmlString = serializer.serializeToString(xmlDoc);
      
      // Basic beautification
      xmlString = xmlString.replace(/></g, '>\n<');
      
      // Add indentation
      const lines = xmlString.split('\n');
      let indentLevel = 0;
      const indentChar = indentType === 'tab' ? '\t' : ' '.repeat(parseInt(indentType));
      
      const formattedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return '';
        
        // Decrease indent for closing tags
        if (trimmedLine.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const indentedLine = indentChar.repeat(indentLevel) + trimmedLine;
        
        // Increase indent for opening tags (but not self-closing)
        if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</') && !trimmedLine.endsWith('/>')) {
          indentLevel++;
        }
        
        return indentedLine;
      });
      
      return formattedLines.join('\n');
    }

    function minifyXML(xml) {
      return xml
        .replace(/>\s+</g, '><')  // Remove whitespace between tags
        .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
        .trim();                  // Remove leading/trailing whitespace
    }

    // Auto-format on input change
    if (xmlInput) {
      const debouncedFormat = window.Utils ? window.Utils.debounce(formatXML, 500) : formatXML;
      xmlInput.addEventListener("input", debouncedFormat);
    }

    // Reformat when options change
    document.querySelectorAll('input[name="formatType"]').forEach(radio => {
      radio.addEventListener("change", formatXML);
    });

    if (indentation) {
      indentation.addEventListener("change", formatXML);
    }

    // Global functions for buttons
    window.formatXML = formatXML;

    window.clearXML = () => {
      xmlInput.value = "";
      xmlOutput.style.display = "none";
      xmlError.style.display = "none";
      xmlResult.textContent = "";
      errorMessage.textContent = "";
    };

    window.copyXML = () => {
      const result = xmlResult.textContent;
      if (!result) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No XML to copy");
        } else {
          alert("No XML to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(result);
      } else {
        navigator.clipboard.writeText(result).then(() => {
          alert('XML copied to clipboard!');
        });
      }
    };

    window.downloadXML = () => {
      const result = xmlResult.textContent;
      if (!result) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No XML to download");
        } else {
          alert("No XML to download");
        }
        return;
      }

      const blob = new Blob([result], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'formatted.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (window.Utils && window.Utils.showNotification) {
        window.Utils.showNotification("XML file downloaded successfully!");
      }
    };

    // Initial format
    formatXML();
  });
})();
