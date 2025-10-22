// Unix Timestamp Converter Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const timestamp = document.getElementById("timestamp");
    const dateTime = document.getElementById("dateTime");
    const timezone = document.getElementById("timezone");
    const timestampOutput = document.getElementById("timestampOutput");
    const timestampResult = document.getElementById("timestampResult");

    function convertTimestamp() {
      const timestampValue = timestamp.value;
      const dateTimeValue = dateTime.value;
      
      if (!timestampValue && !dateTimeValue) {
        timestampOutput.style.display = "none";
        return;
      }

      let result = "";

      if (timestampValue) {
        // Convert timestamp to date
        const ts = parseInt(timestampValue);
        if (isNaN(ts)) {
          result = "Invalid timestamp. Please enter a valid number.";
        } else {
          const date = new Date(ts * 1000);
          if (isNaN(date.getTime())) {
            result = "Invalid timestamp. Please enter a valid Unix timestamp.";
          } else {
            result = formatTimestampResult(ts, date);
          }
        }
      } else if (dateTimeValue) {
        // Convert date to timestamp
        const date = new Date(dateTimeValue);
        if (isNaN(date.getTime())) {
          result = "Invalid date. Please select a valid date and time.";
        } else {
          const ts = Math.floor(date.getTime() / 1000);
          result = formatDateResult(date, ts);
        }
      }

      timestampResult.innerHTML = result;
      timestampOutput.style.display = "block";
    }

    function formatTimestampResult(timestamp, date) {
      const timezoneValue = timezone.value;
      let displayDate = date;

      // Handle timezone conversion
      if (timezoneValue !== 'UTC' && timezoneValue !== 'local') {
        // For specific timezones, we'll show UTC and local time
        displayDate = date;
      }

      const utcString = date.toUTCString();
      const localString = date.toString();
      const isoString = date.toISOString();

      return `
        <div style="margin-bottom: 1rem;">
          <div style="font-size: 1.25rem; font-weight: bold; color: var(--accent-primary, #3b82f6); margin-bottom: 0.5rem;">
            Unix Timestamp: ${timestamp}
          </div>
        </div>
        
        <div style="display: grid; gap: 1rem;">
          <div style="background: var(--bg-secondary, #1a1a1a); padding: 1rem; border-radius: 0.5rem;">
            <div style="font-weight: bold; color: var(--success, #10b981); margin-bottom: 0.5rem;">UTC Time:</div>
            <div style="font-family: monospace;">${utcString}</div>
          </div>
          
          <div style="background: var(--bg-secondary, #1a1a1a); padding: 1rem; border-radius: 0.5rem;">
            <div style="font-weight: bold; color: var(--warning, #f59e0b); margin-bottom: 0.5rem;">Local Time:</div>
            <div style="font-family: monospace;">${localString}</div>
          </div>
          
          <div style="background: var(--bg-secondary, #1a1a1a); padding: 1rem; border-radius: 0.5rem;">
            <div style="font-weight: bold; color: var(--error, #ef4444); margin-bottom: 0.5rem;">ISO 8601:</div>
            <div style="font-family: monospace;">${isoString}</div>
          </div>
        </div>
      `;
    }

    function formatDateResult(date, timestamp) {
      const utcString = date.toUTCString();
      const localString = date.toString();
      const isoString = date.toISOString();

      return `
        <div style="margin-bottom: 1rem;">
          <div style="font-size: 1.25rem; font-weight: bold; color: var(--accent-primary, #3b82f6); margin-bottom: 0.5rem;">
            Unix Timestamp: ${timestamp}
          </div>
        </div>
        
        <div style="display: grid; gap: 1rem;">
          <div style="background: var(--bg-secondary, #1a1a1a); padding: 1rem; border-radius: 0.5rem;">
            <div style="font-weight: bold; color: var(--success, #10b981); margin-bottom: 0.5rem;">UTC Time:</div>
            <div style="font-family: monospace;">${utcString}</div>
          </div>
          
          <div style="background: var(--bg-secondary, #1a1a1a); padding: 1rem; border-radius: 0.5rem;">
            <div style="font-weight: bold; color: var(--warning, #f59e0b); margin-bottom: 0.5rem;">Local Time:</div>
            <div style="font-family: monospace;">${localString}</div>
          </div>
          
          <div style="background: var(--bg-secondary, #1a1a1a); padding: 1rem; border-radius: 0.5rem;">
            <div style="font-weight: bold; color: var(--error, #ef4444); margin-bottom: 0.5rem;">ISO 8601:</div>
            <div style="font-family: monospace;">${isoString}</div>
          </div>
        </div>
      `;
    }

    // Auto-convert on input change
    if (timestamp) {
      const debouncedConvert = window.Utils ? window.Utils.debounce(convertTimestamp, 300) : convertTimestamp;
      timestamp.addEventListener("input", debouncedConvert);
    }

    if (dateTime) {
      dateTime.addEventListener("change", convertTimestamp);
    }

    if (timezone) {
      timezone.addEventListener("change", convertTimestamp);
    }

    // Global functions for buttons
    window.convertTimestamp = convertTimestamp;

    window.useCurrentTime = () => {
      const now = new Date();
      const currentTimestamp = Math.floor(now.getTime() / 1000);
      timestamp.value = currentTimestamp;
      
      // Set the datetime-local input
      const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
      dateTime.value = localDateTime.toISOString().slice(0, 16);
      
      convertTimestamp();
    };

    window.clearTimestamp = () => {
      timestamp.value = "";
      dateTime.value = "";
      timestampOutput.style.display = "none";
      timestampResult.innerHTML = "";
    };

    window.copyResult = () => {
      const result = timestampResult.textContent;
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
          alert('Timestamp conversion copied to clipboard!');
        });
      }
    };

    window.setTimestampExample = (exampleTimestamp) => {
      timestamp.value = exampleTimestamp;
      dateTime.value = "";
      convertTimestamp();
    };

    // Initial conversion
    convertTimestamp();
  });
})();
