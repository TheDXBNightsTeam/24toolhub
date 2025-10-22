// Slug Generator Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText");
    const lowercase = document.getElementById("lowercase");
    const removeAccents = document.getElementById("removeAccents");
    const removeSpecialChars = document.getElementById("removeSpecialChars");
    const separator = document.getElementById("separator");
    const slugOutput = document.getElementById("slugOutput");
    const slugResult = document.getElementById("slugResult");

    function generateSlug() {
      const text = inputText.value.trim();
      
      if (!text) {
        slugOutput.style.display = "none";
        return;
      }

      let slug = text;

      // Remove accents
      if (removeAccents.checked) {
        slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }

      // Convert to lowercase
      if (lowercase.checked) {
        slug = slug.toLowerCase();
      }

      // Remove special characters
      if (removeSpecialChars.checked) {
        // Keep only letters, numbers, spaces, and basic punctuation
        slug = slug.replace(/[^\w\s-]/g, '');
      }

      // Replace spaces and multiple separators with single separator
      const sep = separator.value;
      if (sep) {
        slug = slug.replace(/[\s_-]+/g, sep);
      } else {
        slug = slug.replace(/[\s_-]+/g, '');
      }

      // Remove leading/trailing separators
      if (sep) {
        slug = slug.replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), '');
      }

      // Remove multiple consecutive separators
      if (sep) {
        slug = slug.replace(new RegExp(`${sep}+`, 'g'), sep);
      }

      slugResult.textContent = slug;
      slugOutput.style.display = "block";
    }

    // Auto-generate on input change
    if (inputText) {
      const debouncedGenerate = window.Utils ? window.Utils.debounce(generateSlug, 300) : generateSlug;
      inputText.addEventListener("input", debouncedGenerate);
    }

    // Regenerate when options change
    [lowercase, removeAccents, removeSpecialChars, separator].forEach(element => {
      if (element) {
        element.addEventListener("change", generateSlug);
      }
    });

    // Global functions for buttons
    window.generateSlug = generateSlug;

    window.clearSlug = () => {
      inputText.value = "";
      slugOutput.style.display = "none";
      slugResult.textContent = "";
    };

    window.copySlug = () => {
      const slug = slugResult.textContent;
      if (!slug) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No slug to copy");
        } else {
          alert("No slug to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(slug);
      } else {
        navigator.clipboard.writeText(slug).then(() => {
          alert('URL slug copied to clipboard!');
        });
      }
    };

    // Initial generation
    generateSlug();
  });
})();
