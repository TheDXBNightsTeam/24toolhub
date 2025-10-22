// Regex Tester Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const regexPattern = document.getElementById("regexPattern");
    const testString = document.getElementById("testString");
    const matchesOutput = document.getElementById("matchesOutput");
    const matchesList = document.getElementById("matchesList");
    const flagGlobal = document.getElementById("flagGlobal");
    const flagCaseInsensitive = document.getElementById("flagCaseInsensitive");
    const flagMultiline = document.getElementById("flagMultiline");
    const flagDotAll = document.getElementById("flagDotAll");

    function testRegex() {
      const pattern = regexPattern.value;
      const text = testString.value;

      if (!pattern || !text) {
        matchesOutput.style.display = "none";
        return;
      }

      try {
        // Build flags string
        let flags = "";
        if (flagGlobal.checked) flags += "g";
        if (flagCaseInsensitive.checked) flags += "i";
        if (flagMultiline.checked) flags += "m";
        if (flagDotAll.checked) flags += "s";

        // Create regex object
        const regex = new RegExp(pattern, flags);

        // Find all matches
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          
          // Prevent infinite loop with global flag
          if (!flagGlobal.checked) break;
        }

        // Display results
        if (matches.length === 0) {
          matchesList.innerHTML = "<p style='color: var(--text-secondary, #888);'>No matches found.</p>";
        } else {
          let html = `<p style='color: var(--success, #10b981); margin-bottom: 1rem;'><strong>${matches.length} match(es) found:</strong></p>`;
          
          matches.forEach((match, index) => {
            html += `
              <div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--bg-secondary, #1a1a1a); border-radius: 0.25rem; border-left: 3px solid var(--accent-primary, #3b82f6);">
                <div style="font-weight: bold; color: var(--accent-primary, #3b82f6);">Match ${index + 1}:</div>
                <div style="font-family: monospace; margin: 0.5rem 0; padding: 0.5rem; background: var(--bg-primary, #2a2a2a); border-radius: 0.25rem; word-break: break-all;">"${match.match}"</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary, #888);">Position: ${match.index}</div>
                ${match.groups.length > 0 ? `<div style="font-size: 0.875rem; color: var(--text-secondary, #888);">Groups: ${match.groups.join(', ')}</div>` : ''}
              </div>
            `;
          });
          
          matchesList.innerHTML = html;
        }

        matchesOutput.style.display = "block";

      } catch (error) {
        matchesList.innerHTML = `<p style='color: var(--error, #ef4444);'>Error: ${error.message}</p>`;
        matchesOutput.style.display = "block";
      }
    }

    // Auto-test as user types
    if (regexPattern) {
      const debouncedTest = window.Utils ? window.Utils.debounce(testRegex, 500) : testRegex;
      regexPattern.addEventListener("input", debouncedTest);
    }

    if (testString) {
      const debouncedTest = window.Utils ? window.Utils.debounce(testRegex, 500) : testRegex;
      testString.addEventListener("input", debouncedTest);
    }

    // Test when flags change
    [flagGlobal, flagCaseInsensitive, flagMultiline, flagDotAll].forEach(flag => {
      if (flag) {
        flag.addEventListener("change", testRegex);
      }
    });

    // Global functions for buttons
    window.testRegex = testRegex;

    window.clearAll = () => {
      regexPattern.value = "";
      testString.value = "";
      matchesOutput.style.display = "none";
      matchesList.innerHTML = "";
    };

    // Initial test
    testRegex();
  });
})();
