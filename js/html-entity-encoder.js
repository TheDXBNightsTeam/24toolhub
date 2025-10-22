// HTML Entity Encoder/Decoder Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const encodeAll = document.getElementById("encodeAll");
    const useNamedEntities = document.getElementById("useNamedEntities");
    const originalLength = document.getElementById("originalLength");
    const processedLength = document.getElementById("processedLength");
    const entitiesCount = document.getElementById("entitiesCount");
    const specialChars = document.getElementById("specialChars");

    // HTML entity mappings
    const namedEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
      ' ': '&nbsp;',
      '©': '&copy;',
      '®': '&reg;',
      '™': '&trade;',
      '€': '&euro;',
      '£': '&pound;',
      '¥': '&yen;',
      '¢': '&cent;',
      '§': '&sect;',
      '¶': '&para;',
      '†': '&dagger;',
      '‡': '&Dagger;',
      '•': '&bull;',
      '…': '&hellip;',
      '–': '&ndash;',
      '—': '&mdash;',
      '¡': '&iexcl;',
      '¿': '&iquest;',
      '«': '&laquo;',
      '»': '&raquo;',
      '‹': '&lsaquo;',
      '›': '&rsaquo;',
      '‚': '&sbquo;',
      '„': '&bdquo;',
      '‰': '&permil;',
      '′': '&prime;',
      '″': '&Prime;',
      '‹': '&lsaquo;',
      '›': '&rsaquo;',
      '‾': '&oline;',
      '←': '&larr;',
      '→': '&rarr;',
      '↑': '&uarr;',
      '↓': '&darr;',
      '↔': '&harr;',
      '⇐': '&lArr;',
      '⇒': '&rArr;',
      '⇑': '&uArr;',
      '⇓': '&dArr;',
      '⇔': '&hArr;',
      '±': '&plusmn;',
      '×': '&times;',
      '÷': '&divide;',
      '∞': '&infin;',
      '∑': '&sum;',
      '∏': '&prod;',
      '√': '&radic;',
      '∫': '&int;',
      '≈': '&asymp;',
      '≠': '&ne;',
      '≤': '&le;',
      '≥': '&ge;',
      'α': '&alpha;',
      'β': '&beta;',
      'γ': '&gamma;',
      'δ': '&delta;',
      'ε': '&epsilon;',
      'ζ': '&zeta;',
      'η': '&eta;',
      'θ': '&theta;',
      'λ': '&lambda;',
      'μ': '&mu;',
      'π': '&pi;',
      'σ': '&sigma;',
      'τ': '&tau;',
      'φ': '&phi;',
      'χ': '&chi;',
      'ψ': '&psi;',
      'ω': '&omega;'
    };

    const specialCharacters = /[&<>"'`\x00-\x1F\x7F-\x9F]/g;

    function updateMode() {
      const mode = document.querySelector('input[name="mode"]:checked').value;
      const placeholder = mode === 'encode' 
        ? 'Enter text to encode...' 
        : 'Enter HTML entities to decode...';
      
      inputText.placeholder = placeholder;
      processText();
    }

    function processText() {
      const text = inputText.value;
      const mode = document.querySelector('input[name="mode"]:checked').value;
      const encodeAllChars = encodeAll.checked;
      const useNamed = useNamedEntities.checked;

      if (!text.trim()) {
        outputText.value = "";
        updateStatistics("", "");
        return;
      }

      try {
        let result;
        if (mode === 'encode') {
          result = encodeText(text, encodeAllChars, useNamed);
        } else {
          result = decodeText(text);
        }

        outputText.value = result;
        updateStatistics(text, result);
        
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(`Text ${mode}d successfully!`, 'success');
        }
      } catch (error) {
        outputText.value = `Error: ${error.message}`;
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(`Error ${mode}ing text`, 'error');
        }
      }
    }

    function encodeText(text, encodeAllChars, useNamed) {
      if (encodeAllChars) {
        return encodeAllCharacters(text, useNamed);
      } else {
        return encodeSpecialCharacters(text, useNamed);
      }
    }

    function encodeSpecialCharacters(text, useNamed) {
      return text.replace(specialCharacters, (char) => {
        if (useNamed && namedEntities[char]) {
          return namedEntities[char];
        } else {
          return `&#${char.charCodeAt(0)};`;
        }
      });
    }

    function encodeAllCharacters(text, useNamed) {
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (useNamed && namedEntities[char]) {
          result += namedEntities[char];
        } else {
          result += `&#${char.charCodeAt(0)};`;
        }
      }
      return result;
    }

    function decodeText(text) {
      // Decode named entities first
      let result = text;
      for (const [char, entity] of Object.entries(namedEntities)) {
        result = result.replace(new RegExp(entity, 'g'), char);
      }

      // Decode numeric entities
      result = result.replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(parseInt(dec, 10));
      });

      // Decode hexadecimal entities
      result = result.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });

      return result;
    }

    function updateStatistics(original, processed) {
      originalLength.textContent = original.length;
      processedLength.textContent = processed.length;
      
      // Count entities in processed text
      const entityMatches = processed.match(/&[a-zA-Z0-9#]+;/g);
      entitiesCount.textContent = entityMatches ? entityMatches.length : 0;
      
      // Count special characters in original text
      const specialMatches = original.match(specialCharacters);
      specialChars.textContent = specialMatches ? specialMatches.length : 0;
    }

    // Auto-process on input change
    if (inputText) {
      const debouncedProcess = window.Utils ? window.Utils.debounce(processText, 300) : processText;
      inputText.addEventListener("input", debouncedProcess);
    }

    if (encodeAll) {
      encodeAll.addEventListener("change", processText);
    }

    if (useNamedEntities) {
      useNamedEntities.addEventListener("change", processText);
    }

    // Global functions for buttons
    window.updateMode = updateMode;
    window.processText = processText;

    window.clearAll = () => {
      inputText.value = "";
      outputText.value = "";
      updateStatistics("", "");
    };

    window.copyOutput = () => {
      if (!outputText.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('No output to copy', 'warning');
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(outputText.value);
      } else {
        navigator.clipboard.writeText(outputText.value).then(() => {
          alert('Output copied to clipboard!');
        });
      }
    };

    // Initial processing
    processText();
  });
})();