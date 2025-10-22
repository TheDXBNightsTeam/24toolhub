const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

function trimText() {
  let text = inputText.value;
  if (!text) {
    Utils.showToast('Please enter some text first');
    return;
  }

  const trimStart = document.getElementById('trimStart').checked;
  const trimEnd = document.getElementById('trimEnd').checked;
  const removeExtraSpaces = document.getElementById('removeExtraSpaces').checked;
  const removeEmptyLines = document.getElementById('removeEmptyLines').checked;

  let lines = text.split('\n');

  lines = lines.map(line => {
    if (trimStart) line = line.replace(/^\s+/, '');
    if (trimEnd) line = line.replace(/\s+$/, '');
    if (removeExtraSpaces) line = line.replace(/\s+/g, ' ');
    return line;
  });

  if (removeEmptyLines) {
    lines = lines.filter(line => line.trim().length > 0);
  }

  outputText.value = lines.join('\n');
}

function clearAll() {
  inputText.value = '';
  outputText.value = '';
}

function copyResult() {
  if (!outputText.value) {
    Utils.showToast('No result to copy');
    return;
  }
  Utils.copyToClipboard(outputText.value);
}
