// Checksum Calculator Tool Logic
;(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("inputText")
    const checksumOutput = document.getElementById("checksumOutput")

    inputText.addEventListener("input", async () => {
      const text = inputText.value
      if (!text) {
        checksumOutput.innerHTML = '<p style="color: #888;">Enter text to calculate checksum</p>'
        return
      }

      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

      checksumOutput.innerHTML = `<p style="color: #10b981; word-break: break-all; font-family: monospace;">${hashHex}</p>`
    })
  })
})()
