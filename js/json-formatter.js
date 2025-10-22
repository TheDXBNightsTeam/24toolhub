// JSON Formatter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    window.formatJSON = () => {
      const input = document.getElementById("input").value.trim()
      const indent = document.getElementById("indent").value
      const errorMsg = document.getElementById("errorMessage")
      const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "en"

      // Input validation
      if (!input) {
        const msg = lang === "en" ? "Please enter JSON data" : "الرجاء إدخال بيانات JSON"
        errorMsg.style.color = "#ef4444"
        errorMsg.textContent = msg
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(msg, "error")
        }
        return
      }

      try {
        const parsed = JSON.parse(input)
        const spaces = indent === "tab" ? "\t" : Number.parseInt(indent)

        // Validate indent value
        if (indent !== "tab" && (isNaN(spaces) || spaces < 0 || spaces > 10)) {
          throw new Error(lang === "en" ? "Invalid indent value" : "قيمة مسافة بادئة غير صالحة")
        }

        const formatted = JSON.stringify(parsed, null, spaces)
        document.getElementById("output").value = formatted
        errorMsg.textContent = ""

        // Success notification
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(
            lang === "en" ? "JSON formatted successfully!" : "تم تنسيق JSON بنجاح!",
            "success",
          )
        }
      } catch (e) {
        errorMsg.style.color = "#ef4444"
        errorMsg.textContent = lang === "en" ? `Error: ${e.message}` : `خطأ: ${e.message}`
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(
            lang === "en" ? `Invalid JSON: ${e.message}` : `JSON غير صالح: ${e.message}`,
            "error",
          )
        }
        console.error("[v0] JSON formatting error:", e)
      }
    }

    window.minifyJSON = () => {
      const input = document.getElementById("input").value.trim()
      const errorMsg = document.getElementById("errorMessage")
      const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "en"

      // Input validation
      if (!input) {
        const msg = lang === "en" ? "Please enter JSON data" : "الرجاء إدخال بيانات JSON"
        errorMsg.style.color = "#ef4444"
        errorMsg.textContent = msg
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(msg, "error")
        }
        return
      }

      try {
        const parsed = JSON.parse(input)
        document.getElementById("output").value = JSON.stringify(parsed)
        errorMsg.textContent = ""

        // Success notification
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(
            lang === "en" ? "JSON minified successfully!" : "تم تصغير JSON بنجاح!",
            "success",
          )
        }
      } catch (e) {
        errorMsg.style.color = "#ef4444"
        errorMsg.textContent = lang === "en" ? `Error: ${e.message}` : `خطأ: ${e.message}`
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(
            lang === "en" ? `Invalid JSON: ${e.message}` : `JSON غير صالح: ${e.message}`,
            "error",
          )
        }
        console.error("[v0] JSON minification error:", e)
      }
    }

    window.validateJSON = () => {
      const input = document.getElementById("input").value.trim()
      const errorMsg = document.getElementById("errorMessage")
      const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "en"

      // Input validation
      if (!input) {
        const msg = lang === "en" ? "Please enter JSON data" : "الرجاء إدخال بيانات JSON"
        errorMsg.style.color = "#ef4444"
        errorMsg.textContent = msg
        return
      }

      try {
        JSON.parse(input)
        errorMsg.style.color = "#10b981"
        errorMsg.textContent = lang === "en" ? "✓ Valid JSON!" : "✓ JSON صالح!"
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(lang === "en" ? "JSON is valid!" : "JSON صالح!", "success")
        }
      } catch (e) {
        errorMsg.style.color = "#ef4444"
        errorMsg.textContent = lang === "en" ? `✗ Invalid JSON: ${e.message}` : `✗ JSON غير صالح: ${e.message}`
        console.error("[v0] JSON validation error:", e)
      }
    }

    window.copyOutput = () => {
      const output = document.getElementById("output")
      const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "en"

      if (!output.value) {
        const msg = lang === "en" ? "Nothing to copy" : "لا يوجد شيء للنسخ"
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(msg, "error")
        }
        return
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(output.value)
      } else {
        output.select()
        document.execCommand("copy")
        const msg = lang === "en" ? "Copied to clipboard!" : "تم النسخ إلى الحافظة!"
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(msg, "success");
        } else {
          alert(msg);
        }
      }
    }
  })
})()
