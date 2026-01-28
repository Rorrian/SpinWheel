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
  const palette = [
    { r: 215, g: 37, b: 11 },   // #D7250B
    { r: 249, g: 91, b: 46 },   // #F95B2E
    { r: 243, g: 103, b: 16 },  // #F36710
    { r: 244, g: 146, b: 19 },  // #F49213
    { r: 249, g: 176, b: 63 },  // #F9B03F
    { r: 248, g: 194, b: 24 },  // #F8C218
    { r: 245, g: 217, b: 20 },  // #F5D914
    { r: 252, g: 246, b: 38 },  // #FCF626
    { r: 160, g: 219, b: 65 },  // #A0DB41
    { r: 130, g: 203, b: 28 },  // #82CB1C
    { r: 35, g: 174, b: 23 },   // #23AE17
    { r: 37, g: 178, b: 112 },  // #25B270
    { r: 122, g: 216, b: 226 }, // #7AD8E2
    { r: 19, g: 157, b: 185 },  // #139DB9
    { r: 49, g: 160, b: 215 },  // #31A0D7
    { r: 11, g: 96, b: 176 },   // #0B60B0
    { r: 43, g: 98, b: 199 },   // #2B62C7
    { r: 25, g: 48, b: 176 },   // #1930B0
    { r: 8, g: 20, b: 154 },    // #08149A
    { r: 108, g: 115, b: 231 }, // #6C73E7
    { r: 91, g: 49, b: 187 },   // #5B31BB
    { r: 70, g: 18, b: 162 },   // #4612A2
    { r: 107, g: 10, b: 151 },  // #6B0A97
    { r: 171, g: 42, b: 168 },  // #AB2AA8
    { r: 224, g: 124, b: 222 }, // #E07CDE
    { r: 190, g: 12, b: 124 },  // #BE0C7C
    { r: 214, g: 18, b: 94 },   // #D6125E
    { r: 239, g: 56, b: 120 },  // #EF3878
    { r: 232, g: 25, b: 51 },   // #E81933
  ]

  const shuffledPalette = [...palette].sort(() => Math.random() - 0.5)
  
  const newColors = []
  for (let i = 0; i < length; i++) {
    newColors.push(shuffledPalette[i % shuffledPalette.length])
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
