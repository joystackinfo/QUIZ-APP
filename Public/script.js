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
  const goHomeBtn = document.getElementById('go-home-btn');

  const leaderboardContainer = document.getElementById('leaderboard-container');
  const leaderboardBackButton = document.getElementById('leaderboard-back-btn');

  const backToUsernameBtn = document.getElementById('back-to-username');
  const notificationDiv = document.getElementById('notification');
  const quizBackBtn = document.getElementById('quiz-back-btn');

  // Dynamic heading elements
  const appTitle = document.getElementById('app-title');
  const appTagline = document.getElementById('app-tagline');

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

  function showNext() { nextButton.classList.remove('invisible'); }
  function hideNext() { nextButton.classList.add('invisible'); }

  // --- DYNAMIC HEADING ---
  // Changes the h1 title and tagline based on which screen is active
  function setHeading(title, showTagline = false) {
    appTitle.textContent = title;
    if (showTagline) {
      appTagline.classList.remove('hide');
    } else {
      appTagline.classList.add('hide');
    }
  }

  // --- NOTIFICATION TOAST ---
  function showNotification(message) {
    notificationDiv.textContent = message;
    notificationDiv.classList.add("show");
    setTimeout(() => notificationDiv.classList.remove("show"), 3000);
  }

  // --- EXPLANATION CARD ---
  function showExplanation(isCorrect, explanation) {
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
    explanationCard.classList.remove('hide');
    void explanationCard.offsetWidth;
  }

  function hideExplanation() {
    explanationCard.classList.add('hide');
    explanationCard.classList.remove('correct-card', 'incorrect-card');
  }

  // --- FETCH QUESTIONS ---
  async function fetchQuestionsAndStart() {
    try {
      const response = await fetch(`/api/questions?category=${selectedCategory}`)
      const data = await response.json();
      questions = data;

      if (!questions.length) {
        showNotification("No questions found for the selected category");
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

    setHeading("Test Your Knowledge"); // heading for quiz screen

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
        setHeading("Select a Category"); // heading for category screen
      }
    } else if (isVisible(scoreNotification)) {
      hide(scoreNotification);
      show(categorySelectionDiv);
      setHeading("Select a Category");
    } else if (isVisible(leaderboardContainer)) {
      hide(leaderboardContainer);
      show(scoreNotification);
      setHeading("Quiz Complete");
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

    Array.from(answerButtonElement.children).forEach(btn => {
      btn.disabled = true;
    });

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
    setHeading("Quiz Complete"); // heading for score screen

  fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        category: selectedCategory,
        points: score * 5
      })
    })
    .then(res => res.json())
    .then(data => console.log('Score saved:', data.message))
    .catch(err => console.error('Error saving score:', err));
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
    setHeading("Select a Category"); // heading changes when moving to category
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
    setHeading("Welcome to Quiz App", true); // show tagline only on username screen
  });

  // --- VIEW LEADERBOARD ---
  viewLeaderboardBtn.addEventListener('click', () => {
    hide(scoreNotification);
    show(leaderboardContainer);
    setHeading("Top Performers"); // heading for leaderboard screen

    fetch(`http://localhost:3000/api/scores?category=${selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        const tbody = document.querySelector('#leaderboard-table tbody');
        tbody.innerHTML = '';

        if (!data.data.length) {
          tbody.innerHTML = '<tr><td colspan="3">No scores yet</td></tr>';
          return;
        }

        data.data.forEach((entry, index) => {
          const medals = ['🥇', '🥈', '🥉'];
          const rank = medals[index] || index + 1;
          const isCurrentUser = entry.username === username.trim().toLowerCase();
          const row = document.createElement('tr');
          if (isCurrentUser) row.classList.add('current-user');
          row.innerHTML = `
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${entry.points}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
  });

  // --- LEADERBOARD BACK → Score screen ---
  leaderboardBackButton.addEventListener('click', () => {
    hide(leaderboardContainer);
    show(scoreNotification);
    setHeading("Quiz Complete");
  });

  // --- GO HOME → Username form ---
  goHomeBtn.addEventListener('click', () => {
    hide(scoreNotification);
    show(usernameFormDiv);
    setHeading("Welcome to Quiz App", true); // show tagline again on home
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
    setHeading("Select a Category");
  });

  // Set initial heading with tagline on first load
  setHeading("Welcome to Quiz App", true);

});z