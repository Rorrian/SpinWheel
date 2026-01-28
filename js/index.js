import {
  clearError,
  convertToRad,
  easeOutSine,
  generateColors,
  getItemsFromTextarea,
  getPercent,
  getRandomRange,
  querySelectorWithError,
  showError,
} from "./utils.js"

const confettiColors = [
  '#D7250B', '#F95B2E', '#F36710', '#F9B03F', '#F8C218', '#F5D914',
  '#FCF626', '#A0DB41', '#82CB1C', '#23AE17', '#7AD8E2', '#31A0D7',
  '#0B60B0', '#6C73E7', '#5B31BB', '#AB2AA8', '#E07CDE', '#EF3878'
]

class Confetti {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = Math.random() * 10 + 5
    this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)]
    this.speedX = Math.random() * 6 - 3
    this.speedY = Math.random() * -15 - 5
    this.gravity = 0.5
    this.rotation = Math.random() * 360
    this.rotationSpeed = Math.random() * 10 - 5
    this.opacity = 1
    this.shape = Math.floor(Math.random() * 3) // 0: rect, 1: circle, 2: triangle
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.speedY += this.gravity
    this.rotation += this.rotationSpeed
    this.opacity -= 0.008
    return this.opacity > 0
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    
    if (this.shape === 0) {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2)
    } else if (this.shape === 1) {
      ctx.beginPath()
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.moveTo(0, -this.size / 2)
      ctx.lineTo(this.size / 2, this.size / 2)
      ctx.lineTo(-this.size / 2, this.size / 2)
      ctx.closePath()
      ctx.fill()
    }
    
    ctx.restore()
  }
}

let confettiCanvas = null
let confettiCtx = null
let confettiParticles = []
let confettiAnimationId = null

