// Sentence Counter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const statsOutput = document.getElementById("statsOutput");
    const sentenceCount = document.getElementById("sentenceCount");
    const wordCount = document.getElementById("wordCount");
    const characterCount = document.getElementById("characterCount");
    const paragraphCount = document.getElementById("paragraphCount");
    const charNoSpaces = document.getElementById("charNoSpaces");
    const avgWordsPerSentence = document.getElementById("avgWordsPerSentence");
    const avgCharsPerWord = document.getElementById("avgCharsPerWord");
    const readingTime = document.getElementById("readingTime");

    function countText() {
      const text = inputText.value.trim();
      
      if (!text) {
        statsOutput.style.display = "none";
        return;
      }

      // Count sentences (ending with . ! ?)
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const sentenceCountValue = sentences.length;

      // Count words (separated by whitespace)
      const words = text.split(/\s+/).filter(w => w.length > 0);
      const wordCountValue = words.length;

      // Count characters
      const characterCountValue = text.length;
      const charNoSpacesValue = text.replace(/\s/g, '').length;

      // Count paragraphs (separated by line breaks)
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
      const paragraphCountValue = paragraphs.length || 1;

      // Calculate averages
      const avgWordsPerSentenceValue = sentenceCountValue > 0 ? 
        (wordCountValue / sentenceCountValue).toFixed(1) : 0;
      
      const avgCharsPerWordValue = wordCountValue > 0 ? 
        (charNoSpacesValue / wordCountValue).toFixed(1) : 0;

      // Calculate reading time (average 200 words per minute)
      const readingTimeValue = wordCountValue > 0 ? 
        Math.ceil(wordCountValue / 200) : 0;

      // Update display
      sentenceCount.textContent = sentenceCountValue;
      wordCount.textContent = wordCountValue;
      characterCount.textContent = characterCountValue;
      paragraphCount.textContent = paragraphCountValue;
      charNoSpaces.textContent = charNoSpacesValue;
      avgWordsPerSentence.textContent = avgWordsPerSentenceValue;
      avgCharsPerWord.textContent = avgCharsPerWordValue;
      readingTime.textContent = readingTimeValue;

      statsOutput.style.display = "block";
    }

    // Auto-count on input change
    if (inputText) {
      const debouncedCount = window.Utils ? window.Utils.debounce(countText, 300) : countText;
      inputText.addEventListener("input", debouncedCount);
    }

    // Global functions for buttons
    window.countText = countText;

    window.clearText = () => {
      inputText.value = "";
      statsOutput.style.display = "none";
    };

    window.copyResults = () => {
      const results = {
        sentences: sentenceCount.textContent,
        words: wordCount.textContent,
        characters: characterCount.textContent,
        paragraphs: paragraphCount.textContent,
        charactersNoSpaces: charNoSpaces.textContent,
        avgWordsPerSentence: avgWordsPerSentence.textContent,
        avgCharsPerWord: avgCharsPerWord.textContent,
        readingTime: readingTime.textContent
      };

      const resultText = `Text Statistics:
Sentences: ${results.sentences}
Words: ${results.words}
Characters: ${results.characters}
Characters (no spaces): ${results.charactersNoSpaces}
Paragraphs: ${results.paragraphs}
Average words per sentence: ${results.avgWordsPerSentence}
Average characters per word: ${results.avgCharsPerWord}
Reading time: ${results.readingTime} minutes`;

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(resultText);
      } else {
        navigator.clipboard.writeText(resultText).then(() => {
          alert('Text statistics copied to clipboard!');
        });
      }
    };

    // Initial count
    countText();
  });
})();
