// IP Lookup Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const ipAddress = document.getElementById("ipAddress");
    const ipInfo = document.getElementById("ipInfo");
    const ipDetails = document.getElementById("ipDetails");

    async function lookupIP() {
      const ip = ipAddress.value.trim();
      
      if (!ip) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Please enter an IP address");
        } else {
          alert("Please enter an IP address");
        }
        return;
      }

      // Basic IP validation
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(ip)) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Please enter a valid IP address");
        } else {
          alert("Please enter a valid IP address");
        }
        return;
      }

      try {
        if (window.Utils && window.Utils.showLoadingIndicator) {
          window.Utils.showLoadingIndicator("Looking up IP address...");
        }

        // Using ipapi.co for IP lookup (free tier)
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        if (window.Utils && window.Utils.hideLoadingIndicator) {
          window.Utils.hideLoadingIndicator();
        }

        if (data.error) {
          throw new Error(data.reason || 'Failed to lookup IP address');
        }

        displayIPInfo(data);

      } catch (error) {
        if (window.Utils && window.Utils.hideLoadingIndicator) {
          window.Utils.hideLoadingIndicator();
        }

        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Error: " + error.message);
        } else {
          alert("Error: " + error.message);
        }
      }
    }

    async function getMyIP() {
      try {
        if (window.Utils && window.Utils.showLoadingIndicator) {
          window.Utils.showLoadingIndicator("Getting your IP address...");
        }

        // Get user's IP address
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();

        if (window.Utils && window.Utils.hideLoadingIndicator) {
          window.Utils.hideLoadingIndicator();
        }

        ipAddress.value = data.ip;
        await lookupIP();

      } catch (error) {
        if (window.Utils && window.Utils.hideLoadingIndicator) {
          window.Utils.hideLoadingIndicator();
        }

        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Error getting your IP: " + error.message);
        } else {
          alert("Error getting your IP: " + error.message);
        }
      }
    }

    function displayIPInfo(data) {
      const infoHTML = `
        <div style="display: grid; gap: 0.5rem; font-family: monospace; font-size: 0.875rem;">
          <div><strong>IP Address:</strong> <span style="color: var(--accent-primary);">${data.ip || 'N/A'}</span></div>
          <div><strong>Country:</strong> <span style="color: var(--accent-primary);">${data.country_name || 'N/A'}</span></div>
          <div><strong>Region:</strong> <span style="color: var(--accent-primary);">${data.region || 'N/A'}</span></div>
          <div><strong>City:</strong> <span style="color: var(--accent-primary);">${data.city || 'N/A'}</span></div>
          <div><strong>Postal Code:</strong> <span style="color: var(--accent-primary);">${data.postal || 'N/A'}</span></div>
          <div><strong>ISP:</strong> <span style="color: var(--accent-primary);">${data.org || 'N/A'}</span></div>
          <div><strong>Timezone:</strong> <span style="color: var(--accent-primary);">${data.timezone || 'N/A'}</span></div>
          <div><strong>Coordinates:</strong> <span style="color: var(--accent-primary);">${data.latitude || 'N/A'}, ${data.longitude || 'N/A'}</span></div>
          <div><strong>ASN:</strong> <span style="color: var(--accent-primary);">${data.asn || 'N/A'}</span></div>
          <div><strong>Organization:</strong> <span style="color: var(--accent-primary);">${data.org || 'N/A'}</span></div>
        </div>
      `;

      ipDetails.innerHTML = infoHTML;
      ipInfo.style.display = "block";
    }

    function clearResults() {
      ipAddress.value = "";
      ipInfo.style.display = "none";
      ipDetails.innerHTML = "";
    }

    // Global functions for buttons
    window.lookupIP = lookupIP;
    window.getMyIP = getMyIP;
    window.clearResults = clearResults;

    // Auto-lookup on Enter key
    if (ipAddress) {
      ipAddress.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          lookupIP();
        }
      });
    }
  });
})();