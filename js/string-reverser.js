const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

function reverseText() {
  const text = inputText.value;
  if (!text) {
    // Assuming a Utils.showToast function exists
    if (window.Utils && window.Utils.showToast) {
        Utils.showToast('Please enter some text first');
    }
    return;
  }

  const reverseType = document.querySelector('input[name="reverseType"]:checked').value;
  let result = '';

  switch(reverseType) {
    case 'text':
      result = text.split('').reverse().join('');
      break;
    case 'words':
      result = text.split(' ').reverse().join(' ');
      break;
    case 'lines':
      result = text.split('\n').reverse().join('\n');
      break;
  }

  outputText.value = result;
}

function clearAll() {
  inputText.value = '';
  outputText.value = '';
}

function copyResult() {
  if (!outputText.value) {
    // Assuming a Utils.showToast function exists
    if (window.Utils && window.Utils.showToast) {
        Utils.showToast('No result to copy');
    }
    return;
  }
  // Assuming a Utils.copyToClipboard function exists
  if (window.Utils && window.Utils.copyToClipboard) {
    Utils.copyToClipboard(outputText.value);
  }
}
