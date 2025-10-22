(function() {
    'use strict';

    const urlInput = document.getElementById('urlInput');
    const urlOutput = document.getElementById('urlOutput');

    urlInput.addEventListener('input', () => {
        const urlString = urlInput.value;
        const currentLang = Utils.getCurrentLanguage();
        
        if (!urlString) {
            urlOutput.innerHTML = `<p style="color: #888;">${currentLang === 'ar' ? 'أدخل عنوان URL للتحليل' : 'Enter a URL to parse'}</p>`;
            return;
        }

        try {
            const url = new URL(urlString);
            let html = '<div style="line-height: 1.8;">';
            html += `<p><strong>${currentLang === 'ar' ? 'البروتوكول' : 'Protocol'}:</strong> ${url.protocol}</p>`;
            html += `<p><strong>${currentLang === 'ar' ? 'المضيف' : 'Host'}:</strong> ${url.host}</p>`;
            html += `<p><strong>${currentLang === 'ar' ? 'اسم المضيف' : 'Hostname'}:</strong> ${url.hostname}</p>`;
            html += `<p><strong>${currentLang === 'ar' ? 'المنفذ' : 'Port'}:</strong> ${url.port || (currentLang === 'ar' ? 'افتراضي' : 'default')}</p>`;
            html += `<p><strong>${currentLang === 'ar' ? 'المسار' : 'Pathname'}:</strong> ${url.pathname}</p>`;
            html += `<p><strong>${currentLang === 'ar' ? 'البحث' : 'Search'}:</strong> ${url.search || (currentLang === 'ar' ? 'لا يوجد' : 'none')}</p>`;
            html += `<p><strong>${currentLang === 'ar' ? 'التجزئة' : 'Hash'}:</strong> ${url.hash || (currentLang === 'ar' ? 'لا يوجد' : 'none')}</p>`;
            html += '</div>';
            
            urlOutput.innerHTML = html;
        } catch (error) {
            urlOutput.innerHTML = `<p style="color: #ef4444;">${currentLang === 'ar' ? 'عنوان URL غير صالح' : 'Invalid URL'}</p>`;
        }
    });
})();
