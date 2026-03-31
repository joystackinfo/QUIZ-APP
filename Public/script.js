document.addEventListener("DOMContentLoaded", () => {

  // --- DEFAULTS ---
  let questions = [];
  let username = "";
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedCategory = "";

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
  const leaderboardBackButton = document.getElementById('leaderboard-back-btn');

  const selectedCategoryText = document.getElementById('selected-category');
  const backToUsernameBtn = document.getElementById('back-to-username');
  const notificationDiv = document.getElementById('notification');
  const quizBackBtn = document.getElementById('quiz-back-btn');

  // --- INITIAL STATE ---
  leaderboardContainer.style.display = 'none';
  viewLeaderboardBtn.style.display = 'none';
  leaderboardBackButton.style.display = 'none';
  quizContainerDiv.style.display = 'none';
  categorySelectionDiv.style.display = 'none';

  // --- NOTIFICATION ---
  function showNotification(message) {
    notificationDiv.textContent = message;
    notificationDiv.classList.add("show");
    setTimeout(() => {
      notificationDiv.classList.remove("show");
    }, 3000);
  }

  // --- FETCH QUESTIONS ---
  async function fetchQuestionsAndStart() {
    try {
      const response = await fetch(`http://localhost:3000/api/questions?category=${selectedCategory}`);
      const data = await response.json();
      questions = data;

      if (!questions.length) {
        showNotification("No questions found");
        return;
      }

      startQuiz();
    } catch (error) {
      console.error(error);
      showNotification("Error loading questions");
    }
  }

  // --- START QUIZ ---
  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;

    categorySelectionDiv.style.display = 'none';
    quizContainerDiv.style.display = 'block';
    scoreNotification.style.display = 'none';
    leaderboardContainer.style.display = 'none';
    quizBackBtn.style.display = 'inline-block'; // show back button
    nextButton.style.display = 'none'; // hide next initially

    updateProgressBar();
    showQuestion();
  }

  // --- BACK BUTTON (quiz back) ---
  quizBackBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion();
    } else {
      quizContainerDiv.style.display = 'none';
      categorySelectionDiv.style.display = 'block';
    }
  });

  // --- SHOW QUESTION ---
  function showQuestion() {
    resetState();

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;

    currentQuestion.answers.forEach(answer => {
      const button = document.createElement('button');
      button.textContent = answer.text;
      button.classList.add('btn');

      if (answer.correct) button.dataset.correct = "true";

      button.addEventListener('click', selectAnswer);
      answerButtonElement.appendChild(button);
    });

    updateProgressBar();
  }

  // --- RESET ---
  function resetState() {
    nextButton.style.display = 'none';
    answerButtonElement.innerHTML = ""; // clear old answers
  }

  // --- SELECT ANSWER ---
  function selectAnswer(e) {
  const selectedBtn = e.target
  const isCorrect = selectedBtn.dataset.correct === "true"

  // If correct → increase score
  if (isCorrect) {
    score++
    selectedBtn.classList.add("correct") // green
  } else {
    selectedBtn.classList.add("incorrect") // red

    // Find the correct answer and highlight it
    Array.from(answerButtonElement.children).forEach(btn => {
      if (btn.dataset.correct === "true") {
        btn.classList.add("correct")
      }
    })
  }

  // Disable all buttons after answering
  Array.from(answerButtonElement.children).forEach(btn => {
    btn.disabled = true
  })

  // Show next button
  nextButton.style.display = 'inline-block'
}
  // --- NEXT ---
  nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  });

  // --- PROGRESS BAR ---
  function updateProgressBar() {
    if (!questions.length) return;
    const percent = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Gradient vibes: light -> medium -> deep
    let gradient;
    if (percent <= 30) gradient = 'linear-gradient(90deg, #e3c8f7, #d7a0f0)';
    else if (percent <= 70) gradient = 'linear-gradient(90deg, #c079e8, #8b1984)';
    else gradient = 'linear-gradient(90deg, #5a0f5e, #1cc264)'; // green at end

    progressBar.style.width = `${percent}%`;
    progressBar.style.background = gradient;
  }

  // --- SCORE ---
  function showScore() {
    quizContainerDiv.style.display = 'none';
    scoreNotification.style.display = 'block';
    scoreText.textContent = `You scored ${score * 5} points!`;

    viewLeaderboardBtn.style.display = 'inline-block';
  }

  // --- USERNAME ---
  usernameSubmitBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (!name) {
      showNotification("Enter your name");
      return;
    }
    username = name;
    usernameFormDiv.style.display = 'none';
    categorySelectionDiv.style.display = 'block';
  });

  // --- CATEGORY SELECTION ---
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.category;
      selectedCategoryText.textContent = `Selected: ${selectedCategory}`;
      fetchQuestionsAndStart();
    });
  });

  // --- BACK TO USERNAME ---
  backToUsernameBtn.addEventListener('click', () => {
    categorySelectionDiv.style.display = 'none';
    usernameFormDiv.style.display = 'block';
  });

  // --- VIEW LEADERBOARD ---
  viewLeaderboardBtn.addEventListener('click', () => {
    leaderboardContainer.style.display = 'block';
    leaderboardBackButton.style.display = 'inline-block';
    scoreNotification.style.display = 'none';
  });

  leaderboardBackButton.addEventListener('click', () => {
    leaderboardContainer.style.display = 'none';
    leaderboardBackButton.style.display = 'none';
    scoreNotification.style.display = 'block';
  });

  // --- PLAY AGAIN / CHANGE CATEGORY ---
  playAgainBtn.addEventListener('click', () => {
    startQuiz();
  });

  changeCategoryBtn.addEventListener('click', () => {
    scoreNotification.style.display = 'none';
    categorySelectionDiv.style.display = 'block';
  });

});