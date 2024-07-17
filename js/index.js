import {
  applyElementStyle,
  clearError,
  generateRandomColor,
  isMobileDevice,
  querySelectorWithError,
  showError,
} from "./utils.js"

const calcTextAngle = (totalOptions) => {
  switch (totalOptions) {
    case 2:
    case 3:
      return 47
    case 6:
      return 60
    case 7:
      return 65
    default:
      return 70
  }
}

const calcMobileStyles = (totalOptions) => {
  // TODO: Поправить отображение для мобильных устройств
  
  // Вычисленные параметры:
  // 2 -
  // top: 50px;
  // left: -35px;
  // textAngle: 45deg;

  // 5 -
  // top: 35px;
  // left: -30px;
  // textAngle: 55deg;

  // 8 -
  // top: 10px;
  // left: -20px;
  // textAngle: 70deg;

  // 14 -
  // top: -5px;
  // left: -7px;
  // textAngle: 80deg;

  // 20 -
  // top: -10px;
  // left: -0px;
  // textAngle: 85deg;

  const top = -5 * totalOptions + 60
  const left = (23 / 18) * totalOptions - 320 / 9 + 5
  const textAngle =
    totalOptions > 14 ? 75 : (5 / 3) * totalOptions + 155 / 3 + 5

  return {
    "--top": `${top}px`,
    "--left": `${left}px`,
    "--textAngle": `${textAngle}deg`,
  }
}

const calcDesktopStyles = (totalOptions) => {
  const top = -15 * totalOptions + (totalOptions < 8 ? 110 : 120)
  const left = (5 / 3) * totalOptions - (totalOptions < 8 ? 70 : 35)
  const textAngle = calcTextAngle(totalOptions)

  return {
    "--top": `${top}px`,
    "--left": `${left}px`,
    "--textAngle": `${textAngle}deg`,
  }
}

const styleOption = (el, index, totalOptions) => {
  const commonStyles = {
    "--i": index,
    "--clr": generateRandomColor(),
    "--total": totalOptions,
    "--angle": `${(-68 / 3) * totalOptions + 544 / 3}%`,
  }

  let customStyles
  if (isMobileDevice()) {
    customStyles = calcMobileStyles(totalOptions)
  } else {
    customStyles = calcDesktopStyles(totalOptions)
  }

  applyElementStyle(el, { ...commonStyles, ...customStyles })
}

const createOptionElement = (option, index, totalOptions) => {
  const optionElement = document.createElement("div")
  optionElement.classList.add("number")
  styleOption(optionElement, index, totalOptions)

  const optionText = document.createElement("span")
  optionText.textContent = option
  optionElement.appendChild(optionText)

  return optionElement
}

const updateWheelOptions = (options) => {
  const wheelElement = querySelectorWithError(
    ".wheel",
    "Wheel element not found!"
  )
  if (!wheelElement) return

  wheelElement.innerHTML = ""

  options.forEach((option, index) => {
    const optionElement = createOptionElement(option, index, options.length)
    wheelElement.appendChild(optionElement)
  })
}

const spinWheel = () => {
  const wheel = querySelectorWithError(".wheel", "Wheel element not found!")
  if (!wheel) return

  let value = Math.ceil(Math.random() * 3600)
  wheel.style.transform = `rotate(${value}deg)`
}

const setOptions = () => {
  const optionsInput = querySelectorWithError("textarea", "Textarea not found!")
  if (!optionsInput) return

  const options = optionsInput.value
    .split(/[,\n]+/)
    .map((option) => option.trim())
  const validOptions = options.filter((option) => option !== "")

  if (validOptions.length < 2) {
    showError("The number of options must be at least 2!")
  } else {
    clearError()
    updateWheelOptions(validOptions)
  }
}

const initSpinBtn = () => {
  const spinBtn = querySelectorWithError(".spinBtn", "Spin button not found!")
  if (spinBtn) {
    spinBtn.addEventListener("click", spinWheel)
  }
}

const initSetBtn = () => {
  const setBtn = querySelectorWithError(".setBtn", "Set button not found!")
  if (setBtn) {
    setBtn.addEventListener("click", setOptions)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initSpinBtn()
  initSetBtn()
})