const createConfettiCanvas = () => {
  if (confettiCanvas) return
  
  confettiCanvas = document.createElement('canvas')
  confettiCanvas.id = 'confettiCanvas'
  confettiCanvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `
  document.body.appendChild(confettiCanvas)
  confettiCanvas.width = window.innerWidth
  confettiCanvas.height = window.innerHeight
  confettiCtx = confettiCanvas.getContext('2d')
  
  window.addEventListener('resize', () => {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth
      confettiCanvas.height = window.innerHeight
    }
  })
}

const launchConfetti = () => {
  createConfettiCanvas()
  
  // Создаем конфетти из разных точек
  const centerX = window.innerWidth / 2
  const bottomY = window.innerHeight
  
  // Добавляем партии конфетти
  for (let i = 0; i < 100; i++) {
    confettiParticles.push(new Confetti(
      centerX + (Math.random() - 0.5) * 200,
      bottomY
    ))
  }
  
  // Запускаем из боковых точек
  setTimeout(() => {
    for (let i = 0; i < 50; i++) {
      confettiParticles.push(new Confetti(100, bottomY))
      confettiParticles.push(new Confetti(window.innerWidth - 100, bottomY))
    }
  }, 100)
  
  if (!confettiAnimationId) {
    animateConfetti()
  }
}

const animateConfetti = () => {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height)
  
  confettiParticles = confettiParticles.filter(p => {
    p.draw(confettiCtx)
    return p.update()
  })
  
  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(animateConfetti)
  } else {
    confettiAnimationId = null
  }
}

// Инициализация глобальных переменных
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const width = document.getElementById("canvas").width
const height = document.getElementById("canvas").height

const centerX = width / 2
const centerY = height / 2
const radius = width / 2

let currentDeg = 0
let speed = 0
let maxRotation = 0
let startDegForAnimation = 0 // Начальный угол для расчета прогресса анимации
let pause = true
let isSpinning = false // Флаг для отслеживания активной анимации выбора
let items = getItemsFromTextarea()
let step = 360 / items.length
let colors = generateColors(items.length)
let itemDegs = {}

// Переменные для перетаскивания
let isDragging = false
let lastAngle = 0
let lastTime = 0
let angularVelocity = 0
let lastAngles = [] // Массив для отслеживания последних углов для расчета инерции

// Основные функции

// Вычисление угла между центром колеса и позицией курсора
const getAngle = (x, y) => {
  const rect = canvas.getBoundingClientRect()
  const canvasX = x - rect.left
  const canvasY = y - rect.top
  
  const dx = canvasX - centerX
  const dy = canvasY - centerY
  
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

// Обновление отображения секций
const createWheel = () => {
  items = getItemsFromTextarea()

  if (items.length < 2) {
    showError("The number of options must be at least 2!")
  } else {
    clearError()

    colors =
      items.length !== colors.length ? generateColors(items.length) : colors
    drawWheel()
    resetWinnerName()
  }
}

const drawWheel = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawCircle()
  drawSections()
}

const resetWinnerName = () => {
  const winnerName = querySelectorWithError(
    ".winnerName",
    "Winner's name not found!"
  )
  if (winnerName) {
    winnerName.innerHTML = "?"
  }
}

// Отрисовка колеса
const drawCircle = () => {
  // Начинаем отрисовку
  ctx.beginPath()
  // Рисуем окружность с заданным центром, радиусом и начальным и конечным углами в радианах
  ctx.arc(centerX, centerY, radius, convertToRad(0), convertToRad(360))
  // Задаем цвет для границы круга
  ctx.fillStyle = `rgb(33,33,33)`
  // Добавляем линию от последней точки пути до заданных координат. Это закрывает текущий путь, начав новый.
  ctx.lineTo(centerX, centerY)
  // Выполняем заливку окружности ранее указанным цветом
  ctx.fill()
}

// Отрисовка секций в цикле + вывод победиля в текстовый блок на странице
const drawSections = () => {
  let startDeg = currentDeg
  step = 360 / items.length

  items.forEach((item, i) => {
    // Определяем область которая относится к текущей секции
    const endDeg = startDeg + step
    // Определяем цвет заливки секции
    const color = colors[i]
    const colorStyle = `rgb(${color.r},${color.g},${color.b})`

    drawSection(startDeg, endDeg, color, colorStyle)
    drawText(item, startDeg, endDeg, color)

    // Сохраняем углы начала и конца текущей секции
    itemDegs[item] = { startDeg, endDeg }

    // Проверка победителя
    // Если текущая секция находится на позиции в заданном диапазоне, то определяем ее как "победившую"
    if (isWinner(startDeg, endDeg)) {
      const winnerName = querySelectorWithError(
        ".winnerName",
        "Block for winner's name not found!"
      )
      if (winnerName) {
        const previousWinner = winnerName.innerHTML
        winnerName.innerHTML = item
        // Добавляем анимацию при изменении победителя
        if (previousWinner !== item && item !== "?") {
          winnerName.classList.remove("winner-animate")
          void winnerName.offsetWidth // Trigger reflow
          winnerName.classList.add("winner-animate")
        }
      }
    }

    startDeg += step
  })
}

const drawSection = (startDeg, endDeg, color, colorStyle) => {
  // Начинаем отрисовку внешней части секции
  ctx.beginPath()
  // Рисуем дугу с заданными параметрами (центр, радиус, начальный и конечный углы)
  ctx.arc(
    centerX,
    centerY,
    radius - 2,
    convertToRad(startDeg),
    convertToRad(endDeg)
  )
  // Определяем цвет заливки для внешней части кольца секции(более темный чем основной цвет секции)
  const colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`
  ctx.fillStyle = colorStyle2
  // Добавляем линию от последней точки пути до заданных координат. Это закрывает текущий путь, начав новый
  ctx.lineTo(centerX, centerY)
  // Выполняем заливку секции
  ctx.fill()

  // Начинаем отрисовку внутренней части секции - аналогично
  ctx.beginPath()
  ctx.arc(
    centerX,
    centerY,
    radius - 30,
    convertToRad(startDeg),
    convertToRad(endDeg)
  )
  ctx.fillStyle = colorStyle
  ctx.lineTo(centerX, centerY)
  ctx.fill()
}

