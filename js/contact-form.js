/**
 * Contact Form Handler
 * Handles form submission using Web3Forms service
 * Supports both English and Arabic languages
 * 
 * NOTE: This file is now optional since the form uses direct Web3Forms submission
 * The form in contact.html now submits directly to Web3Forms API
 */

;(() => {
  // This file is kept for backward compatibility
  // The form now uses direct Web3Forms submission via HTML form action
  
  const form = document.getElementById("contactForm")
  const formStatus = document.getElementById("formStatus")

  if (!form) return

  // Check if form has access_key configured
  const accessKeyInput = form.querySelector('input[name="access_key"]')
  if (accessKeyInput && accessKeyInput.value === "YOUR_ACCESS_KEY_HERE") {
    // Show configuration warning
    if (formStatus) {
      formStatus.style.display = "block"
      formStatus.style.backgroundColor = "var(--warning, #f59e0b)"
      formStatus.style.color = "white"
      formStatus.style.padding = "1rem"
      formStatus.style.borderRadius = "0.5rem"
      formStatus.style.marginTop = "1rem"
      formStatus.innerHTML = `
        <strong>⚠️ إعداد مطلوب:</strong> يرجى إضافة مفتاح Web3Forms في ملف contact.html<br>
        <small>راجع تعليمات الإعداد أدناه</small>
      `
    }
  }

  /**
   * Get current language
   */
  function getCurrentLanguage() {
    return document.documentElement.lang || "en"
  }

  /**
   * Show status message
   */
  function showStatus(message, type = "success") {
    formStatus.style.display = "block"
    formStatus.style.padding = "1rem"
    formStatus.style.borderRadius = "0.5rem"
    formStatus.style.marginTop = "1rem"

    if (type === "success") {
      formStatus.style.backgroundColor = "var(--success, #10b981)"
      formStatus.style.color = "white"
    } else if (type === "error") {
      formStatus.style.backgroundColor = "var(--error, #ef4444)"
      formStatus.style.color = "white"
    } else if (type === "loading") {
      formStatus.style.backgroundColor = "var(--accent-primary, #3b82f6)"
      formStatus.style.color = "white"
    }

    formStatus.textContent = message
  }

  /**
   * Hide status message
   */
  function hideStatus() {
    formStatus.style.display = "none"
  }

  /**
   * Validate form inputs
   */
  function validateForm(formData) {
    const lang = getCurrentLanguage()
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    // Check for empty fields
    if (!name || !email || !subject || !message) {
      const errorMsg = lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields"
      showStatus(errorMsg, "error")
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const errorMsg = lang === "ar" ? "يرجى إدخال عنوان بريد إلكتروني صالح" : "Please enter a valid email address"
      showStatus(errorMsg, "error")
      return false
    }

    // Check minimum message length
    if (message.length < 10) {
      const errorMsg =
        lang === "ar" ? "يجب أن تكون الرسالة 10 أحرف على الأقل" : "Message must be at least 10 characters long"
      showStatus(errorMsg, "error")
      return false
    }

    return true
  }

  /**
   * Submit form using Web3Forms
   */
  async function submitWithWeb3Forms(formData) {
    const lang = getCurrentLanguage()

    // Check if access key is configured
    if (WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
      const errorMsg =
        lang === "ar"
          ? "خطأ في الإعداد: يرجى تكوين مفتاح Web3Forms. احصل على مفتاح مجاني من https://web3forms.com"
          : "Configuration Error: Please configure Web3Forms access key. Get a free key at https://web3forms.com"
      showStatus(errorMsg, "error")
      return false
    }

    // Add access key to form data
    formData.append("access_key", WEB3FORMS_ACCESS_KEY)

    // Add additional metadata
    formData.append("subject", `24ToolHub Contact: ${formData.get("subject")}`)
    formData.append("from_name", "24ToolHub Contact Form")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        const successMsg =
          lang === "ar"
            ? "شكراً لك على رسالتك! سنتواصل معك قريباً."
            : "Thank you for your message! We will get back to you soon."
        showStatus(successMsg, "success")
        form.reset()

        // Hide message after 5 seconds
        setTimeout(hideStatus, 5000)
        return true
      } else {
        throw new Error(data.message || "Submission failed")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      const errorMsg =
        lang === "ar"
          ? "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."
          : "An error occurred while sending your message. Please try again."
      showStatus(errorMsg, "error")
      return false
    }
  }

  /**
   * Submit form using FormSubmit
   */
  async function submitWithFormSubmit(formData) {
    const lang = getCurrentLanguage()

    // Check if email is configured
    if (FORMSUBMIT_EMAIL === "YOUR_EMAIL@example.com") {
      const errorMsg =
        lang === "ar"
          ? "خطأ في الإعداد: يرجى تكوين عنوان البريد الإلكتروني في contact-form.js"
          : "Configuration Error: Please configure email address in contact-form.js"
      showStatus(errorMsg, "error")
      return false
    }

    try {
      const response = await fetch(`https://formsubmit.co/${FORMSUBMIT_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          _subject: `24ToolHub Contact: ${formData.get("subject")}`,
          _template: "table",
        }),
      })

      if (response.ok) {
        const successMsg =
          lang === "ar"
            ? "شكراً لك على رسالتك! سنتواصل معك قريباً."
            : "Thank you for your message! We will get back to you soon."
        showStatus(successMsg, "success")
        form.reset()

        // Hide message after 5 seconds
        setTimeout(hideStatus, 5000)
        return true
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      const errorMsg =
        lang === "ar"
          ? "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."
          : "An error occurred while sending your message. Please try again."
      showStatus(errorMsg, "error")
      return false
    }
  }

  /**
   * Handle form submission
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const lang = getCurrentLanguage()
    const formData = new FormData(form)

    // Validate form
    if (!validateForm(formData)) {
      return
    }

    // Show loading state
    const loadingMsg = lang === "ar" ? "جاري الإرسال..." : "Sending..."
    showStatus(loadingMsg, "loading")

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]')
    const originalBtnText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = lang === "ar" ? "جاري الإرسال..." : "Sending..."

    // Submit based on chosen method
    let success = false
    if (SUBMISSION_METHOD === "web3forms") {
      success = await submitWithWeb3Forms(formData)
    } else if (SUBMISSION_METHOD === "formsubmit") {
      success = await submitWithFormSubmit(formData)
    }

    // Re-enable submit button
    submitBtn.disabled = false
    submitBtn.textContent = originalBtnText
  })

  // Clear status message when user starts typing again
  const inputs = form.querySelectorAll("input, textarea")
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (formStatus.style.display === "block" && formStatus.style.backgroundColor.includes("244, 67, 54")) {
        // error color
        hideStatus()
      }
    })
  })
})()
