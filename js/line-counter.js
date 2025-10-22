// Line Counter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const statsOutput = document.getElementById("statsOutput");
    const totalLines = document.getElementById("totalLines");
    const nonEmptyLines = document.getElementById("nonEmptyLines");
    const emptyLines = document.getElementById("emptyLines");
    const avgCharsPerLine = document.getElementById("avgCharsPerLine");
    const longestLine = document.getElementById("longestLine");
    const shortestLine = document.getElementById("shortestLine");
    const totalChars = document.getElementById("totalChars");
    const charsNoSpaces = document.getElementById("charsNoSpaces");

    function countLines() {
      const text = inputText.value;
      
      if (!text.trim()) {
        statsOutput.style.display = "none";
        return;
      }

      // Split text into lines
      const lines = text.split('\n');
      const totalLinesValue = lines.length;

      // Count non-empty lines
      const nonEmptyLinesValue = lines.filter(line => line.trim().length > 0).length;
      const emptyLinesValue = totalLinesValue - nonEmptyLinesValue;

      // Calculate line statistics
      const nonEmptyLinesArray = lines.filter(line => line.trim().length > 0);
      const lineLengths = nonEmptyLinesArray.map(line => line.length);
      
      const longestLineValue = lineLengths.length > 0 ? Math.max(...lineLengths) : 0;
      const shortestLineValue = lineLengths.length > 0 ? Math.min(...lineLengths) : 0;
      const avgCharsPerLineValue = nonEmptyLinesValue > 0 ? 
        (lineLengths.reduce((sum, length) => sum + length, 0) / nonEmptyLinesValue).toFixed(1) : 0;

      // Character statistics
      const totalCharsValue = text.length;
      const charsNoSpacesValue = text.replace(/\s/g, '').length;

      // Update display
      totalLines.textContent = totalLinesValue;
      nonEmptyLines.textContent = nonEmptyLinesValue;
      emptyLines.textContent = emptyLinesValue;
      avgCharsPerLine.textContent = avgCharsPerLineValue;
      longestLine.textContent = longestLineValue;
      shortestLine.textContent = shortestLineValue;
      totalChars.textContent = totalCharsValue;
      charsNoSpaces.textContent = charsNoSpacesValue;

      statsOutput.style.display = "block";
    }

    // Auto-count on input change
    if (inputText) {
      const debouncedCount = window.Utils ? window.Utils.debounce(countLines, 300) : countLines;
      inputText.addEventListener("input", debouncedCount);
    }

    // Global functions for buttons
    window.countLines = countLines;

    window.clearLines = () => {
      inputText.value = "";
      statsOutput.style.display = "none";
    };

    window.copyResults = () => {
      const results = {
        totalLines: totalLines.textContent,
        nonEmptyLines: nonEmptyLines.textContent,
        emptyLines: emptyLines.textContent,
        avgCharsPerLine: avgCharsPerLine.textContent,
        longestLine: longestLine.textContent,
        shortestLine: shortestLine.textContent,
        totalChars: totalChars.textContent,
        charsNoSpaces: charsNoSpaces.textContent
      };

      const resultText = `Line Statistics:
Total Lines: ${results.totalLines}
Non-Empty Lines: ${results.nonEmptyLines}
Empty Lines: ${results.emptyLines}
Average Characters per Line: ${results.avgCharsPerLine}
Longest Line: ${results.longestLine} characters
Shortest Line: ${results.shortestLine} characters
Total Characters: ${results.totalChars}
Characters (no spaces): ${results.charsNoSpaces}`;

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(resultText);
      } else {
        navigator.clipboard.writeText(resultText).then(() => {
          alert('Line statistics copied to clipboard!');
        });
      }
    };

    // Initial count
    countLines();
    
    // Initialize FAQ
    initializeFAQ();
  });
})();

// Initialize FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            
            // Toggle active class
            faqItem.classList.toggle('active');
            
            // Toggle answer visibility
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
}