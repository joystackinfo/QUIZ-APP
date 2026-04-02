document.addEventListener("DOMContentLoaded", () => {

  // --- DEFAULTS ---
  let questions = [];       // will hold questions fetched from backend
  let username = "";        // stores the name the user typed
  let currentQuestionIndex = 0;  // tracks which question user is on
  let score = 0;            // counts correct answers
  let selectedCategory = ""; // stores the category the user picked

  // --- DOM ELEMENTS ---
  // Grabbing all the HTML elements needed to show/hide or interact with
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

  // to add/remove the 'hide' CSS class which does display:none

  function show(el) { // removes 'hide' class to show the element
    el.classList.remove('hide');
    // Category section needs 'show' class too because it uses CSS grid
    if (el === categorySelectionDiv) el.classList.add('show');
  }

  function hide(el) {
    el.classList.add('hide');
    if (el === categorySelectionDiv) el.classList.remove('show'); // remove 'show' when hiding category section
  }

  function isVisible(el) {
    // Returns true if element does NOT have the hide class
    return !el.classList.contains('hide');
  }

  // Next button uses 'invisible' instead of 'hide' so it still takes up space
  // This keeps the Back button at half width even before an answer is selected
  function showNext() {
    nextButton.classList.remove('invisible');
  }

  function hideNext() {
    nextButton.classList.add('invisible');
  }

  // --- NOTIFICATION TOAST ---
  // Shows a small popup message at the top of the screen for 3 seconds
  function showNotification(message) {
    notificationDiv.textContent = message;
    notificationDiv.classList.add("show");
    setTimeout(() => notificationDiv.classList.remove("show"), 3000);
  }

  // --- EXPLANATION CARD ---
  // Called after user selects an answer
  // isCorrect = true/false, explanation = text string from the question data
  function showExplanation(isCorrect, explanation) {
    // Clear previous correct/incorrect styling
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
    // void offsetWidth forces the browser to re-trigger the CSS animation
    void explanationCard.offsetWidth;
  }

  function hideExplanation() {
    explanationCard.classList.add('hide');
    explanationCard.classList.remove('correct-card', 'incorrect-card');
  }

  // --- FETCH QUESTIONS FROM BACKEND ---
  // Called when user clicks a category button
  async function fetchQuestionsAndStart() {
    try {
      // Sends a GET request to backend with the selected category
      const response = await fetch(`http://localhost:3000/api/questions?category=${selectedCategory}`);
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

    // Hide everything except the quiz container
    hide(categorySelectionDiv);
    hide(scoreNotification);
    hide(leaderboardContainer);

    show(quizContainerDiv);
    hideNext();       // Next button hidden (invisible) until user answers
    hideExplanation(); // Explanation card hidden at start

    updateProgressBar();
    showQuestion();
  }

  // --- QUIZ BACK BUTTON ---
  // This one button handles going back from multiple screens
  quizBackBtn.addEventListener('click', () => {

    if (isVisible(quizContainerDiv)) {
      // If in the quiz and not on the first question, go back one question
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
      } else {
        // If on first question, go back to category selection
        hide(quizContainerDiv);
        show(categorySelectionDiv);
      }

    } else if (isVisible(scoreNotification)) {
      // If on the score screen, go back to category selection
      hide(scoreNotification);
      show(categorySelectionDiv);

    } else if (isVisible(leaderboardContainer)) {
      // If on the leaderboard, go back to score screen
      hide(leaderboardContainer);
      show(scoreNotification);
    }
  });

  // --- SHOW QUESTION ---
  function showQuestion() {
    resetState(); // clear previous question's buttons and explanation

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;

    // Dynamically create a button for each answer option
    currentQuestion.answers.forEach(answer => {
      const button = document.createElement('button');
      button.textContent = answer.text;
      button.classList.add('btn');

      // Store whether this answer is correct as a data attribute on the button
      if (answer.correct) button.dataset.correct = "true";
      button.addEventListener('click', selectAnswer);
      answerButtonElement.appendChild(button);
    });

    updateProgressBar();
  }

  // --- RESET STATE BETWEEN QUESTIONS ---
  function resetState() {
    hideNext();
    hideExplanation();
    answerButtonElement.innerHTML = ""; // remove all answer buttons
  }

  // --- SELECT ANSWER ---
  function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
      score++;
      selectedBtn.classList.add("correct"); // turn green
    } else {
      selectedBtn.classList.add("incorrect"); // turn red
      // Also highlight the correct answer so user can see what was right
      Array.from(answerButtonElement.children).forEach(btn => {
        if (btn.dataset.correct === "true") btn.classList.add("correct");
      });
    }

    // Disable all buttons so user can't click again
    Array.from(answerButtonElement.children).forEach(btn => {
      btn.disabled = true;
    });

    // Show explanation card with correct/incorrect styling
    const currentQuestion = questions[currentQuestionIndex];
    showExplanation(isCorrect, currentQuestion.explanation);

    showNext(); // reveal the Next button now that user has answered
  }

  // --- NEXT BUTTON ---
  nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion(); // still more questions
    } else {
      showScore(); // no more questions, show final score
    }
  });

  // --- PROGRESS BAR ---
  function updateProgressBar() {
    if (!questions.length) return;
    // Calculate what % of questions have been answered
    const percent = (currentQuestionIndex + 1) / questions.length * 100;

    // Change gradient color based on progress
    let gradient;
    if (percent <= 30) gradient = 'linear-gradient(90deg, #e3c8f7, #d7a0f0)';
    else if (percent <= 70) gradient = 'linear-gradient(90deg, #c079e8, #8b1984)';
    else gradient = 'linear-gradient(90deg, #5a0f5e, #1cc264)'; // green near end

    progressBar.style.width = `${percent}%`;
    progressBar.style.background = gradient;
  }

  // --- SHOW SCORE & SAVE TO BACKEND ---
  function showScore() {
    hide(quizContainerDiv);
    // score * 5 because each correct answer = 5 points
    scoreText.textContent = `You scored ${score * 5} points!`;
    show(scoreNotification);

    // Send the score to the backend to be saved in the database
    fetch('http://localhost:3000/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,           // the name from username form
        category: selectedCategory,   // the category they played
        points: score * 5             // total points earned
      })
    })
    .then(res => res.json())
    .then(data => console.log('Score saved:', data.message))
    .catch(err => console.error('Error saving score:', err));
  }

  // --- USERNAME SUBMIT ---
  usernameSubmitBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim(); // trim removes extra spaces
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
      // data-category attribute on each button tells us which category was picked
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

    // Fetch leaderboard scores for the current category from backend
    fetch(`http://localhost:3000/api/leaderboard?category=${selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        const tbody = document.querySelector('#leaderboard-table tbody');
        tbody.innerHTML = ''; // clear old rows before adding new ones

        if (!data.data.length) {
          tbody.innerHTML = '<tr><td colspan="3">No scores yet</td></tr>'; // show message if no scores for this category
          return;
        }

        data.data.forEach((entry, index) => {
          // Show medal emojis for top 3, numbers for the rest
          const medals = ['🥇', '🥈', '🥉'];
          const rank = medals[index] || index + 1;

          // Highlight the current user's row in the table
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

  // --- LEADERBOARD BACK → goes back to username form for fresh start ---
  leaderboardBackButton.addEventListener('click', () => {
    hide(leaderboardContainer);
    hide(scoreNotification);
    show(usernameFormDiv);
    usernameInput.value = ''; // clear the name input for next player
  });

  // --- PLAY AGAIN (same category) ---
  playAgainBtn.addEventListener('click', () => {
    startQuiz();
  });

  // --- CHANGE CATEGORY ---
  changeCategoryBtn.addEventListener('click', () => {
    hide(scoreNotification);
    show(categorySelectionDiv);
  });

});