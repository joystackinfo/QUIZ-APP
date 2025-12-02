const questions = [
    {
        question: "Which language runs in a web browser?",
        answers: [
            { text: "JavaScript" },
            { text: "Python" },
            { text: "C#" },
            { text: "Java" }
        ]
    },
    {
        question: "What does CSS stand for?",
        answers: [
            { text: "Central Style Sheets" },
            { text: "Cascading Style Sheets" },
            { text: "Cascading Simple Sheets" },
            { text: "Cars SUVs Sailboats" }
        ]
    },
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "HyperText Markup Language" },
            { text: "Hyperlinks and Text Markup Language" },
            { text: "Home Tool Markup Language" },
            { text: "Hyperlinking Text Marking Language" }
        ]
    }
];

const questionElement = document.getElementById("question"); // get question element
const answerButtonElement = document.getElementById("answer-buttons"); // get answers container
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
    });
}



// start the quiz when the page loads
startQuiz();

