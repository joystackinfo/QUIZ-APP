// --- IMPORT QUESTION SETS ---
import generalQuestions from "./generalknowledge.js";
import koreanentertainmentQuestions from "./koreanentertainment.js";

// --- DEFAULTS ---
let questions = generalQuestions;  // Current category questions
let username = "";                 // Player name
let currentQuestionIndex = 0;      // Track which question we’re on
let score = 0;                     // Track correct answers

// --- DOM ELEMENTS ---
// Username
const usernameFormDiv = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const usernameSubmitBtn = document.getElementById('submit-username');

// Leaderboard
const leaderboardContainer = document.getElementById('leaderboard-container');
const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');
const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
const leaderboardDiv = document.getElementById('leaderboard');
const leaderboardLoading = document.getElementById('leaderboard-loading');

// Quiz
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

// --- NOTIFICATION FUNCTION ---
// Shows a temporary message at the top of the screen
function showNotification(message) {
    if (!notificationDiv) return;
    notificationDiv.textContent = message;
    notificationDiv.classList.add("show");
    setTimeout(() => notificationDiv.classList.remove("show"), 3000);
}

// --- START QUIZ ---
// Resets variables and shows the first question
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    categorySelectionDiv.style.display = 'none';
    quizContainerDiv.style.display = 'block';
    nextButton.textContent = "Next";
    scoreNotification.style.display = 'none';
    showNotification("Quiz started! Good luck!");
    showQuestion();
}

// --- SHOW QUESTION ---
// Populates the question and answer buttons dynamically
function showQuestion() {
    resetState(); // Clear previous answers

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.style.opacity = 0; // Fade animation

    setTimeout(() => {
        questionElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}: ${currentQuestion.question}`;
        questionElement.style.opacity = 1;
    }, 100);

    // Shuffle answers to randomize button order
    const answers = shuffleArray(currentQuestion.answers.slice());
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = answer.text;
        button.classList.add('btn', 'answer-btn'); // added class for CSS spacing/centering
        if (answer.correct) button.dataset.correct = 'true';
        button.addEventListener('click', selectAnswer);
        answerButtonElement.appendChild(button);
    });

    updateProgress();
}

// --- RESET STATE ---
// Clears answer buttons and hides the next button
function resetState() {
    nextButton.style.display = 'none';
    answerButtonElement.innerHTML = ''; // Remove all previous buttons
}

// --- SHUFFLE ARRAY ---
// Fisher-Yates shuffle
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
// Handles logic for clicking an answer
function selectAnswer(e) {
    const selectBtn = e.target;
    const isCorrect = selectBtn.dataset.correct === 'true';

    if (isCorrect) {
        selectBtn.classList.add('correct', 'pulse');
        score++;
    } else {
        selectBtn.classList.add('incorrect', 'shake');
    }

    // Highlight correct answer and disable all buttons
    Array.from(answerButtonElement.children).forEach(button => {
        if (button.dataset.correct === 'true') button.classList.add('correct');
        button.disabled = true;
    });

    nextButton.style.display = 'inline-block';
    saveQuizState(); // Save after each answer
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

// --- SHOW FINAL SCORE ---
function showScore() {
    const points = score * 5;
    const categoryName = questions === generalQuestions ? 'General Knowledge' : 'Korean Entertainment';

    async function sendScoreToBackend() {
        try {
            await fetch("http://localhost:3000/api/scores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, category: categoryName, score })
            });

            scoreText.textContent = `You scored ${points} points!`;
            scoreNotification.style.display = 'block';
            quizContainerDiv.style.display = 'none';
            viewLeaderboardBtn.style.display = 'inline-block';
            answerButtonElement.innerHTML = ""; // Clear buttons

        } catch (error) {
            console.error("Error saving score:", error);
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
        const response = await fetch(`http://localhost:3000/api/scores?category=${categoryName}`);
        const data = await response.json();
        renderLeaderboard(data.data);
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
    const sortedScores = scores.sort((a, b) => b.score - a.score);
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
                <td>${item.score * 5}</td>
            `;
            leaderboardTableBody.appendChild(row);
        }
    });

    // Ensure current user shows if outside top 10
    if (!userIncluded) {
        const userRow = sortedScores.find(item => item.username === username);
        if (userRow) {
            const userRank = sortedScores.findIndex(item => item.username === username) + 1;
            const row = document.createElement('tr');
            row.classList.add('current-user');
            row.innerHTML = `
                <td>${userRank}</td>
                <td>${userRow.username}</td>
                <td>${userRow.score * 5}</td>
            `;
            leaderboardTableBody.appendChild(row);
        }
    }
}

// --- SAVE & RESTORE STATE ---
function saveQuizState() {
    localStorage.setItem('quizState', JSON.stringify({
        username,
        currentQuestionIndex,
        score,
        category: questions === generalQuestions ? 'general' : 'kdrama'
    }));
}

const savedState = JSON.parse(localStorage.getItem('quizState'));
if (savedState) {
    username = savedState.username;
    currentQuestionIndex = savedState.currentQuestionIndex;
    score = savedState.score;
    questions = savedState.category === 'general' ? generalQuestions : koreanentertainmentQuestions;
}

// --- EVENT LISTENERS ---
// Navigation buttons
nextButton.addEventListener('click', handleNextButton);

backButton.addEventListener('click', () => {
    quizContainerDiv.style.display = 'none';
    categorySelectionDiv.style.display = 'block';
    backButton.style.display = 'none';
});

// Play again
playAgainBtn.addEventListener('click', () => {
    scoreNotification.style.display = 'none';
    startQuiz();
});

// Change category
changeCategoryBtn.addEventListener('click', () => {
    scoreNotification.style.display = 'none';
    quizContainerDiv.style.display = 'none';
    categorySelectionDiv.style.display = 'block';
    backButton.style.display = 'none';
});

// View leaderboard
viewLeaderboardBtn.addEventListener('click', () => {
    leaderboardContainer.style.display = 'block';
    leaderboardDiv.style.display = 'block';
    fetchLeaderboard();
});

// Username form
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
