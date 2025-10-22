// Password Generator Tool Logic
;(() => {
  'use strict';
  
  document.addEventListener("DOMContentLoaded", () => {
    window.updateLengthDisplay = () => {
      const length = document.getElementById("passwordLength").value
      document.getElementById("lengthDisplay").textContent = length
    }

    function getCurrentLanguage() {
      return localStorage.getItem("language") || "en"
    }

    window.generatePassword = () => {
      const length = Number.parseInt(document.getElementById("passwordLength").value)
      const includeUppercase = document.getElementById("includeUppercase").checked
      const includeLowercase = document.getElementById("includeLowercase").checked
      const includeNumbers = document.getElementById("includeNumbers").checked
      const includeSymbols = document.getElementById("includeSymbols").checked

      let charset = ""
      if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
      if (includeNumbers) charset += "0123456789"
      if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

      if (charset === "") {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification(
            getCurrentLanguage() === "en"
              ? "Please select at least one character type"
              : "الرجاء تحديد نوع حرف واحد على الأقل",
            "warning"
          );
        } else {
          alert(
            getCurrentLanguage() === "en"
              ? "Please select at least one character type"
              : "الرجاء تحديد نوع حرف واحد على الأقل"
          );
        }
        return
      }

      let password = ""
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length))
      }

      document.getElementById("generatedPassword").value = password
      updatePasswordStrength(password)
    }

    function updatePasswordStrength(password) {
      const indicator = document.getElementById("strengthIndicator")
      const text = document.getElementById("strengthText")

      let strength = 0
      if (password.length >= 8) strength++
      if (password.length >= 12) strength++
      if (password.length >= 16) strength++
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
      if (/\d/.test(password)) strength++
      if (/[^a-zA-Z0-9]/.test(password)) strength++

      const percentage = (strength / 6) * 100
      indicator.style.width = percentage + "%"

      if (strength <= 2) {
        indicator.style.backgroundColor = "#ef4444"
        text.textContent = getCurrentLanguage() === "en" ? "Weak" : "ضعيف"
      } else if (strength <= 4) {
        indicator.style.backgroundColor = "#f59e0b"
        text.textContent = getCurrentLanguage() === "en" ? "Medium" : "متوسط"
      } else {
        indicator.style.backgroundColor = "#10b981"
        text.textContent = getCurrentLanguage() === "en" ? "Strong" : "قوي"
      }
    }

    window.copyPassword = () => {
      const password = document.getElementById("generatedPassword")
      password.select()
      document.execCommand("copy")
      if (window.Utils && window.Utils.showNotification) {
        window.Utils.showNotification(
          getCurrentLanguage() === "en" ? "Password copied to clipboard!" : "تم نسخ كلمة المرور إلى الحافظة!",
          "success"
        );
      } else {
        alert(getCurrentLanguage() === "en" ? "Password copied to clipboard!" : "تم نسخ كلمة المرور إلى الحافظة!");
      }
    }

    window.generatePassword()
  })
})()
