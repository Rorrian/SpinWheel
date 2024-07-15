document.addEventListener("DOMContentLoaded", () => {
  initWheel()
  initOptions()
})

const initWheel = () => {
  const wheel = document.querySelector(".wheel")
  const spinBtn = document.querySelector(".spinBtn")

  spinBtn.addEventListener("click", () => {
    let value = Math.ceil(Math.random() * 3600)
    wheel.style.transform = `rotate(${value}deg)`
  })
}

const initOptions = () => {
  const setBtn = document.querySelector(".setBtn")

  setBtn.addEventListener("click", () => {
    const options = document.querySelector("textarea").value.split(",")

    if (options.length < 2 || options.some((option) => option === "")) {
      showError("The number of options must be at least 2!")
    } else {
      clearError()
      updateWheelOptions(options)
    }
  })
}

const updateWheelOptions = (options) => {
  const wheelEl = document.querySelector(".wheel")
  wheelEl.innerHTML = ""

  options.forEach((option, index) => {
    const optionEl = createOptionEl(option, index, options.length)
    wheelEl.appendChild(optionEl)
  })
}

const createOptionEl = (option, index, totalOptions) => {
  const optionEl = document.createElement("div")
  optionEl.classList.add("number")
  styleOption(optionEl, index, totalOptions)

  const optionText = document.createElement("span")
  optionText.textContent = option
  optionEl.appendChild(optionText)

  return optionEl
}

const styleOption = (el, index, totalOptions) => {
  el.style.setProperty("--i", index)
  el.style.setProperty("--clr", generateRandomColor())
  el.style.setProperty("--total", totalOptions)

  const angle = (-68 / 3) * totalOptions + 544 / 3
  let top, left, textAngle

  if (isMobileDevice()) {
    // TODO: Поправить отображение на мобилке
    // const values = [
    //   { N: 2, Y: 50 },
    //   { N: 5, Y: 35 },
    //   { N: 8, Y: 10 },
    //   { N: 14, Y: -5 },
    //   { N: 20, Y: -10 },
    // ]

    // function calculateY(N) {
    //   if (N < 8) {
    //     return -5 * N + 60
    //   } else {
    //     return -2.5 * N + 30
    //   }
    // }

    // values.forEach(({ N, Y }) => {
    //   let calculatedY = calculateY(N)
    //   console.log(
    //     `For N = ${N}, expected Y = ${Y}, calculated Y = ${calculatedY}`
    //   )
    // })
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

    top = -5 * totalOptions + 60
    left = (23 / 18) * totalOptions - 320 / 9 + 5
    textAngle = totalOptions > 14 ? 75 : (5 / 3) * totalOptions + 155 / 3 + 5
  } else {
    top = -15 * totalOptions + (totalOptions < 8 ? 110 : 120)
    left = (5 / 3) * totalOptions - (totalOptions < 8 ? 70 : 35)
    textAngle = calcTextAngle(totalOptions, false)
  }

  el.style.setProperty("--angle", `${angle}%`)
  el.style.setProperty("--top", `${top}px`)
  el.style.setProperty("--left", `${left}px`)
  el.style.setProperty("--textAngle", `${textAngle}deg`)
}

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent)
}

const calcTextAngle = (totalOptions, isMobile) => {
  if (isMobile) {
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

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const showError = (message) => {
  clearError()

  const controls = document.querySelector(".controls")
  const errorEl = document.createElement("p")

  errorEl.classList.add("error")
  errorEl.textContent = message
  controls.appendChild(errorEl)
}

const clearError = () => {
  const errorElement = document.querySelector(".error")

  if (errorElement) {
    errorElement.remove()
  }
}
