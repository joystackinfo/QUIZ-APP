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

  const explanationCard = document.getElementById('explanation-card');
  const explanationIcon = document.getElementById('explanation-icon');
  const explanationLabel = document.getElementById('explanation-label');
  const explanationText = document.getElementById('explanation-text');

  const scoreNotification = document.getElementById('score-notification');
  const scoreText = document.getElementById('score-text');
  const playAgainBtn = document.getElementById('play-again');
  const changeCategoryBtn = document.getElementById('change-category');
  const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');

  const leaderboardContainer = document.getElementById('leaderboard-container');
  const leaderboardBackButton = document.getElementById('leaderboard-back-btn');

  const backToUsernameBtn = document.getElementById('back-to-username');
  const notificationDiv = document.getElementById('notification');
  const quizBackBtn = document.getElementById('quiz-back-btn');

  // --- HELPERS ---
  function show(el) {
    el.classList.remove('hide');
    if (el === categorySelectionDiv) el.classList.add('show');
  }

  function hide(el) {
    el.classList.add('hide');
    if (el === categorySelectionDiv) el.classList.remove('show');
  }

  function isVisible(el) {
    return !el.classList.contains('hide');
  }

  function showNext() {
    nextButton.classList.remove('invisible');
  }

  function hideNext() {
    nextButton.classList.add('invisible');
  }

  // --- NOTIFICATION ---
  function showNotification(message) {
    notificationDiv.textContent = message;
    notificationDiv.classList.add("show");
    setTimeout(() => notificationDiv.classList.remove("show"), 3000);
  }

  // --- EXPLANATION CARD ---
  function showExplanation(isCorrect, explanation) {
    // Remove old correct/incorrect class
    explanationCard.classList.remove('correct-card', 'incorrect-card');

    if (isCorrect) {
      explanationCard.classList.add('correct-card');
      explanationIcon.textContent = '✅';
      explanationLabel.textContent = 'Correct!';
    } else {
      explanationCard.classList.add('incorrect-card');
      explanationIcon.textContent = '❌';
      explanationLabel.textContent = 'Incorrect!';
    }

    explanationText.textContent = explanation || '';

    // Re-trigger animation by removing and re-adding hide
    explanationCard.classList.remove('hide');
    // Force reflow so animation replays
    void explanationCard.offsetWidth;
  }

  function hideExplanation() {
    explanationCard.classList.add('hide');
    explanationCard.classList.remove('correct-card', 'incorrect-card');
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
    progressBar.style.width = '0%';

    hide(categorySelectionDiv);
    hide(scoreNotification);
    hide(leaderboardContainer);

    show(quizContainerDiv);
    hideNext();
    hideExplanation();

    updateProgressBar();
    showQuestion();
  }

  // --- QUIZ BACK BUTTON ---
  quizBackBtn.addEventListener('click', () => {
    if (isVisible(quizContainerDiv)) {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
      } else {
        hide(quizContainerDiv);
        show(categorySelectionDiv);
      }
    } else if (isVisible(scoreNotification)) {
      hide(scoreNotification);
      show(categorySelectionDiv);
    } else if (isVisible(leaderboardContainer)) {
      hide(leaderboardContainer);
      show(scoreNotification);
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
    hideNext();
    hideExplanation();
    answerButtonElement.innerHTML = "";
  }

  // --- SELECT ANSWER ---
  function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
      score++;
      selectedBtn.classList.add("correct");
    } else {
      selectedBtn.classList.add("incorrect");
      Array.from(answerButtonElement.children).forEach(btn => {
        if (btn.dataset.correct === "true") btn.classList.add("correct");
      });
    }

    // Disable all buttons
    Array.from(answerButtonElement.children).forEach(btn => {
      btn.disabled = true;
    });

    // Show explanation from current question
    const currentQuestion = questions[currentQuestionIndex];
    showExplanation(isCorrect, currentQuestion.explanation);

    showNext();
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
    const percent = (currentQuestionIndex + 1) / questions.length * 100;

    let gradient;
    if (percent <= 30) gradient = 'linear-gradient(90deg, #e3c8f7, #d7a0f0)';
    else if (percent <= 70) gradient = 'linear-gradient(90deg, #c079e8, #8b1984)';
    else gradient = 'linear-gradient(90deg, #5a0f5e, #1cc264)';

    progressBar.style.width = `${percent}%`;
    progressBar.style.background = gradient;
  }

  // --- SHOW SCORE ---
  function showScore() {
    hide(quizContainerDiv);
    scoreText.textContent = `You scored ${score * 5} points!`;
    show(scoreNotification);
  }

  // --- USERNAME SUBMIT ---
  usernameSubmitBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (!name) {
      showNotification("Enter your name");
      return;
    }
    username = name;
    hide(usernameFormDiv);
    show(categorySelectionDiv);
  });

  // --- CATEGORY SELECTION ---
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.category;
      fetchQuestionsAndStart();
    });
  });

  // --- BACK TO USERNAME ---
  backToUsernameBtn.addEventListener('click', () => {
    hide(categorySelectionDiv);
    show(usernameFormDiv);
  });

  // --- VIEW LEADERBOARD ---
  viewLeaderboardBtn.addEventListener('click', () => {
    hide(scoreNotification);
    show(leaderboardContainer);
  });

  // --- LEADERBOARD BACK → username ---
  leaderboardBackButton.addEventListener('click', () => {
    hide(leaderboardContainer);
    hide(scoreNotification);
    show(usernameFormDiv);
    usernameInput.value = '';
  });

  // --- PLAY AGAIN ---
  playAgainBtn.addEventListener('click', () => {
    startQuiz();
  });

  // --- CHANGE CATEGORY ---
  changeCategoryBtn.addEventListener('click', () => {
    hide(scoreNotification);
    show(categorySelectionDiv);
  });

});