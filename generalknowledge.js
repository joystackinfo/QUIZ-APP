const generalQuestions = [

    // 1 Tech
    {
        question: "What does CPU stand for?",
        answers: [
            { text: "Central Processing Unit", correct: true },
            { text: "Computer Personal Unit", correct: false },
            { text: "Control Program Universe", correct: false },
            { text: "Central Program User", correct: false }
        ]
    },
    // 2 History
    {
        question: "In which year did World War II end?",
        answers: [
            { text: "1939", correct: false },
            { text: "1945", correct: true },
            { text: "1970", correct: false },
            { text: "1940", correct: false }
        ]
    },
    // 3 Animal
    {
        question: "Which animal is the fastest land runner?",
        answers: [
            { text: "Horse", correct: false },
            { text: "Cheetah", correct: true },
            { text: "Tiger", correct: false },
            { text: "Rabbit", correct: false }
        ]
    },
    // 4 Sport
    {
        question: "Which country won the FIFA World Cup in 2018?",
        answers: [
            { text: "Brazil", correct: false },
            { text: "Paris", correct: false },
            { text: "Germany", correct: false },
            { text: "France", correct: true }
        ]
    },
    // 5 Lifestyle
    {
        question: "Which drink is known as 'the world's most popular stimulant'?",
        answers: [
            { text: "Coffee", correct: true },
            { text: "Tea", correct: false },
            { text: "Energy Drink", correct: false },
            { text: "Cocoa", correct: false }
        ]
    },
    // 6 Country
    {
        question: "What is the smallest country in the world?",
        answers: [
            { text: "Monaco", correct: false },
            { text: "Vatican City", correct: true },
            { text: "Malta", correct: false },
            { text: "Liechtenstein", correct: false }
        ]
    },
    // 7 Tech
    {
        question: "Which company created Android OS?",
        answers: [
            { text: "Apple", correct: false },
            { text: "Samsung", correct: false },
            { text: "Microsoft", correct: false },
            { text: "Google", correct: true }
        ]
    },
    // 8 History
    {
        question: "Who was known as the 'Iron Lady'?",
        answers: [
            { text: "Indira Gandhi", correct: false },
            { text: "Golda Meir", correct: false },
            { text: "Angela Merkel", correct: false },
            { text: "Margaret Thatcher", correct: true  }
        ]
    },
    // 9 Animal
    {
        question: "Which bird is a universal symbol of peace?",
        answers: [
            { text: "Dove", correct: true },
            { text: "bird", correct:false },
            { text: "Owl", correct: false },
            { text: "Parrot", correct: false }
        ]
    },
    // 10 Sport
    {
        question: "How many players are on a basketball team on the court?",
        answers: [
            { text: "7", correct: false },
            { text: "5", correct: true },
            { text: "6", correct: false },
            { text: "4", correct: false }
        ]
    },
    // 11 Lifestyle
    {
        question: "Which fashion capital is known as 'the city of lights'?",
        answers: [
            { text: "Paris", correct: true },
            { text: "Milan", correct: false },
            { text: "New York", correct: false },
            { text: "London", correct: false }
        ]
    },
    // 12 Country
    {
        question: "Mount Everest lies between which two countries?",
        answers: [
            { text: "India & Pakistan", correct: false },
            { text: "Bhutan & Nepal", correct: false },
            { text: "Nepal & China", correct: true },
            { text: "China & Mongolia", correct: false }
        ]
    },
    // 13 Tech
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "HyperText Markup Language", correct: true },
            { text: "HighText Machine Language", correct: false },
            { text: "Home Tool Markup Language", correct: false },
            { text: "Hyperlink Text Management Language", correct: false }
        ]
    },
    // 14 History
    {
        question: "Who discovered America in 1492?",
        answers: [
            { text: "Christopher Chris", correct: false },
            { text: "Marco Polo", correct: false },
            { text: "Ferdinand Magellan", correct: false },
            { text: "Christopher Columbus", correct: true }
        ]
    },
    // 15 Animal
    {
        question: "What is the largest mammal in the world?",
        answers: [
            { text: "Elephant", correct: false },
            { text: "Blue Whale", correct: true },
            { text: "Giraffe", correct: false },
            { text: "Shark", correct: false }
        ]
    },
    // 16 Sport
    {
        question: "Which sport is known as 'the king of sports'?",
        answers: [
            {  text: "Football (Soccer)", correct: true },
            { text: "Basketball", correct: false },
            { text: "Tennis", correct: false },
            { text: "Cricket", correct: false }
        ]
    },
    // 17 Lifestyle
    {
        question: "Which fruit is traditionally given to teachers?",
        answers: [
            { text: "Banana", correct: false },
            { text: "Apple", correct: true },
            { text: "Orange", correct: false },
            { text: "Pear", correct: false }
        ]
    },
    // 18 Country
    {
        question: "Which country is famous for samba dance and carnival?",
        answers: [
            { text: "Argentina", correct: false },
            { text: "Brazil", correct: true },
            { text: "Spain", correct: false },
            { text: "Mexico", correct: false }
        ]
    },
    // 19 Tech
    {
        question: "What does 'URL' stand for?",
        answers: [
            { text: "Uniform Resource Locator", correct: true },
            { text: "Universal Reference Link", correct: false },
            { text: "User Resource Language", correct: false },
            { text: "Unified Routing List", correct: false }
        ]
    },
    // 20 History
    {
        question: "Who was the first President of the United States?",
        answers: [
            { text: "George Washington", correct: true },
            { text: "Abraham Lincoln", correct: false },
            { text: "Thomas Jefferson", correct: false },
            { text: "John Adams", correct: false }
        ]
    },
    // 21 Animal
    {
        question: "How many legs does a spider have?",
        answers: [
            { text: "6", correct: false },
            { text: "8", correct: true },
            { text: "10", correct: false },
            { text: "12", correct: false }
        ]
    },
    // 22 Sport
    {
        question: "Which country hosted the 2020 Summer Olympics (held in 2021)?",
        answers: [
            { text: "China", correct: false },
            { text: "Japan", correct: true },
            { text: "Brazil", correct: false },
            { text: "UK", correct: false }
        ]
    },
    // 23 Lifestyle
    {
        question: "Which instrument has 88 keys?",
        answers: [
            { text: "Piano", correct: true },
            { text: "Guitar", correct: false },
            { text: "Violin", correct: false },
            { text: "Drums", correct: false }
        ]
    },
    // 24 Country
    {
        question: "Which country has the Eiffel Tower?",
        answers: [
            { text: "France", correct: true },
            { text: "Italy", correct: false },
            { text: "Spain", correct: false },
            { text: "Germany", correct: false }
        ]
    },
    // 25 Tech
    {
        question: "Which social media platform was launched first?",
        answers: [
            { text: "MySpace", correct: true },
            { text: "Facebook", correct: false },
            { text: "TikTok", correct: false },
            { text: "Instagram", correct: false }
        ]
    },
    // 26 History
    {
        question: "Who invented the light bulb?",
        answers: [
            { text: "Thomas Edison", correct: true },
            { text: "Nikola Tesla", correct: false },
            { text: "Alexander Graham Bell", correct: false },
            { text: "Benjamin Franklin", correct: false }
        ]
    },

    






























]
export default generalQuestions;