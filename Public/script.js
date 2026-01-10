// Import question sets
import generalQuestions from "./generalknowledge.js";
import koreanentertainmentQuestions from "./koreanentertainment.js";

// Default category
let questions = generalQuestions;
let username = "";

// DOM elements
//Username elements
const usernameFormDiv = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const usernameSubmitBtn = document.getElementById('submit-username');

 
//Leaderboard elements

  const leaderboardContainer = document.getElementById('leaderboard-container'); //hide and show board
  const leaderboardTableBody = document.querySelector('#leaderboard-table tbody'); //Shows where rows wil be inserted
  const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
const leaderboardDiv = document.getElementById('leaderboard');


//Quiz elements
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
    nextButton.textContent = "Next"; // Reset next button
    scoreNotification.style.display = 'none';
    showNotification("Quiz started! Good luck!"); // Start notification

    showQuestion();
}

// Show question
function showQuestion() {
    resetState();

    const currentQuestion = questions[currentQuestionIndex]; // Get current question
    questionElement.style.opacity = 0; // Fade out for transition

    setTimeout(() => {
        questionElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}: ${currentQuestion.question}`;
        questionElement.style.opacity = 1;
    }, 100);

    const answers = shuffleArray(currentQuestion.answers.slice());
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

// Reset answer buttons
function resetState() {
    nextButton.style.display = 'none';
    while (answerButtonElement.firstChild) {
        answerButtonElement.removeChild(answerButtonElement.firstChild);
    }
}

// Shuffle answers
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
}

// Next question
function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

// Show score
function showScore() {
    async function sendScoretoBackend() {
        const points = score * 5; // 5 points per correct answer
        const category = questions === generalQuestions ? 'General Knowledge' : 'Korean Entertainment'; // Determine the score according to category

        try{
            const response = await fetch("http://localhost:3000/api/scores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    category,
                    points
                })
            });
            const leaderboardResponse = await fetch(`http://localhost:3000/api/scores?category=${category}`); // Fetch updated leaderboard
            const leaderboardData = await leaderboardResponse.json();
            viewLeaderboardBtn.style.display = 'inline-block'; // Show leaderboard button after score submission
            const allScores = leaderboardData.data;

            const currentUserIndex = allScores.findIndex(item => item.username === username && item.points === points); // Finds the index of the current user 
            const currentUserRank = currentUserIndex + 1; // Rank is index + 1
        

            const data = await response.json(); // get a json response
            console.log("Score submitted:", data); 

           // fetchLeaderboard(category); // Fetch updated leaderboard after submitting score

        } catch (error) {
            console.error("Error saving score:", error);

        }
    }

    resetState();
    scoreText.textContent = `You scored ${points} points! Your rank is ${currentUserRank}! 🎉`;
    scoreNotification.style.display = 'block';
    if (progressBar) progressBar.style.width = '100%';
  showNotification("Quiz completed! Check your score below."); // Completion notification
 
      sendScoretoBackend(); // Send score to backend
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


//Fetch leaderboard function
async function fetchLeaderboard() {
    const category = questions === generalQuestions ? 'General Knowledge' : 'Korean Entertainment';

    try{
        const response = await fetch(`http://localhost:3000/api/scores?category=${category}`);
        const data = await response.json();

        console.log("Leaderboard data:", data);

        renderLeaderboard(data.data); // Render leaderboard with fetched data
    }
    catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
}


//Username submission form
usernameSubmitBtn.addEventListener('click', () => {
    const inputName = usernameInput.value.trim(); //get input value

    if (inputName === "") {
        showNotification("Please enter your name to proceed.");
        return;

    }
    username = inputName;  // saves the username
    console.log("Username saved:", username);

   usernameFormDiv.classList.add("hide");

setTimeout(() => {
  usernameFormDiv.style.display = 'none';
}, 300);

    usernameInput.disabled = true; //disable input after submission

 username= inputName;  // saves the username
    console.log("Username saved:", username);
    categorySelectionDiv.style.display = 'block'; //show category selection
});



// Category selection buttons
document.getElementById('general-btn').addEventListener('click', () => {
    questions = generalQuestions;
    showNotification("You picked General Knowledge!Test your knowledge✨");
    setTimeout(() => startQuiz(), 500); // small delay so notification shows first
});

document.getElementById('kdrama-btn').addEventListener('click', () => {
    questions = koreanentertainmentQuestions;
    showNotification("Welcome to K-World! Please enjoy the show 🍿");
    setTimeout(() => startQuiz(), 500);
});
