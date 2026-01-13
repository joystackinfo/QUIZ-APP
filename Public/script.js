// --- IMPORT QUESTION SETS ---
import generalQuestions from "./generalknowledge.js";
import koreanentertainmentQuestions from "./koreanentertainment.js";

// --- DEFAULTS ---
let questions = generalQuestions;
let username = "";
let currentQuestionIndex = 0;
let score = 0;

// --- DOM ELEMENTS ---
const usernameFormDiv = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const usernameSubmitBtn = document.getElementById('submit-username');

const categorySelectionDiv = document.getElementById('category-selection');
const quizContainerDiv = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const answerButtonElement = document.getElementById('answer-btn');
const nextButton = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');

const scoreNotification = document.getElementById('score-notification');
const scoreText = document.getElementById('score-text');
const playAgainBtn = document.getElementById('play-again');
const changeCategoryBtn = document.getElementById('change-category');

const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
const leaderboardContainer = document.getElementById('leaderboard-container');
const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');
const leaderboardLoading = document.getElementById('leaderboard-loading');
const leaderboardBackButton = document.getElementById('leaderboard-back-btn');

const notificationDiv = document.getElementById('notification');

// --- NOTIFICATION FUNCTION ---
function showNotification(message) {
  if (!notificationDiv) return;
  notificationDiv.textContent = message;
  notificationDiv.classList.add("show");
  setTimeout(() => notificationDiv.classList.remove("show"), 3000);
}

// --- START QUIZ ---
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;

  // Hide everything else to prevent overlaps
  categorySelectionDiv.style.display = 'none';
  scoreNotification.style.display = 'none';
  leaderboardContainer.style.display = 'none';
  viewLeaderboardBtn.style.display = 'none';
  leaderboardBackButton.style.display = 'none';

  quizContainerDiv.style.display = 'block';
  nextButton.style.display = 'none';
  showNotification("Quiz started! Good luck!");
  showQuestion();
}

// --- SHOW QUESTION ---
function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.style.opacity = 0;

  setTimeout(() => {
    questionElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}: ${currentQuestion.question}`;
    questionElement.style.opacity = 1;
  }, 100);

  const answers = shuffleArray(currentQuestion.answers.slice());
  answers.forEach(answer => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = answer.text;
    button.classList.add('btn', 'answer-btn');
    if (answer.correct) button.dataset.correct = 'true';
    button.addEventListener('click', selectAnswer);
    answerButtonElement.appendChild(button);
  });

  updateProgress();
}

// --- RESET STATE ---
function resetState() {
  nextButton.style.display = 'none';
  answerButtonElement.innerHTML = '';
}

// --- SHUFFLE ARRAY ---
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- UPDATE PROGRESS BAR ---
function updateProgress() {
  const pct = Math.round((currentQuestionIndex / questions.length) * 100);
  if (progressBar) progressBar.style.width = `${pct}%`;
}

// --- SELECT ANSWER ---
function selectAnswer(e) {
  const selectBtn = e.target;
  const isCorrect = selectBtn.dataset.correct === 'true';

  if (isCorrect) {
    selectBtn.classList.add('correct', 'pulse');
    score++;
  } else {
    selectBtn.classList.add('incorrect', 'shake');
  }

  Array.from(answerButtonElement.children).forEach(button => {
    if (button.dataset.correct === 'true') button.classList.add('correct');
    button.disabled = true;
  });

  nextButton.style.display = 'inline-block';
  saveQuizState();
}

// --- NEXT QUESTION ---
function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

// --- SHOW SCORE ACTION BUTTONS ---
function showScoreActions() {
  playAgainBtn.style.display = 'inline-block';
  changeCategoryBtn.style.display = 'inline-block';
  viewLeaderboardBtn.style.display = 'inline-block';
  leaderboardBackButton.style.display = 'none';
}

// --- SHOW FINAL SCORE ---
function showScore() {
  const points = score * 5;
  const categoryName = questions === generalQuestions ? 'General Knowledge' : 'Korean Entertainment';

  async function sendScoreToBackend() {
    try {
      await fetch("http://localhost:3000/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, category: categoryName, points })
      });

      scoreText.textContent = `You scored ${points} points!`;
      scoreNotification.style.display = 'block';
      quizContainerDiv.style.display = 'none';
      answerButtonElement.innerHTML = "";

      showScoreActions();

    } catch (error) {
      console.error("Error saving score:", error);
      showNotification("Could not save score. Try again.");
    }
  }

  resetState();
  if (progressBar) progressBar.style.width = '100%';
  showNotification("Quiz completed! Check your score below.");
  sendScoreToBackend();
}

// --- FETCH LEADERBOARD ---
async function fetchLeaderboard() {
  const categoryName = questions === generalQuestions ? 'General Knowledge' : 'Korean Entertainment';
  leaderboardLoading.style.display = 'block';
  leaderboardTableBody.innerHTML = "";

  try {
    const response = await fetch(`http://localhost:3000/api/scores?category=${encodeURIComponent(categoryName)}`);
    const data = await response.json();
    renderLeaderboard(data.data || []);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    showNotification("Failed to load leaderboard.");
  } finally {
    leaderboardLoading.style.display = 'none';
  }
}

