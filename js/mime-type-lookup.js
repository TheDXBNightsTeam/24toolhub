// MIME Type Lookup Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const extension = document.getElementById("extension");
    const mimeOutput = document.getElementById("mimeOutput");
    const mimeResult = document.getElementById("mimeResult");

    // Comprehensive MIME type database
    const mimeTypes = {
      // Images
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'webp': 'image/webp',
      'bmp': 'image/bmp',
      'ico': 'image/x-icon',
      'tiff': 'image/tiff',
      'tif': 'image/tiff',
      
      // Documents
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'txt': 'text/plain',
      'rtf': 'application/rtf',
      'odt': 'application/vnd.oasis.opendocument.text',
      'ods': 'application/vnd.oasis.opendocument.spreadsheet',
      'odp': 'application/vnd.oasis.opendocument.presentation',
      
      // Web
      'html': 'text/html',
      'htm': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'xml': 'application/xml',
      'php': 'application/x-httpd-php',
      'asp': 'application/x-aspx',
      'aspx': 'application/x-aspx',
      
      // Archives
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      'tar': 'application/x-tar',
      'gz': 'application/gzip',
      
      // Audio
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'flac': 'audio/flac',
      'aac': 'audio/aac',
      'm4a': 'audio/mp4',
      
      // Video
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv',
      'webm': 'video/webm',
      'mkv': 'video/x-matroska',
      
      // Fonts
      'ttf': 'font/ttf',
      'otf': 'font/otf',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'eot': 'application/vnd.ms-fontobject',
      
      // Other
      'exe': 'application/x-msdownload',
      'dmg': 'application/x-apple-diskimage',
      'iso': 'application/x-iso9660-image',
      'bin': 'application/octet-stream',
      'dat': 'application/octet-stream'
    };

    function lookupMimeType() {
      const ext = extension.value.trim().toLowerCase();
      
      if (!ext) {
        mimeOutput.style.display = "none";
        return;
      }

      // Remove leading dot if present
      const cleanExt = ext.startsWith('.') ? ext.substring(1) : ext;
      
      const mimeType = mimeTypes[cleanExt];
      
      if (mimeType) {
        const category = getMimeCategory(mimeType);
        const description = getMimeDescription(mimeType);
        
        mimeResult.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <div style="font-size: 1.25rem; font-weight: bold; color: var(--accent-primary, #3b82f6); margin-bottom: 0.5rem;">
              ${mimeType}
            </div>
            <div style="color: var(--text-secondary, #888); margin-bottom: 0.5rem;">
              <strong>Extension:</strong> .${cleanExt}
            </div>
            <div style="color: var(--text-secondary, #888); margin-bottom: 0.5rem;">
              <strong>Category:</strong> ${category}
            </div>
            <div style="color: var(--text-secondary, #888);">
              <strong>Description:</strong> ${description}
            </div>
          </div>
        `;
      } else {
        mimeResult.innerHTML = `
          <div style="color: var(--warning, #f59e0b);">
            <div style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">
              MIME Type Not Found
            </div>
            <div style="margin-bottom: 0.5rem;">
              <strong>Extension:</strong> .${cleanExt}
            </div>
            <div style="margin-bottom: 0.5rem;">
              <strong>Suggested:</strong> application/octet-stream
            </div>
            <div style="font-size: 0.875rem; color: var(--text-secondary, #888);">
              This extension is not in our database. You may need to use a generic MIME type or add it to your server configuration.
            </div>
          </div>
        `;
      }
      
      mimeOutput.style.display = "block";
    }

    function getMimeCategory(mimeType) {
      const [type] = mimeType.split('/');
      return type.charAt(0).toUpperCase() + type.slice(1);
    }

    function getMimeDescription(mimeType) {
      const descriptions = {
        'image/jpeg': 'JPEG image format',
        'image/png': 'PNG image format',
        'image/gif': 'GIF image format',
        'image/svg+xml': 'SVG vector image',
        'image/webp': 'WebP image format',
        'text/html': 'HTML document',
        'text/css': 'CSS stylesheet',
        'application/javascript': 'JavaScript file',
        'application/json': 'JSON data file',
        'application/pdf': 'PDF document',
        'application/zip': 'ZIP archive',
        'audio/mpeg': 'MP3 audio file',
        'video/mp4': 'MP4 video file',
        'text/plain': 'Plain text file'
      };
      
      return descriptions[mimeType] || 'File format';
    }

    // Auto-lookup on input change
    if (extension) {
      const debouncedLookup = window.Utils ? window.Utils.debounce(lookupMimeType, 300) : lookupMimeType;
      extension.addEventListener("input", debouncedLookup);
    }

    // Global functions for buttons
    window.lookupMimeType = lookupMimeType;

    window.clearMimeType = () => {
      extension.value = "";
      mimeOutput.style.display = "none";
      mimeResult.innerHTML = "";
    };

    window.copyMimeType = () => {
      const result = mimeResult.textContent;
      if (!result) {
        if (window.Utils && window.Utils.showNotification) {
          window.Utils.showNotification("No MIME type to copy");
        } else {
          alert("No MIME type to copy");
        }
        return;
      }

      // Extract just the MIME type from the result
      const mimeTypeMatch = result.match(/^[^\s]+/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[0] : result;
      
      if (window.Utils && window.Utils.copyToClipboard) {
        window.Utils.copyToClipboard(mimeType);
      } else {
        navigator.clipboard.writeText(mimeType).then(() => {
          alert('MIME type copied to clipboard!');
        });
      }
    };

    // Initial lookup
    lookupMimeType();
  });
})();
