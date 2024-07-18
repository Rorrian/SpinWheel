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
let maxRotation = getRandomRange(360 * 3, 360 * 6)
let pause = false
let items = getItemsFromTextarea()
let step = 360 / items.length
let colors = generateColors(items.length)
let itemDegs = {}

// Основные функции

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
      if (winnerName) winnerName.innerHTML = item
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

const isWinner = (startDeg, endDeg) =>
  startDeg % 360 < 360 &&
  startDeg % 360 > 270 &&
  endDeg % 360 > 0 &&
  endDeg % 360 < 90

// Анимация колеса
const animate = () => {
  if (pause) return

  // Вычисляем текущую скорость вращения колеса(анимации) и задаем её
  speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20

  // Проверка для остановки анимации
  if (speed < 0.01) {
    speed = 0
    pause = true

    const setBtn = document.querySelector(".setBtn")
    const spinBtn = document.querySelector(".centerCircle")
    setBtn.disabled = false
    spinBtn.disabled = false
  }

  // Обновляем текущий угол поворота колеса
  currentDeg += speed

  // Отрисовываем текущее состояние колеса
  drawWheel()

  // Рекурсивно вызываем текущий метод
  window.requestAnimationFrame(animate)
}

const spinWheel = () => {
  // Проверка превращения вращения
  if (speed !== 0) return

  // Обнуляем параметры, чтобы новая анимация начиналась с нулевого значения вращения
  maxRotation = 0
  currentDeg = 0
  // Обновляем отображение секций
  createWheel()
  // Отрисовываем начальное состояние колеса с учетом обновленных данных
  drawWheel()

  // Рандомно выбираем элемент и определяем значение вращения в градусах до него
  maxRotation = calcMaxRotation(items, itemDegs)

  // Обнуляем параметры перед записью новых данных при следующем вращении
  itemDegs = {}
  pause = false
  // Делаем кнопки доступными для нажатия
  const setBtn = document.querySelector(".setBtn")
  const spinBtn = document.querySelector(".centerCircle")
  setBtn.disabled = true
  spinBtn.disabled = true

  // Запускаем анимацию вращения
  window.requestAnimationFrame(animate)
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

document.addEventListener("DOMContentLoaded", () => {
  initSpinBtn()
  initSetBtn()
  drawWheel()
})