// --- RENDER LEADERBOARD ---
function renderLeaderboard(scores) {
  leaderboardTableBody.innerHTML = "";
  const sortedScores = scores.sort((a, b) => Number(b.points) - Number(a.points));
  let userIncluded = false;

  sortedScores.forEach((item, index) => {
    let medal = '';
    if (index === 0) medal = '<span class="medal gold">🥇</span> ';
    else if (index === 1) medal = '<span class="medal silver">🥈</span> ';
    else if (index === 2) medal = '<span class="medal bronze">🥉</span> ';

    if (index < 10 || item.username === username) {
      const row = document.createElement('tr');
      if (item.username === username) {
        row.classList.add('current-user');
        userIncluded = true;
      }
      row.innerHTML = `
        <td>${medal}${index + 1}</td>
        <td>${item.username}</td>
        <td>${Number(item.points)}</td>
      `;
      leaderboardTableBody.appendChild(row);
    }
  });

  if (!userIncluded) {
    const userRow = sortedScores.find(item => item.username === username);
    if (userRow) {
      const userRank = sortedScores.findIndex(item => item.username === username) + 1;
      const row = document.createElement('tr');
      row.classList.add('current-user');
      row.innerHTML = `
        <td>${userRank}</td>
        <td>${userRow.username}</td>
        <td>${Number(userRow.points)}</td>
      `;
      leaderboardTableBody.appendChild(row);
    }
  }
}

// --- SAVE QUIZ STATE ---
function saveQuizState() {
  localStorage.setItem('quizState', JSON.stringify({
    username,
    currentQuestionIndex,
    score,
    category: questions === generalQuestions ? 'general' : 'kdrama'
  }));
}

// --- RESTORE STATE ---
const savedState = JSON.parse(localStorage.getItem('quizState'));
if (savedState) {
  username = savedState.username;
  currentQuestionIndex = savedState.currentQuestionIndex;
  score = savedState.score;
  questions = savedState.category === 'general' ? generalQuestions : koreanentertainmentQuestions;
}

// --- EVENT LISTENERS ---
nextButton.addEventListener('click', handleNextButton);

playAgainBtn.addEventListener('click', () => {
  scoreNotification.style.display = 'none';
  startQuiz();
});

changeCategoryBtn.addEventListener('click', () => {
  scoreNotification.style.display = 'none';
  quizContainerDiv.style.display = 'none';
  leaderboardContainer.style.display = 'none';
  categorySelectionDiv.style.display = 'block';

  viewLeaderboardBtn.style.display = 'none';
  leaderboardBackButton.style.display = 'none';
});

viewLeaderboardBtn.addEventListener('click', () => {
  leaderboardContainer.style.display = 'block';
  quizContainerDiv.style.display = 'none';
  scoreNotification.style.display = 'none';
  categorySelectionDiv.style.display = 'none';

  playAgainBtn.style.display = 'none';
  changeCategoryBtn.style.display = 'none';
  viewLeaderboardBtn.style.display = 'none';

  leaderboardBackButton.style.display = 'inline-block';
  fetchLeaderboard();
});

leaderboardBackButton.addEventListener('click', () => {
  leaderboardContainer.style.display = 'none';
  scoreNotification.style.display = 'block';
  showScoreActions();
});

// --- USERNAME SUBMIT ---
usernameSubmitBtn.addEventListener('click', () => {
  const inputName = usernameInput.value.trim();
  if (!inputName) {
    showNotification("Please enter your name to proceed.");
    return;
  }

  username = inputName;
  usernameFormDiv.classList.add("hide");
  setTimeout(() => usernameFormDiv.style.display = 'none', 300);
  usernameInput.disabled = true;
  categorySelectionDiv.style.display = 'block';
});

// --- CATEGORY SELECTION ---
document.getElementById('general-btn').addEventListener('click', () => {
  questions = generalQuestions;
  showNotification("You picked General Knowledge! Test your knowledge✨");
  setTimeout(() => startQuiz(), 500);
});

document.getElementById('kdrama-btn').addEventListener('click', () => {
  questions = koreanentertainmentQuestions;
  showNotification("Welcome to K-World! Please enjoy the show 🍿");
  setTimeout(() => startQuiz(), 500);
});