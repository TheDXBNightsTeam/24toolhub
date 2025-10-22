// Find and Replace Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText")
    const findText = document.getElementById("findText")
    const replaceText = document.getElementById("replaceText")
    const outputText = document.getElementById("outputText")
    const matchCount = document.getElementById("matchCount")
    const replaceCount = document.getElementById("replaceCount")

    window.findAndReplace = async function() {
      const text = inputText.value
      const find = findText.value
      
      if (!text || !find) {
        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "en"
        const msg = lang === "en" ? "Please enter text and search term" : "الرجاء إدخال النص ومصطلح البحث"
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(msg)
        } else {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification(msg, 'success');
          } else {
            alert(msg);
          }
        }
        return
      }

      const caseSensitive = document.getElementById("caseSensitive").checked
      const wholeWord = document.getElementById("wholeWord").checked
      const useRegex = document.getElementById("useRegex").checked
      const replace = replaceText.value

      try {
        // Show loading for large texts
        if (text.length > 100000 && window.Utils) {
          window.Utils.showLoadingIndicator()
        }

        let pattern
        if (useRegex) {
          pattern = new RegExp(find, caseSensitive ? "g" : "gi")
        } else {
          let escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          if (wholeWord) {
            escapedFind = "\\b" + escapedFind + "\\b"
          }
          pattern = new RegExp(escapedFind, caseSensitive ? "g" : "gi")
        }

        const matches = text.match(pattern)
        const count = matches ? matches.length : 0

        // For very large texts, process in chunks
        let result
        if (text.length > 100000) {
          await new Promise(resolve => setTimeout(resolve, 0))
          result = text.replace(pattern, replace)
        } else {
          result = text.replace(pattern, replace)
        }

        matchCount.textContent = count
        replaceCount.textContent = count
        outputText.value = result

        if (window.Utils) {
          window.Utils.hideLoadingIndicator()
        }
      } catch (e) {
        if (window.Utils) {
          window.Utils.hideLoadingIndicator()
          window.Utils.showNotification("Error: Invalid regex pattern")
        } else {
          alert("Error: Invalid regex pattern")
        }
      }
    }

    window.highlightMatches = function() {
      const text = inputText.value
      const find = findText.value
      
      if (!text || !find) {
        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "en"
        const msg = lang === "en" ? "Please enter text and search term" : "الرجاء إدخال النص ومصطلح البحث"
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(msg)
        } else {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification(msg, 'success');
          } else {
            alert(msg);
          }
        }
        return
      }

      const caseSensitive = document.getElementById("caseSensitive").checked
      const wholeWord = document.getElementById("wholeWord").checked
      const useRegex = document.getElementById("useRegex").checked

      try {
        let pattern
        if (useRegex) {
          pattern = new RegExp(find, caseSensitive ? "g" : "gi")
        } else {
          let escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          if (wholeWord) {
            escapedFind = "\\b" + escapedFind + "\\b"
          }
          pattern = new RegExp(escapedFind, caseSensitive ? "g" : "gi")
        }

        const matches = text.match(pattern)
        const count = matches ? matches.length : 0

        matchCount.textContent = count
        replaceCount.textContent = 0
        outputText.value = text
        
        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "en"
        const msg = lang === "en" ? `Found ${count} matches` : `تم العثور على ${count} تطابق`
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(msg)
        } else {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification(msg, 'success');
          } else {
            alert(msg);
          }
        }
      } catch (e) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Error: Invalid regex pattern")
        } else {
          alert("Error: Invalid regex pattern")
        }
      }
    }

    window.clearAll = function() {
      inputText.value = ""
      findText.value = ""
      replaceText.value = ""
      outputText.value = ""
      matchCount.textContent = "0"
      replaceCount.textContent = "0"
    }

    window.copyResult = function() {
      if (!outputText.value) {
        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "en"
        const msg = lang === "en" ? "No result to copy" : "لا توجد نتيجة للنسخ"
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(msg)
        }
        return
      }
      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(outputText.value)
      }
    }
  })
})()
