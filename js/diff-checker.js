// Diff Checker Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const text1 = document.getElementById("text1");
    const text2 = document.getElementById("text2");
    const diffOutput = document.getElementById("diffOutput");
    const diffResult = document.getElementById("diffResult");

    function compareDiff() {
      const originalText = text1.value;
      const modifiedText = text2.value;

      if (!originalText && !modifiedText) {
        diffOutput.style.display = "none";
        return;
      }

      // Simple diff algorithm
      const diff = generateDiff(originalText, modifiedText);
      displayDiff(diff);
    }

    function generateDiff(text1, text2) {
      const lines1 = text1.split('\n');
      const lines2 = text2.split('\n');
      
      const diff = [];
      let i = 0, j = 0;

      while (i < lines1.length || j < lines2.length) {
        if (i >= lines1.length) {
          // Only text2 has lines left
          diff.push({ type: 'added', line: lines2[j], lineNumber: j + 1 });
          j++;
        } else if (j >= lines2.length) {
          // Only text1 has lines left
          diff.push({ type: 'removed', line: lines1[i], lineNumber: i + 1 });
          i++;
        } else if (lines1[i] === lines2[j]) {
          // Lines are identical
          diff.push({ type: 'unchanged', line: lines1[i], lineNumber: i + 1 });
          i++;
          j++;
        } else {
          // Lines are different - check if it's a modification or addition/removal
          const nextMatch1 = findNextMatch(lines1, lines2[j], i + 1);
          const nextMatch2 = findNextMatch(lines2, lines1[i], j + 1);

          if (nextMatch1 !== -1 && (nextMatch2 === -1 || nextMatch1 - i <= nextMatch2 - j)) {
            // It's a removal
            diff.push({ type: 'removed', line: lines1[i], lineNumber: i + 1 });
            i++;
          } else if (nextMatch2 !== -1) {
            // It's an addition
            diff.push({ type: 'added', line: lines2[j], lineNumber: j + 1 });
            j++;
          } else {
            // It's a modification
            diff.push({ type: 'removed', line: lines1[i], lineNumber: i + 1 });
            diff.push({ type: 'added', line: lines2[j], lineNumber: j + 1 });
            i++;
            j++;
          }
        }
      }

      return diff;
    }

    function findNextMatch(lines, targetLine, startIndex) {
      for (let i = startIndex; i < lines.length; i++) {
        if (lines[i] === targetLine) {
          return i;
        }
      }
      return -1;
    }

    function displayDiff(diff) {
      if (diff.length === 0) {
        diffResult.textContent = "No differences found. The texts are identical.";
        diffOutput.style.display = "block";
        return;
      }

      let html = "";
      let hasChanges = false;

      diff.forEach(item => {
        if (item.type === 'unchanged') {
          html += `<div style="color: var(--text-primary, #fff);">  ${item.line}</div>`;
        } else if (item.type === 'removed') {
          html += `<div style="color: var(--error, #ef4444); background: rgba(239, 68, 68, 0.1); padding: 0.25rem; margin: 0.125rem 0; border-left: 3px solid var(--error, #ef4444);">- ${item.line}</div>`;
          hasChanges = true;
        } else if (item.type === 'added') {
          html += `<div style="color: var(--success, #10b981); background: rgba(16, 185, 129, 0.1); padding: 0.25rem; margin: 0.125rem 0; border-left: 3px solid var(--success, #10b981);">+ ${item.line}</div>`;
          hasChanges = true;
        }
      });

      if (!hasChanges) {
        diffResult.textContent = "No differences found. The texts are identical.";
      } else {
        diffResult.innerHTML = html;
      }

      diffOutput.style.display = "block";
    }

    // Auto-compare as user types
    if (text1) {
      const debouncedCompare = window.Utils ? window.Utils.debounce(compareDiff, 500) : compareDiff;
      text1.addEventListener("input", debouncedCompare);
    }

    if (text2) {
      const debouncedCompare = window.Utils ? window.Utils.debounce(compareDiff, 500) : compareDiff;
      text2.addEventListener("input", debouncedCompare);
    }

    // Global functions for buttons
    window.compareDiff = compareDiff;

    window.clearAll = () => {
      text1.value = "";
      text2.value = "";
      diffOutput.style.display = "none";
      diffResult.textContent = "";
    };

    // Initial comparison
    compareDiff();
  });
})();