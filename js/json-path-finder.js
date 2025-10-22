;(() => {
  function findPath() {
    const jsonData = document.getElementById("jsonData")
    const jsonPath = document.getElementById("jsonPath")
    const pathOutput = document.getElementById("pathOutput")

    const data = jsonData.value
    const path = jsonPath.value

    if (!data || !path) {
      pathOutput.innerHTML = '<p style="color: #888;">Enter JSON data and path</p>'
      return
    }

    try {
      const obj = JSON.parse(data)
      const keys = path.split(".")
      let result = obj

      for (const key of keys) {
        result = result[key]
        if (result === undefined) break
      }

      pathOutput.innerHTML = `<p style="color: #10b981;">${JSON.stringify(result, null, 2)}</p>`
    } catch (error) {
      pathOutput.innerHTML = `<p style="color: #ef4444;">Error: ${error.message}</p>`
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const jsonData = document.getElementById("jsonData")
    const jsonPath = document.getElementById("jsonPath")

    jsonData.addEventListener("input", findPath)
    jsonPath.addEventListener("input", findPath)
  })
})()
