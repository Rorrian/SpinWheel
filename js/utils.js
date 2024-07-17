export const querySelectorWithError = (selector, errorMessage) => {
  const element = document.querySelector(selector)
  if (!element) {
    printErrorToConsole(errorMessage)
  }
  return element
}

export const applyElementStyle = (el, styles) => {
  Object.keys(styles).forEach((prop) => {
    el.style.setProperty(prop, styles[prop])
  })
}

export const isMobileDevice = () => {
  return window.matchMedia("(max-width: 767px)").matches
}

export const generateRandomColor = () => {
  let color = Math.floor(Math.random() * 16777215).toString(16)
  while (color.length < 6) {
    color = "0" + color
  }
  return `#${color}`
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
