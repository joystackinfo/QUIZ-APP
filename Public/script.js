// Import question sets
import generalQuestions from "./generalknowledge.js";
import koreanentertainmentQuestions from "./koreanentertainment.js";

// Default category
let questions = generalQuestions;
let username = "";

// DOM elements
// Username form elements
const usernameFormDiv = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const usernameSubmitBtn = document.getElementById('submit-username');

// Leaderboard elements
const leaderboardContainer = document.getElementById('leaderboard-container'); // container to hide/show leaderboard
const leaderboardTableBody = document.querySelector('#leaderboard-table tbody'); // tbody where rows will be inserted
const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
const leaderboardDiv = document.getElementById('leaderboard');

// Quiz elements
const categorySelectionDiv = document.getElementById('category-selection');
const quizContainerDiv = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const answerButtonElement = document.getElementById('answer-btn');
const nextButton = document.getElementById('next-btn');
const backButton = document.getElementById('back-btn');
const progressBar = document.getElementById('progress-bar');
const scoreNotification = document.getElementById('score-notification');
const scoreText = document.getElementById('score-text');
const playAgainBtn = document.getElementById('play-again');
const changeCategoryBtn = document.getElementById('change-category');
const notificationDiv = document.getElementById('notification');

// State
let currentQuestionIndex = 0;
let score = 0;

// --- Notification function ---
function showNotification(message) {
    if (!notificationDiv) return;
    notificationDiv.textContent = message;
    notificationDiv.classList.add("show");

    setTimeout(() => {
        notificationDiv.classList.remove("show");
    }, 3000);
}

// Start quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    categorySelectionDiv.style.display = 'none';
    quizContainerDiv.style.display = 'block';
    nextButton.textContent = "Next"; // Reset next button text
    scoreNotification.style.display = 'none';
    showNotification("Quiz started! Good luck!"); // Notify user quiz started

    showQuestion();
}

// View leaderboard button click
viewLeaderboardBtn.addEventListener('click', () => {
    leaderboardContainer.style.display = 'block'; // show leaderboard container
    leaderboardDiv.style.display = 'block';       // show leaderboard section

    fetchLeaderboard(); // Fetch and render leaderboard data
});

// Show question
function showQuestion() {
    resetState();

    const currentQuestion = questions[currentQuestionIndex]; // get current question
    questionElement.style.opacity = 0; // fade out for smooth transition

    setTimeout(() => {
        questionElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}: ${currentQuestion.question}`;
        questionElement.style.opacity = 1;
    }, 100);

    const answers = shuffleArray(currentQuestion.answers.slice()); // clone and shuffle answers
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = answer.text;
        button.classList.add('btn');
        if (answer.correct) button.dataset.correct = 'true';
        button.addEventListener('click', selectAnswer);
        answerButtonElement.appendChild(button);
    });

    updateProgress();
}

// Reset answer buttons for next question
function resetState() {
    nextButton.style.display = 'none';
    while (answerButtonElement.firstChild) {
        answerButtonElement.removeChild(answerButtonElement.firstChild);
    }
}

// Shuffle answers array
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Update progress bar
function updateProgress() {
    const pct = Math.round(((currentQuestionIndex) / questions.length) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
}

// Answer selection
function selectAnswer(e) {
    const selectBtn = e.target; // clicked button
    const isCorrect = selectBtn.dataset.correct === 'true';

    if (isCorrect) {
        selectBtn.classList.add('correct', 'pulse');
        score++;
    } else {
        selectBtn.classList.add('incorrect', 'shake');
    }

    // Show correct answers and disable all buttons
    Array.from(answerButtonElement.children).forEach(button => {
        if (button.dataset.correct === 'true') button.classList.add('correct');
        button.disabled = true;
    });

    nextButton.style.display = 'inline-block';
}

// Next question button
function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

// Show final score and send to backend
function showScore() {
    const points = score * 5; // 5 points per correct answer

    async function sendScoreToBackend() {
        const categoryName = questions === generalQuestions ? 'General Knowledge' : 'Korean Entertainment';

        try {
            // 🔹 CHANGED: sending 'score' instead of 'points' to match backend expectation
            const response = await fetch("http://localhost:3000/api/scores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    category: categoryName,
                    score // <-- backend expects 'score'
                })
            });

            const data = await response.json();
            console.log("Score submitted:", data);

            // Fetch updated leaderboard
            const leaderboardResponse = await fetch(`http://localhost:3000/api/scores?category=${categoryName}`);
            const leaderboardData = await leaderboardResponse.json();
            console.log("Leaderboard data:", leaderboardData);

            renderLeaderboard(leaderboardData.data); // render leaderboard rows

            viewLeaderboardBtn.style.display = 'inline-block'; // show leaderboard button

        } catch (error) {
            console.error("Error saving score:", error);
        }
    }

    resetState();
    scoreText.textContent = `You scored ${points} points!`;
    scoreNotification.style.display = 'block';
    if (progressBar) progressBar.style.width = '100%';
    showNotification("Quiz completed! Check your score below.");

    sendScoreToBackend(); // send score to backend
}

// Event listeners
nextButton.addEventListener('click', handleNextButton);

backButton.addEventListener('click', () => {
    quizContainerDiv.style.display = 'none';
    categorySelectionDiv.style.display = 'block';
    backButton.style.display = 'none';
});

playAgainBtn.addEventListener('click', () => {
    scoreNotification.style.display = 'none';
    startQuiz();
});

changeCategoryBtn.addEventListener('click', () => {
    scoreNotification.style.display = 'none';
    quizContainerDiv.style.display = 'none';
    categorySelectionDiv.style.display = 'block';
    backButton.style.display = 'none';
});

// Fetch leaderboard
async function fetchLeaderboard() {
    const categoryName = questions === generalQuestions ? 'General Knowledge' : 'Korean Entertainment';

    try {
        const response = await fetch(`http://localhost:3000/api/scores?category=${categoryName}`);
        const data = await response.json();
        console.log("Leaderboard data:", data);

        renderLeaderboard(data.data); // render table rows
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
}

// Render leaderboard table rows
function renderLeaderboard(scores) {
    leaderboardTableBody.innerHTML = ""; // clear existing rows

    scores.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.username}</td>
            <td>${item.score * 5}</td> <!-- 🔹 CHANGED: multiply score by 5 for display points -->
        `;
        leaderboardTableBody.appendChild(row);
    });
}

// Username submission
usernameSubmitBtn.addEventListener('click', () => {
    const inputName = usernameInput.value.trim();
    if (inputName === "") {
        showNotification("Please enter your name to proceed.");
        return;
    }

    username = inputName; // save username
    console.log("Username saved:", username);

    usernameFormDiv.classList.add("hide");
    setTimeout(() => {
        usernameFormDiv.style.display = 'none';
    }, 300);

    usernameInput.disabled = true; // disable input
    categorySelectionDiv.style.display = 'block'; // show category selection
});

// Category selection buttons
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
