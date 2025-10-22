// Cron Parser Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const cronExpression = document.getElementById("cronExpression");
    const cronOutput = document.getElementById("cronOutput");
    const cronResult = document.getElementById("cronResult");
    const cronError = document.getElementById("cronError");
    const errorMessage = document.getElementById("errorMessage");

    function parseCron() {
      const expression = cronExpression.value.trim();
      
      if (!expression) {
        cronOutput.style.display = "none";
        cronError.style.display = "none";
        return;
      }

      try {
        // Hide previous results
        cronOutput.style.display = "none";
        cronError.style.display = "none";

        // Parse the cron expression
        const parts = expression.split(/\s+/);
        
        if (parts.length < 5 || parts.length > 6) {
          throw new Error("Cron expression must have 5 or 6 fields");
        }

        const isExtended = parts.length === 6;
        const fields = isExtended ? 
          ['second', 'minute', 'hour', 'day', 'month', 'weekday'] :
          ['minute', 'hour', 'day', 'month', 'weekday'];

        let result = `<div style="margin-bottom: 1rem;">
          <div style="font-size: 1.25rem; font-weight: bold; color: var(--accent-primary, #3b82f6); margin-bottom: 0.5rem;">
            ${expression}
          </div>
          <div style="color: var(--text-secondary, #888);">
            ${isExtended ? 'Extended (6-field)' : 'Standard (5-field)'} cron expression
          </div>
        </div>`;

        result += '<div style="margin-bottom: 1rem;"><h4 style="color: var(--accent-primary, #3b82f6); margin-bottom: 0.5rem;">Field Analysis:</h4>';

        parts.forEach((part, index) => {
          const fieldName = fields[index];
          const explanation = explainField(fieldName, part);
          result += `<div style="margin-bottom: 0.5rem; padding: 0.5rem; background: var(--bg-secondary, #1a1a1a); border-radius: 0.25rem;">
            <strong>${fieldName}:</strong> ${part} → ${explanation}
          </div>`;
        });

        result += '</div>';

        // Add human-readable description
        const description = generateDescription(parts, isExtended);
        result += `<div style="margin-bottom: 1rem;">
          <h4 style="color: var(--accent-primary, #3b82f6); margin-bottom: 0.5rem;">Description:</h4>
          <div style="background: var(--bg-secondary, #1a1a1a); padding: 1rem; border-radius: 0.5rem; border-left: 4px solid var(--success, #10b981);">
            ${description}
          </div>
        </div>`;

        // Add next run times (simplified)
        result += `<div style="margin-bottom: 1rem;">
          <h4 style="color: var(--accent-primary, #3b82f6); margin-bottom: 0.5rem;">Examples:</h4>
          <div style="background: var(--bg-secondary, #1a1a1a); padding: 1rem; border-radius: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">• This expression will run at the specified intervals</div>
            <div style="margin-bottom: 0.5rem;">• Use a cron scheduler to execute tasks</div>
            <div>• Test with a cron expression validator for accuracy</div>
          </div>
        </div>`;

        cronResult.innerHTML = result;
        cronOutput.style.display = "block";

      } catch (error) {
        errorMessage.textContent = error.message;
        cronError.style.display = "block";
        cronOutput.style.display = "none";
      }
    }

    function explainField(fieldName, value) {
      const fieldRanges = {
        'second': '0-59',
        'minute': '0-59',
        'hour': '0-23',
        'day': '1-31',
        'month': '1-12',
        'weekday': '0-7 (0 or 7 = Sunday)'
      };

      if (value === '*') {
        return `Any ${fieldName} (${fieldRanges[fieldName]})`;
      }

      if (value.includes(',')) {
        return `Specific values: ${value}`;
      }

      if (value.includes('-')) {
        return `Range: ${value}`;
      }

      if (value.includes('/')) {
        return `Step values: ${value}`;
      }

      if (value === '?') {
        return 'No specific value (used in day fields)';
      }

      if (value === 'L') {
        return 'Last day of month or week';
      }

      if (value.includes('W')) {
        return 'Nearest weekday';
      }

      if (value.includes('#')) {
        return 'Nth occurrence of weekday';
      }

      return `Specific value: ${value}`;
    }

    function generateDescription(parts, isExtended) {
      const [minute, hour, day, month, weekday] = isExtended ? parts.slice(1) : parts;
      
      let description = "This cron expression will run ";

      // Analyze the pattern
      if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
        description += "every minute";
      } else if (minute !== '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
        description += `every hour at minute ${minute}`;
      } else if (minute !== '*' && hour !== '*' && day === '*' && month === '*' && weekday === '*') {
        description += `daily at ${hour}:${minute.padStart(2, '0')}`;
      } else if (minute !== '*' && hour !== '*' && day === '*' && month === '*' && weekday !== '*') {
        description += `on weekdays at ${hour}:${minute.padStart(2, '0')}`;
      } else if (minute !== '*' && hour !== '*' && day !== '*' && month === '*' && weekday === '*') {
        description += `monthly on day ${day} at ${hour}:${minute.padStart(2, '0')}`;
      } else {
        description += "according to the specified schedule";
      }

      return description;
    }

    // Auto-parse on input change
    if (cronExpression) {
      const debouncedParse = window.Utils ? window.Utils.debounce(parseCron, 500) : parseCron;
      cronExpression.addEventListener("input", debouncedParse);
    }

    // Global functions for buttons
    window.parseCron = parseCron;

    window.clearCron = () => {
      cronExpression.value = "";
      cronOutput.style.display = "none";
      cronError.style.display = "none";
      cronResult.innerHTML = "";
      errorMessage.textContent = "";
    };

    window.copyCron = () => {
      const result = cronResult.textContent;
      if (!result) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No result to copy");
        } else {
          alert("No result to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(result);
      } else {
        navigator.clipboard.writeText(result).then(() => {
          alert('Cron analysis copied to clipboard!');
        });
      }
    };

    window.setCronExample = (example) => {
      cronExpression.value = example;
      parseCron();
    };

    // Initial parse
    parseCron();
  });
})();
