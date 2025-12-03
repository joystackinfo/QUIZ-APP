const questions = [
    {
        question: "Which language runs in a web browser?",
        answers: [
            { text: "JavaScript", correct: true },
            { text: "Python", correct: false },
            { text: "C#", correct: false },
            { text: "Java", correct: false }
        ]
    },
    {
        question: "What does CSS stand for?",
        answers: [
            { text: "Central Style Sheets", correct: false },
            { text: "Cascading Style Sheets", correct: true },
            { text: "Cascading Simple Sheets", correct: false },
            { text: "Cars SUVs Sailboats", correct: false }
        ]
    },
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "HyperText Markup Language", correct: true },
            { text: "Hyperlinks and Text Markup Language", correct: false },
            { text: "Home Tool Markup Language", correct: false },
            { text: "Hyperlinking Text Marking Language", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question"); // get question element
const answerButtonElement = document.getElementById("answer-button"); // get answers container
const nextButton = document.getElementById("next-btn"); // get next button

let currentQuestionIndex = 0; // tracks the current question index
let score = 0; 

// Define questions array (adjust or extend with your real questions)


function startQuiz(){ 
    currentQuestionIndex = 0; // reset the question when the quiz starts
    score = 0; // reset the score when the quiz starts
    nextButton.textContent = "Next"; // ensure next button label
    showQuestion();
}

function showQuestion(){
    resetState(); //
    const currentQuestion = questions[currentQuestionIndex]; // get the current question 
    const questionNo = currentQuestionIndex + 1; // get the question number
    questionElement.textContent = questionNo + ". " + currentQuestion.question; // display the question and question number
    answerButtonElement.innerHTML = ""; // clear previous answer buttons
  
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button"); // create a button for each answer
        button.type = "button";
        button.textContent = answer.text; // set the button label
        button.classList.add("btn"); // add the btn class to the button
        answerButtonElement.appendChild(button); // add the button to the answer buttons div
        if (answer.correct) {
           button.dataset.correct = answer.correct; // set data for correct answer
        }
         button.addEventListener("click", selectAnswer); //add a click event listener to each answer button

    });
}

// reset the state for the next question
  function resetState(){
    nextButton.style.display = "none"; // hide the next button
    while(answerButtonElement.firstChild){
        answerButtonElement.removeChild(answerButtonElement.firstChild);// remove all answer buttons
    }
}

// function to handle answer selection
function selectAnswer(e){
    const selectBtn = e.target; //adds the selected btn element to a variable
    const isCorrect = selectBtn.dataset.correct === "true"; //chck if the answer is correct
    if (isCorrect) {
        selectBtn.classList.add("correct"); // add correct class
        score++; // increase score if correct
        
    } else {
        selectBtn.classList.add("incorrect"); // add incorrect class
        
    }
    Array.from(answerButtonElement.children).forEach(button => { //didable all answer after selection
    
        if (button.dataset.correct === "true") { //shows the correct answer
            button.classList.add("correct"); // add correct class
        }
        button.disabled = true; // disable all buttons
    }); 
    nextButton.style.display = "block"; // show the next button
}

function showScore(){
    resetState(); // reset the state
    questionElement.innerHTML = ` 🎉Hurray! You scored ${score} out of ${questions.length}! `; // show the score
    nextButton.innerHTML = "Play Again ";
    nextButton.style.display = "block"; // show the next button
}
 
function handlenextButton(){
    currentQuestionIndex++; // Increase the question index
    if (currentQuestionIndex < questions.length) { // if there are more questions
        showQuestion();
    } else {
        showScore(); // show the score if there are no more questions
    }
}

//function for next btn
nextButton.addEventListener("click", () => {
   if(currentQuestionIndex < questions.length){ // if there are more questions
           handlenextButton();
    } else {
        startQuiz(); // restart the quiz if there is no more questions
    }
});

// start the quiz when the page loads
startQuiz();
