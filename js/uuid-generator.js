// UUID Generator Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const uuidCount = document.getElementById("uuidCount");
    const output = document.getElementById("output");

    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    function generateUUIDs() {
      const count = parseInt(uuidCount.value) || 1;
      
      if (count < 1 || count > 100) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("Please enter a number between 1 and 100");
        } else {
          alert("Please enter a number between 1 and 100");
        }
        return;
      }

      const uuids = [];
      for (let i = 0; i < count; i++) {
        uuids.push(generateUUID());
      }

      output.value = uuids.join('\n');
    }

    // Global functions for buttons
    window.generateUUIDs = generateUUIDs;

    window.copyOutput = () => {
      if (!output.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No UUIDs to copy");
        } else {
          alert("No UUIDs to copy");
        }
        return;
      }

      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(output.value);
      } else {
        navigator.clipboard.writeText(output.value).then(() => {
          alert('UUIDs copied to clipboard!');
        });
      }
    };

    window.downloadOutput = () => {
      if (!output.value) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No UUIDs to download");
        } else {
          alert("No UUIDs to download");
        }
        return;
      }

      const blob = new Blob([output.value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uuids-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    window.clearOutput = () => {
      output.value = "";
    };

    // Generate initial UUID
    generateUUIDs();
  });
})();
