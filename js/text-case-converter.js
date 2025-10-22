const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

function convertToCase(caseType) {
  const text = inputText.value;
  if (!text) {
    if (window.Utils && window.Utils.showToast) {
        Utils.showToast('Please enter some text first');
    }
    return;
  }
  // Assumes convertCase function is globally available from another script (e.g., tools.js)
  outputText.value = convertCase(text, caseType);
}

function clearAll() {
  inputText.value = '';
  outputText.value = '';
}

function copyResult() {
  if (!outputText.value) {
    if (window.Utils && window.Utils.showToast) {
        Utils.showToast('No result to copy');
    }
    return;
  }
  if (window.Utils && window.Utils.copyToClipboard) {
    Utils.copyToClipboard(outputText.value);
  }
}
