// Word Counter Tool Logic
;(() => {
  'use strict';
  
  // Wait for DOM to be ready
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText")
    const wordCount = document.getElementById("wordCount")
    const charCount = document.getElementById("charCount")
    const charNoSpaceCount = document.getElementById("charNoSpaceCount")
    const sentenceCount = document.getElementById("sentenceCount")
    const paragraphCount = document.getElementById("paragraphCount")
    const readingTime = document.getElementById("readingTime")
    const clearBtn = document.getElementById("clearBtn")
    const copyBtn = document.getElementById("copyBtn")

    function updateStats() {
      const text = inputText.value

      if (text.length > 50000 && window.Utils) {
        window.Utils.warnLargeData(text.length, 50000)
      }

      // Word count
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0)
      wordCount.textContent = words.length

      // Character count
      charCount.textContent = text.length
      charNoSpaceCount.textContent = text.replace(/\s/g, "").length

      // Sentence count
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      sentenceCount.textContent = sentences.length

      // Paragraph count
      const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0)
      paragraphCount.textContent = paragraphs.length

      // Reading time (200 words per minute)
      const minutes = Math.ceil(words.length / 200)
      readingTime.textContent = minutes + " min"
    }

    const debouncedUpdateStats = window.Utils ? window.Utils.debounce(updateStats, 300) : updateStats

    inputText.addEventListener("input", debouncedUpdateStats)

    clearBtn.addEventListener("click", () => {
      inputText.value = ""
      updateStats()
    })

    copyBtn.addEventListener("click", () => {
      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(inputText.value)
      } else {
        // Fallback
        const textarea = document.createElement("textarea")
        textarea.value = inputText.value
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }
    })
  })
})()