const drawText = (item, startDeg, endDeg, color) => {
  // Сохраняем текущее состояние контекста рисования
  ctx.save()
  // Переносим начало координат в центр кольца
  ctx.translate(centerX, centerY)
  // Поворачиваем координатную систему на промежуточное значение угла между начальным и конечным углами сектора
  ctx.rotate(convertToRad((startDeg + endDeg) / 2))
  ctx.textAlign = "center"
  // Задаем цвет в зависимости от фона для лучшей читабельности
  ctx.fillStyle =
    color.r > 150 || color.g > 150 || color.b > 150 ? "#000" : "#fff"
  ctx.font = "bold 16px serif"
  // Отрисовываем конкретный текст по заданным координатам
  ctx.fillText(item, 130, 10)
  // Очищаем ранее сохраненный контекст
  ctx.restore()
}

// Определяем победителя - сектор на который указывает стрелка (справа, 0 градусов)
const isWinner = (startDeg, endDeg) => {
  // Нормализуем углы в диапазон 0-360
  let normStart = ((startDeg % 360) + 360) % 360
  let normEnd = ((endDeg % 360) + 360) % 360
  
  // Указатель находится справа на 0 градусов
  const pointerAngle = 0
  
  // Обрабатываем случай перехода через 0 (например 350 -> 10)
  if (normEnd < normStart) {
    // Сектор пересекает 0 градусов
    return pointerAngle >= normStart || pointerAngle < normEnd
  }
  
  return pointerAngle >= normStart && pointerAngle < normEnd
}

// Анимация колеса
const animate = () => {
  if (pause && !isDragging) return

  // Если идет перетаскивание, не применяем автоматическую анимацию
  if (!isDragging) {
    // Проверяем, идет ли анимация выбора победителя
    if (isSpinning) {
      // Рассчитываем прогресс от начальной точки до целевой
      const totalDistance = Math.abs(maxRotation - startDegForAnimation)
      const currentDistance = Math.abs(currentDeg - startDegForAnimation)
      const remainingDistance = Math.abs(maxRotation - currentDeg)
      
      // Прогресс от 0 до 1
      const progress = totalDistance > 0 ? currentDistance / totalDistance : 1
      
      // Направление движения
      const direction = maxRotation > startDegForAnimation ? 1 : -1
      
      // Скорость уменьшается по мере приближения к цели
      speed = easeOutSine(1 - progress) * 20 * direction
      
      // Защита от слишком маленькой скорости (чтобы не застрять)
      if (Math.abs(speed) < 0.5 && remainingDistance > 1) {
        speed = 0.5 * direction
      }
      
      // Проверяем, достигли ли цели
      if (remainingDistance < 1) {
        currentDeg = maxRotation
        speed = 0
        isSpinning = false
        pause = true

        const setBtn = document.querySelector(".setBtn")
        const spinBtn = document.querySelector(".centerCircle")
        setBtn.disabled = false
        spinBtn.disabled = false
        canvas.style.cursor = "grab"
        
        drawWheel()
        
        launchConfetti()
        
        return
      }
      
      // Обновляем угол
      currentDeg += speed
    }
  }

  // Отрисовываем текущее состояние колеса
  drawWheel()

  // Рекурсивно вызываем текущий метод
  window.requestAnimationFrame(animate)
}

const spinWheel = () => {
  // Проверка превращения вращения
  if (isSpinning) return

  // Обнуляем параметры
  currentDeg = 0
  startDegForAnimation = 0
  
  // Обновляем отображение секций
  createWheel()
  drawWheel()

  // Рандомно выбираем элемент и определяем значение вращения
  maxRotation = calcMaxRotation(items, itemDegs)

  // Обнуляем параметры
  itemDegs = {}
  pause = false
  isSpinning = true
  speed = 0
  
  // Делаем кнопки недоступными
  const setBtn = document.querySelector(".setBtn")
  const spinBtn = document.querySelector(".centerCircle")
  setBtn.disabled = true
  spinBtn.disabled = true
  canvas.style.cursor = "not-allowed"

  // Запускаем анимацию
  animate()
}

const calcMaxRotation = (items, itemDegs) => {
  let randomIndex = Math.floor(Math.random() * items.length)
  let selectedItem = items[randomIndex]

  return 360 * 6 - itemDegs[selectedItem].endDeg + 10
}

const initSpinBtn = () => {
  const spinBtn = querySelectorWithError(
    ".centerCircle",
    "Spin button not found!"
  )
  if (spinBtn) {
    spinBtn.addEventListener("click", spinWheel)
  }
}

