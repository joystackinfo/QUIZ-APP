document.addEventListener("DOMContentLoaded", () => {

// --- DEFAULTS ---
let questions = []
let username = ""
let currentQuestionIndex = 0
let score = 0
let selectedCategory = ""

// --- DOM ELEMENTS ---
const usernameFormDiv = document.getElementById('username-form')
const usernameInput = document.getElementById('username-input')
const usernameSubmitBtn = document.getElementById('submit-username')

const categorySelectionDiv = document.getElementById('category-selection')
const quizContainerDiv = document.getElementById('quiz-container')
const questionElement = document.getElementById('question')
const answerButtonElement = document.getElementById('answer-btn')
const nextButton = document.getElementById('next-btn')
const progressBar = document.getElementById('progress-bar')

const scoreNotification = document.getElementById('score-notification')
const scoreText = document.getElementById('score-text')
const playAgainBtn = document.getElementById('play-again')
const changeCategoryBtn = document.getElementById('change-category')

const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn')
const leaderboardContainer = document.getElementById('leaderboard-container')
const leaderboardBackButton = document.getElementById('leaderboard-back-btn')

const selectedCategoryText = document.getElementById('selected-category')
const backToUsernameBtn = document.getElementById('back-to-username')

const notificationDiv = document.getElementById('notification')
const quizBackBtn = document.getElementById('quiz-back-btn')

// --- INITIAL STATE ---
leaderboardContainer.style.display = 'none'
viewLeaderboardBtn.style.display = 'none'
leaderboardBackButton.style.display = 'none'

// --- NOTIFICATION ---
function showNotification(message) {
  notificationDiv.textContent = message
  notificationDiv.classList.add("show")

  setTimeout(() => {
    notificationDiv.classList.remove("show")
  }, 3000)
}

// --- FETCH QUESTIONS ---
async function fetchQuestionsAndStart() {
  try {
    const response = await fetch(`http://localhost:3000/api/questions?category=${selectedCategory}`)
    const data = await response.json()

    questions = data

    if (!questions.length) {
      showNotification("No questions found")
      return
    }

    startQuiz()

  } catch (error) {
    console.error(error)
    showNotification("Error loading questions")
  }
}

// --- START QUIZ ---
function startQuiz() {
  currentQuestionIndex = 0
  score = 0

  categorySelectionDiv.style.display = 'none'
  quizContainerDiv.style.display = 'block'
  scoreNotification.style.display = 'none'
  leaderboardContainer.style.display = 'none'

  showQuestion()
}

// --- BACK BUTTON ---
quizBackBtn.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--
    showQuestion()
  } else {
    quizContainerDiv.style.display = 'none'
    categorySelectionDiv.style.display = 'block'
  }
})

// --- SHOW QUESTION ---
function showQuestion() {
  resetState()

  const currentQuestion = questions[currentQuestionIndex]

  questionElement.textContent =
    `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button')
    button.textContent = answer.text
    button.classList.add('btn')

    if (answer.correct) {
      button.dataset.correct = "true"
    }

    button.addEventListener('click', selectAnswer)
    answerButtonElement.appendChild(button)
  })
}

// --- RESET ---
function resetState() {
  nextButton.style.display = 'none'
  answerButtonElement.innerHTML = ""
}

// --- SELECT ANSWER ---
function selectAnswer(e) {
  const correct = e.target.dataset.correct === "true"

  if (correct) score++

  Array.from(answerButtonElement.children).forEach(btn => {
    btn.disabled = true
  })

  nextButton.style.display = 'inline-block'
}

// --- NEXT ---
nextButton.addEventListener('click', () => {
  currentQuestionIndex++

  if (currentQuestionIndex < questions.length) {
    showQuestion()
  } else {
    showScore()
  }
})

// --- SCORE ---
function showScore() {
  quizContainerDiv.style.display = 'none'
  scoreNotification.style.display = 'block'
  scoreText.textContent = `You scored ${score * 5} points!`

  viewLeaderboardBtn.style.display = 'inline-block'
}

// --- USERNAME ---
usernameSubmitBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim()

  if (!name) {
    showNotification("Enter your name")
    return
  }

  username = name
  usernameFormDiv.style.display = 'none'
  categorySelectionDiv.style.display = 'block'
})

// --- CATEGORY ---
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedCategory = btn.dataset.category

    selectedCategoryText.textContent =
      `Selected: ${selectedCategory}`

    fetchQuestionsAndStart()
  })
})

// --- BACK TO USERNAME ---
backToUsernameBtn.addEventListener('click', () => {
  categorySelectionDiv.style.display = 'none'
  usernameFormDiv.style.display = 'block'
})

// --- LEADERBOARD ---
viewLeaderboardBtn.addEventListener('click', () => {
  leaderboardContainer.style.display = 'block'
  scoreNotification.style.display = 'none'
})

leaderboardBackButton.addEventListener('click', () => {
  leaderboardContainer.style.display = 'none'
  scoreNotification.style.display = 'block'
})

})