export const querySelectorWithError = (selector, errorMessage) => {
  const element = document.querySelector(selector)
  if (!element) {
    printErrorToConsole(errorMessage)
  }
  return element
}

export const getItemsFromTextarea = () => {
  const textarea = querySelectorWithError("textarea", "Textarea not found!")
  return textarea ? textarea.value.split(/[,\n]+/) : []
}

export const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)

  return { r, g, b }
}

export const generateColors = (length) => {
  const newColors = []
  for (let i = 0; i < length; i++) {
    newColors.push(generateRandomColor())
  }

  return newColors
}

export const convertToRad = (deg) => {
  return deg * (Math.PI / 180.0)
}

export const getRandomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getPercent = (input, min, max) => {
  return ((input - min) * 100) / (max - min) / 100
}

export const easeOutSine = (x) => {
  return Math.sin((x * Math.PI) / 2)
}

export const printErrorToConsole = (message) => {
  console.error("Error: ", message)
}

export const showError = (message) => {
  clearError()

  const controls = document.querySelector(".controls")
  if (!controls) {
    printErrorToConsole("Controls element not found!")
    return
  }

  const errorElement = document.createElement("p")
  errorElement.classList.add("error")
  errorElement.textContent = message
  controls.appendChild(errorElement)
}

export const clearError = () => {
  const errorElement = document.querySelector(".error")
  if (errorElement) {
    errorElement.remove()
  }
}
