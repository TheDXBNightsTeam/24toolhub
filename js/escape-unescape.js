(function() {
    'use strict';

    window.escapeText = function() {
        const input = document.getElementById('inputText').value;
        const escaped = input
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
        document.getElementById('outputText').value = escaped;
    };

    window.unescapeText = function() {
        const input = document.getElementById('inputText').value;
        const unescaped = input
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\');
        document.getElementById('outputText').value = unescaped;
    };
})();
