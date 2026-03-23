// --- DEFAULTS ---
let questions = []   // will be filled later from backend
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
const leaderboardTableBody = document.querySelector('#leaderboard-table tbody')
const leaderboardLoading = document.getElementById('leaderboard-loading')
const leaderboardBackButton = document.getElementById('leaderboard-back-btn')

const notificationDiv = document.getElementById('notification')


// --- NOTIFICATION FUNCTION ---
function showNotification(message) {

  if (!notificationDiv) return

  notificationDiv.textContent = message
  notificationDiv.classList.add("show")

  setTimeout(() => {
    notificationDiv.classList.remove("show")
  }, 3000)

}
// --- FETCH QUESTIONS FROM BACKEND ---
async function fetchQuestionsAndStart() {
  try {
    const response = await fetch(`/api/questions?category=${selectedCategory}`)
    const data = await response.json()

    questions = data

    if (!questions.length) {
      showNotification("No questions found for this category ")
      return
    }

    startQuiz()

  } catch (error) {
    console.error("Fetch error:", error)
    showNotification("Failed to load questions from the server. Please try again later.")
  }
}

// --- START QUIZ ---
function startQuiz() {

  currentQuestionIndex = 0
  score = 0

if (categorySelectionDiv) categorySelectionDiv.style.display = 'none'
if (scoreNotification) scoreNotification.style.display = 'none'
if (leaderboardContainer) leaderboardContainer.style.display = 'none'
if (viewLeaderboardBtn) viewLeaderboardBtn.style.display = 'none'
if (leaderboardBackButton) leaderboardBackButton.style.display = 'none'

  quizContainerDiv.style.display = 'block'
  nextButton.style.display = 'none'
   

  showNotification("Quiz started! Good luck!")

  showQuestion()

}


// --- SHOW QUESTION ---
function showQuestion() {

  resetState()

  const currentQuestion = questions[currentQuestionIndex]

  questionElement.style.opacity = 0

  setTimeout(() => {

    questionElement.textContent =
    `Question ${currentQuestionIndex + 1} of ${questions.length}: ${currentQuestion.question}`

    questionElement.style.opacity = 1

  }, 100)


  const answers = shuffleArray(currentQuestion.answers.slice())

  answers.forEach(answer => {

    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = answer.text
    button.classList.add('btn', 'answer-btn')
    if (answer.correct) {
      button.dataset.correct = 'true'
    }

    button.addEventListener('click', selectAnswer)

    answerButtonElement.appendChild(button)

  })

  updateProgress()

}


// --- RESET STATE ---
function resetState() {

  nextButton.style.display = 'none'

  answerButtonElement.innerHTML = ''

}

// --- SHUFFLE ARRAY ---
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]

  }

  return arr

}

// --- UPDATE PROGRESS BAR ---
function updateProgress() {

  const pct = Math.round((currentQuestionIndex / questions.length) * 100)

  if (progressBar) progressBar.style.width = `${pct}%`

}


// --- SELECT ANSWER ---
function selectAnswer(e) {

  const selectBtn = e.target
  const isCorrect = selectBtn.dataset.correct === 'true'
  if (isCorrect) {
    selectBtn.classList.add('correct','pulse')
    score++
  } else {

    selectBtn.classList.add('incorrect','shake')

  }

  Array.from(answerButtonElement.children).forEach(button => {

    if (button.dataset.correct === 'true') {

      button.classList.add('correct')

    }

    button.disabled = true

  })

  nextButton.style.display = 'inline-block'

  saveQuizState()

}


// --- NEXT QUESTION ---
function handleNextButton() {

  currentQuestionIndex++

  if (currentQuestionIndex < questions.length) {

    showQuestion()

  } else {

    showScore()

  }

}


// --- SHOW SCORE ACTION BUTTONS ---
function showScoreActions() {

  playAgainBtn.style.display = 'inline-block'
  changeCategoryBtn.style.display = 'inline-block'
  viewLeaderboardBtn.style.display = 'inline-block'
  leaderboardBackButton.style.display = 'none'

}


// --- SHOW FINAL SCORE ---
function showScore() {

  const points = score * 5

  scoreText.textContent = `You scored ${points} points!`

  scoreNotification.style.display = 'block'

  quizContainerDiv.style.display = 'none'

  answerButtonElement.innerHTML = ""

  showScoreActions()

}


// --- SAVE QUIZ STATE ---
function saveQuizState() {

  localStorage.setItem('quizState', JSON.stringify({
    username,
    currentQuestionIndex,
    score,
    category: selectedCategory

  }))

}


// --- RESTORE STATE ---
const savedState = JSON.parse(localStorage.getItem('quizState'))

if (savedState) {

  username = savedState.username
  currentQuestionIndex = savedState.currentQuestionIndex
  score = savedState.score
  selectedCategory = savedState.category

}


// --- EVENT LISTENERS ---
nextButton.addEventListener('click', handleNextButton)

playAgainBtn.addEventListener('click', () => {

  scoreNotification.style.display = 'none'

  startQuiz()

})

changeCategoryBtn.addEventListener('click', () => {

  scoreNotification.style.display = 'none'
  quizContainerDiv.style.display = 'none'
  leaderboardContainer.style.display = 'none'

  categorySelectionDiv.style.display = 'block'

  viewLeaderboardBtn.style.display = 'none'
  leaderboardBackButton.style.display = 'none'

})


// --- USERNAME SUBMIT ---
usernameSubmitBtn.addEventListener('click', () => {

  const inputName = usernameInput.value.trim()

  if (!inputName) {

    showNotification("Please enter your name to proceed.")

    return

  }

  username = inputName

  usernameFormDiv.classList.add("hide")

  setTimeout(() => {
    usernameFormDiv.style.display = 'none'
  }, 300)

  usernameInput.disabled = true

  categorySelectionDiv.style.display = 'block'

})


// --- CATEGORY SELECTION PLACEHOLDER ---
// (subjects will be added here later)

document.querySelectorAll(".category-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    selectedCategory = btn.dataset.category

    // later we will fetch questions here
    // fetch(`/api/questions?category=${selectedCategory}`)

    startQuiz()

  })

})