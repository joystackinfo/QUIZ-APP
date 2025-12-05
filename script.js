// Import question sets from external files
import generalQuestions from "./generalknowledge.js";
import koreanentertainmentQuestions from "./koreanentertainment.js";

// Default to general questions
let questions = generalQuestions;

// Grab DOM elements
const categorySelectionDiv = document.getElementById('category-selection'); // category screen
const quizContainerDiv = document.getElementById('quiz-container'); // quiz screen
const questionElement = document.getElementById("question"); // question text
const answerButtonElement = document.getElementById("answer-btn"); // answer buttons container
const nextButton = document.getElementById("next-btn"); // next question button
const backButton = document.getElementById("back-btn"); // back to categories button

// Track quiz state
let currentQuestionIndex = 0; // current question index
let score = 0; // player score

// Start the quiz
function startQuiz() {
    currentQuestionIndex = 0; // reset to first question
    score = 0; // reset score
    nextButton.textContent = "Next"; // reset button label
    quizContainerDiv.style.display = "block"; // show quiz container
    categorySelectionDiv.style.display = "none"; // hide category selection
    showQuestion(); // load first question
}

// Show a question
function showQuestion() {
    resetState(); // clear previous state
    const currentQuestion = questions[currentQuestionIndex]; // get current question
    const questionNo = currentQuestionIndex + 1; // calculate question number
    answerButtonElement.innerHTML = ""; // clear old answer buttons

    // Display question text with progress
    questionElement.textContent = `Question ${questionNo} of ${questions.length}: ${currentQuestion.question}`;

    // Create answer buttons dynamically
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button"); // create button
        button.type = "button";
        button.textContent = answer.text; 
        button.classList.add("btn"); 
        if (answer.correct) {
            button.dataset.correct = answer.correct; // mark correct answer
        }
        button.addEventListener("click", selectAnswer); // add click handler
        answerButtonElement.appendChild(button); // add to container
    });
}

// Reset state for next question
function resetState() {
    nextButton.style.display = "none"; // hide next button
    while (answerButtonElement.firstChild) {
        answerButtonElement.removeChild(answerButtonElement.firstChild); // remove old buttons
    }
}

// Category button listeners
document.getElementById("general-btn").addEventListener("click", () => {
    questions = generalQuestions; // load general questions
    alert("You picked General Knowledge! Vibe check activated ✨");
    startQuiz(); // start quiz
});

document.getElementById("kdrama-btn").addEventListener("click", () => {
    questions = koreanentertainmentQuestions; // load K-entertainment questions
    alert("Welcome to K-World! Grab your popcorn 🍿");
    startQuiz(); // start quiz
});

// Handle answer selection
function selectAnswer(e) {
    const selectBtn = e.target; // selected button
    const isCorrect = selectBtn.dataset.correct === "true"; // check correctness
    if (isCorrect) {
        selectBtn.classList.add("correct"); // highlight correct
        score++; // increase score
    } else {
        selectBtn.classList.add("incorrect"); // highlight incorrect
    }

    // Show correct answer and disable all buttons
    Array.from(answerButtonElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true; // disable after selection
    });

    nextButton.style.display = "block"; // show next button
}

// Handle next button click
function handlenextButton() {
    currentQuestionIndex++; // move to next question
    if (currentQuestionIndex < questions.length) {
        showQuestion(); // show next question
    } else {
        showScore(); // show final score
    }
}

// Show final score
function showScore() {
    resetState(); // clear old buttons
    questionElement.textContent = `You scored ${score} out of ${questions.length}! 🎉`; // display score
    nextButton.textContent = "Play Again"; // change button label
    nextButton.style.display = "block"; // show play again
    backButton.style.display = "block"; // show back to categories
}

// Back to categories button
backButton.addEventListener("click", () => {
    quizContainerDiv.style.display = "none"; // hide quiz
    categorySelectionDiv.style.display = "block"; // show categories
    backButton.style.display = "none"; // hide back button until needed
});

// Next button listener
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handlenextButton(); // go to next question
    } else {
        startQuiz(); // restart quiz
    }
});

