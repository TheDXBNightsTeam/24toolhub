// CSV to JSON Converter Tool Logic
;(() => {
  'use strict';
  
  document.addEventListener("DOMContentLoaded", () => {
    const csvInput = document.getElementById("csvInput");
    const jsonOutput = document.getElementById("jsonOutput");
    const hasHeaders = document.getElementById("hasHeaders");
    const delimiter = document.getElementById("delimiter");

    function convertCSVToJSON() {
      const csvText = csvInput.value.trim();
      
      if (!csvText) {
        jsonOutput.value = "";
        return;
      }

      try {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
          jsonOutput.value = "[]";
          return;
        }

        const selectedDelimiter = delimiter.value;
        const useHeaders = hasHeaders.checked;
        
        let headers = [];
        let dataStartIndex = 0;

        if (useHeaders) {
          headers = lines[0].split(selectedDelimiter).map(header => header.trim().replace(/"/g, ''));
          dataStartIndex = 1;
        }

        const result = [];
        
        for (let i = dataStartIndex; i < lines.length; i++) {
          const values = parseCSVLine(lines[i], selectedDelimiter);
          const obj = {};
          
          if (useHeaders) {
            headers.forEach((header, index) => {
              obj[header] = convertValue(values[index] || '');
            });
          } else {
            values.forEach((value, index) => {
              obj[`column${index + 1}`] = convertValue(value);
            });
          }
          
          result.push(obj);
        }

        jsonOutput.value = JSON.stringify(result, null, 2);
        
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('CSV converted to JSON successfully!', 'success');
        }
      } catch (error) {
        jsonOutput.value = `Error: ${error.message}`;
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('Error converting CSV to JSON', 'error');
        }
      }
    }

    function parseCSVLine(line, delimiter) {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    }

    function convertValue(value) {
      if (!value || value === '') return null;
      
      // Remove quotes if present
      value = value.replace(/^"(.*)"$/, '$1');
      
      // Try to convert to number
      if (!isNaN(value) && !isNaN(parseFloat(value))) {
        return parseFloat(value);
      }
      
      // Try to convert to boolean
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
      
      // Return as string
      return value;
    }

    // Auto-convert on input change
    if (csvInput) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertCSVToJSON, 500) : convertCSVToJSON;
      csvInput.addEventListener("input", debouncedConvert);
    }

    if (hasHeaders) {
      hasHeaders.addEventListener("change", convertCSVToJSON);
    }

    if (delimiter) {
      delimiter.addEventListener("change", convertCSVToJSON);
    }

    // Global functions for buttons
    window.convertCSVToJSON = convertCSVToJSON;

    window.clearAll = () => {
      csvInput.value = "";
      jsonOutput.value = "";
    };

    window.copyOutput = () => {
      if (!jsonOutput.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('No JSON output to copy', 'warning');
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(jsonOutput.value);
      } else {
        navigator.clipboard.writeText(jsonOutput.value).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('JSON output copied to clipboard!', 'success');
          } else {
            alert('JSON output copied to clipboard!');
          }
        });
      }
    };
  });
})();