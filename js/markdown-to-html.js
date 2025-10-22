// Markdown to HTML Converter Tool Logic
;(() => {
  'use strict';
  
  document.addEventListener("DOMContentLoaded", () => {
    const markdownInput = document.getElementById("markdownInput");
    const htmlOutput = document.getElementById("htmlOutput");
    const preview = document.getElementById("preview");

    function convertMarkdown() {
      const markdownText = markdownInput.value;
      
      if (!markdownText.trim()) {
        htmlOutput.value = "";
        preview.innerHTML = "";
        return;
      }

      try {
        const html = markdownToHtml(markdownText);
        htmlOutput.value = html;
        preview.innerHTML = html;
        
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('Markdown converted to HTML successfully!', 'success');
        }
      } catch (error) {
        htmlOutput.value = `Error: ${error.message}`;
        preview.innerHTML = `<p style="color: var(--error, #ef4444);">Error: ${error.message}</p>`;
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('Error converting Markdown to HTML', 'error');
        }
      }
    }

    function markdownToHtml(markdown) {
      let html = markdown;

      // Headers
      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

      // Bold and Italic
      html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // Strikethrough
      html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

      // Inline code
      html = html.replace(/`(.*?)`/g, '<code>$1</code>');

      // Code blocks
      html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

      // Links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

      // Images
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

      // Lists
      html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
      html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
      html = html.replace(/^\+ (.*$)/gim, '<li>$1</li>');
      html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

      // Wrap consecutive list items in ul/ol
      html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
        const lines = match.split('\n');
        let result = '';
        let inList = false;
        let isOrdered = false;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes('<li>')) {
            if (!inList) {
              // Check if it's an ordered list (starts with number)
              const originalLine = markdown.split('\n').find(l => l.trim() === line.replace(/<li>|<\/li>/g, '').trim());
              isOrdered = /^\d+\./.test(originalLine);
              result += isOrdered ? '<ol>' : '<ul>';
              inList = true;
            }
            result += line + '\n';
          } else {
            if (inList) {
              result += isOrdered ? '</ol>' : '</ul>';
              inList = false;
            }
            result += line + '\n';
          }
        }

        if (inList) {
          result += isOrdered ? '</ol>' : '</ul>';
        }

        return result;
      });

      // Blockquotes
      html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

      // Horizontal rules
      html = html.replace(/^---$/gim, '<hr>');
      html = html.replace(/^\*\*\*$/gim, '<hr>');
      html = html.replace(/^___$/gim, '<hr>');

      // Tables (basic support)
      const tableRegex = /^(\|.*\|)\n(\|[-\s|:]+\|)\n((?:\|.*\|\n?)*)/gm;
      html = html.replace(tableRegex, (match, header, separator, rows) => {
        const headerCells = header.split('|').slice(1, -1).map(cell => `<th>${cell.trim()}</th>`).join('');
        const rowLines = rows.trim().split('\n');
        const tableRows = rowLines.map(row => {
          const cells = row.split('|').slice(1, -1).map(cell => `<td>${cell.trim()}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        
        return `<table><thead><tr>${headerCells}</tr></thead><tbody>${tableRows}</tbody></table>`;
      });

      // Paragraphs
      html = html.replace(/\n\n/g, '</p><p>');
      html = '<p>' + html + '</p>';

      // Clean up empty paragraphs
      html = html.replace(/<p><\/p>/g, '');
      html = html.replace(/<p>\s*<\/p>/g, '');

      // Clean up paragraphs around block elements
      html = html.replace(/<p>(<h[1-6]>)/g, '$1');
      html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
      html = html.replace(/<p>(<ul>)/g, '$1');
      html = html.replace(/(<\/ul>)<\/p>/g, '$1');
      html = html.replace(/<p>(<ol>)/g, '$1');
      html = html.replace(/(<\/ol>)<\/p>/g, '$1');
      html = html.replace(/<p>(<blockquote>)/g, '$1');
      html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
      html = html.replace(/<p>(<pre>)/g, '$1');
      html = html.replace(/(<\/pre>)<\/p>/g, '$1');
      html = html.replace(/<p>(<hr>)/g, '$1');
      html = html.replace(/(<\/hr>)<\/p>/g, '$1');
      html = html.replace(/<p>(<table>)/g, '$1');
      html = html.replace(/(<\/table>)<\/p>/g, '$1');

      return html;
    }

    // Auto-convert on input change
    if (markdownInput) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertMarkdown, 500) : convertMarkdown;
      markdownInput.addEventListener("input", debouncedConvert);
    }

    // Global functions for buttons
    window.convertMarkdown = convertMarkdown;

    window.clearAll = () => {
      markdownInput.value = "";
      htmlOutput.value = "";
      preview.innerHTML = "";
    };

    window.copyOutput = () => {
      if (!htmlOutput.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification('No HTML output to copy', 'warning');
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(htmlOutput.value);
      } else {
        navigator.clipboard.writeText(htmlOutput.value).then(() => {
          if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification('HTML output copied to clipboard!', 'success');
          } else {
            alert('HTML output copied to clipboard!');
          }
        });
      }
    };

    // Initial conversion
    convertMarkdown();
    
    // Initialize tabs and FAQ
    initializeTabs();
    initializeFAQ();
  });
})();

// Initialize tabs functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

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