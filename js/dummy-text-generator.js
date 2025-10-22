// Lorem Ipsum Generator Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const textType = document.getElementById("textType");
    const textCount = document.getElementById("textCount");
    const startWithLorem = document.getElementById("startWithLorem");
    const includeHTML = document.getElementById("includeHTML");
    const generatedText = document.getElementById("generatedText");
    const wordCount = document.getElementById("wordCount");
    const charCount = document.getElementById("charCount");
    const sentenceCount = document.getElementById("sentenceCount");
    const paragraphCount = document.getElementById("paragraphCount");

    const loremWords = [
      "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
      "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
      "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
      "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
      "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
      "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
      "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos", "accusamus", "iusto",
      "odio", "dignissimos", "ducimus", "blanditiis", "praesentium", "voluptatum", "deleniti",
      "atque", "corrupti", "quos", "dolores", "quas", "molestias", "excepturi", "sint",
      "occaecati", "cupiditate", "non", "provident", "similique", "sunt", "in", "culpa",
      "qui", "officia", "deserunt", "mollitia", "animi", "id", "est", "laborum", "et",
      "dolorum", "fuga", "et", "harum", "quidem", "rerum", "facilis", "est", "et",
      "expedita", "distinctio", "nam", "libero", "tempore", "cum", "soluta", "nobis",
      "est", "eligendi", "optio", "cumque", "nihil", "impedit", "quo", "minus", "id",
      "quod", "maxime", "placeat", "facere", "possimus", "omnis", "voluptas", "assumenda",
      "est", "omnis", "dolor", "repellendus", "temporibus", "autem", "quibusdam", "et",
      "aut", "officiis", "debitis", "aut", "rerum", "necessitatibus", "saepe", "eveniet",
      "ut", "et", "voluptates", "repudiandae", "sint", "molestiae", "non", "recusandae",
      "itaque", "earum", "rerum", "hic", "tenetur", "sapiente", "delectus", "ut", "aut",
      "reiciendis", "voluptatibus", "maiores", "alias", "consequatur", "aut", "perferendis",
      "doloribus", "asperiores", "repellat"
    ];

    function generateText() {
      const type = textType.value;
      const count = parseInt(textCount.value) || 1;
      const startLorem = startWithLorem.checked;
      const includeHtml = includeHTML.checked;

      let result = "";

      try {
        switch (type) {
          case "paragraphs":
            result = generateParagraphs(count, startLorem, includeHtml);
            break;
          case "words":
            result = generateWords(count, startLorem);
            break;
          case "sentences":
            result = generateSentences(count, startLorem);
            break;
          case "characters":
            result = generateCharacters(count, startLorem);
            break;
          default:
            result = generateParagraphs(1, startLorem, includeHtml);
        }

        generatedText.value = result;
        updateStatistics(result);
        
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('Lorem Ipsum text generated successfully!', 'success');
        }
      } catch (error) {
        generatedText.value = `Error: ${error.message}`;
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('Error generating text', 'error');
        }
      }
    }

    function generateParagraphs(count, startLorem, includeHtml) {
      const paragraphs = [];
      
      for (let i = 0; i < count; i++) {
        let paragraph = "";
        
        if (i === 0 && startLorem) {
          paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";
        }
        
        // Generate 3-7 sentences per paragraph
        const sentenceCount = Math.floor(Math.random() * 5) + 3;
        
        for (let j = 0; j < sentenceCount; j++) {
          if (paragraph && !paragraph.endsWith(" ")) {
            paragraph += " ";
          }
          paragraph += generateSentence();
        }
        
        if (includeHtml) {
          paragraph = `<p>${paragraph}</p>`;
        }
        
        paragraphs.push(paragraph);
      }
      
      return paragraphs.join(includeHtml ? "\n\n" : "\n\n");
    }

    function generateWords(count, startLorem) {
      if (startLorem && count >= 2) {
        return "Lorem ipsum " + generateRandomWords(count - 2).join(" ");
      }
      return generateRandomWords(count).join(" ");
    }

    function generateSentences(count, startLorem) {
      const sentences = [];
      
      for (let i = 0; i < count; i++) {
        if (i === 0 && startLorem) {
          sentences.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
        } else {
          sentences.push(generateSentence());
        }
      }
      
      return sentences.join(" ");
    }

    function generateCharacters(count, startLorem) {
      let text = "";
      
      if (startLorem) {
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";
      }
      
      while (text.length < count) {
        text += generateSentence() + " ";
      }
      
      return text.substring(0, count);
    }

    function generateSentence() {
      const wordCount = Math.floor(Math.random() * 15) + 5; // 5-19 words
      const words = generateRandomWords(wordCount);
      
      // Capitalize first word
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      
      // Add period at the end
      return words.join(" ") + ".";
    }

    function generateRandomWords(count) {
      const words = [];
      
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * loremWords.length);
        words.push(loremWords[randomIndex]);
      }
      
      return words;
    }

    function updateStatistics(text) {
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const characters = text.length;
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);

      wordCount.textContent = words.length;
      charCount.textContent = characters;
      sentenceCount.textContent = sentences.length;
      paragraphCount.textContent = paragraphs.length;
    }

    // Auto-generate on input change
    if (textType) {
      textType.addEventListener("change", generateText);
    }

    if (textCount) {
      const debouncedGenerate = window.Utils ? window.Utils.debounce(generateText, 300) : generateText;
      textCount.addEventListener("input", debouncedGenerate);
    }

    if (startWithLorem) {
      startWithLorem.addEventListener("change", generateText);
    }

    if (includeHTML) {
      includeHTML.addEventListener("change", generateText);
    }

    // Global functions for buttons
    window.generateText = generateText;

    window.clearText = () => {
      generatedText.value = "";
      wordCount.textContent = "0";
      charCount.textContent = "0";
      sentenceCount.textContent = "0";
      paragraphCount.textContent = "0";
    };

    window.copyText = () => {
      if (!generatedText.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('No text to copy', 'warning');
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(generatedText.value);
      } else {
        navigator.clipboard.writeText(generatedText.value).then(() => {
          alert('Text copied to clipboard!');
        });
      }
    };

    // Initial generation
    generateText();
    
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