const initSetBtn = () => {
  const setBtn = querySelectorWithError(".setBtn", "Set button not found!")
  if (setBtn) {
    setBtn.addEventListener("click", createWheel)
  }
}

// Обработчики для перетаскивания колеса
const handleDragStart = (x, y) => {
  // Блокируем перетаскивание во время анимации
  if (isSpinning) return
  
  isDragging = true
  pause = false
  lastAngle = getAngle(x, y)
  lastTime = Date.now()
  lastAngles = []
  angularVelocity = 0
  
  const setBtn = document.querySelector(".setBtn")
  const spinBtn = document.querySelector(".centerCircle")
  setBtn.disabled = true
  spinBtn.disabled = true
}

const handleDragMove = (x, y) => {
  if (!isDragging) return
  
  const currentAngle = getAngle(x, y)
  const currentTime = Date.now()
  const deltaAngle = currentAngle - lastAngle
  const deltaTime = currentTime - lastTime
  
  // Обрабатываем переход через 180/-180 градусов
  let adjustedDelta = deltaAngle
  if (deltaAngle > 180) adjustedDelta = deltaAngle - 360
  if (deltaAngle < -180) adjustedDelta = deltaAngle + 360
  
  currentDeg += adjustedDelta
  
  // Сохраняем последние углы для расчета скорости
  lastAngles.push({ angle: adjustedDelta, time: deltaTime })
  if (lastAngles.length > 5) lastAngles.shift()
  
  lastAngle = currentAngle
  lastTime = currentTime
  
  // Отрисовываем во время перетаскивания
  drawWheel()
}

const handleDragEnd = () => {
  if (!isDragging) return
  
  isDragging = false
  
  // Вычисляем среднюю угловую скорость на основе последних движений
  if (lastAngles.length > 0) {
    const totalAngle = lastAngles.reduce((sum, item) => sum + item.angle, 0)
    const totalTime = lastAngles.reduce((sum, item) => sum + item.time, 0)
    angularVelocity = totalTime > 0 ? totalAngle / totalTime * 24 : 0
  }
  
  if (Math.abs(angularVelocity) < 0.5) {
    angularVelocity = 0
    pause = true
    const setBtn = document.querySelector(".setBtn")
    const spinBtn = document.querySelector(".centerCircle")
    setBtn.disabled = false
    spinBtn.disabled = false
    return
  }
  
  // Запускаем процесс выбора победителя
  drawWheel()
  
  // Проверяем что itemDegs заполнен
  if (Object.keys(itemDegs).length === 0) {
    console.error("Ошибка: itemDegs пуст")
    pause = true
    return
  }
  
  // Запоминаем начальную позицию
  startDegForAnimation = currentDeg
  
  // Определяем направление вращения
  const direction = angularVelocity > 0 ? 1 : -1
  
  // Рандомно выбираем элемент
  const randomSpins = getRandomRange(4, 6)
  const randomIndex = Math.floor(Math.random() * items.length)
  const selectedItem = items[randomIndex]
  
  // Рассчитываем финальную позицию
  // Для правильного расчета нужно учесть текущую позицию и добавить обороты
  const spinsAngle = 360 * randomSpins * direction
  const targetSectorAngle = 360 - (itemDegs[selectedItem].endDeg % 360) + 10
  maxRotation = currentDeg + spinsAngle + (targetSectorAngle * direction)
  
  // Устанавливаем флаги
  isSpinning = true
  pause = false
  speed = 0
  canvas.style.cursor = "not-allowed"
  
  // Запускаем анимацию
  animate()
}

const initDragging = () => {
  // События мыши
  canvas.addEventListener("mousedown", (e) => {
    handleDragStart(e.clientX, e.clientY)
  })
  
  document.addEventListener("mousemove", (e) => {
    handleDragMove(e.clientX, e.clientY)
  })
  
  document.addEventListener("mouseup", () => {
    handleDragEnd()
  })
  
  // Тач-события для мобильных устройств
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleDragStart(touch.clientX, touch.clientY)
  })
  
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleDragMove(touch.clientX, touch.clientY)
  })
  
  canvas.addEventListener("touchend", (e) => {
    e.preventDefault()
    handleDragEnd()
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initSpinBtn()
  initSetBtn()
  initDragging()
  drawWheel()
})
