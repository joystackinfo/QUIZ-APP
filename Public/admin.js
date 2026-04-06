
// This keeps the password safe and out of GitHub
async function verifyPassword() {
    const password = prompt("Enter admin password:");

    if (!password) {
        window.location.href = "/index.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/admin/verify-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (!data.success) {
            alert("Wrong password!");
            window.location.href = "/index.html";
        }

    } catch (error) {
        alert("Could not connect to server!");
        window.location.href = "/index.html";
    }
}

// Run password check before anything else loads
await verifyPassword();

// Base URL for all admin API calls
const BASE_URL = "http://localhost:3000/api/admin";

// SIDEBAR NAVIGATION

const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

// When a nav button is clicked, show its matching section and hide the rest
navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.section;

        // Remove active from all buttons, add to clicked one
        navButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Hide all sections, show the target one
        sections.forEach(s => {
            s.classList.remove("active");
            s.classList.add("hide");
        });

        const targetSection = document.getElementById(target);
        targetSection.classList.remove("hide");
        targetSection.classList.add("active");

        if (target === "all-questions") loadQuestions();
        if (target === "all-scores") loadScores();
    });
});


// FUNCTIONS

// Shows a success or error message below a form
// isError controls the color — red for error, green for success
function showMsg(elementId, message, isError = false) {
    const msg = document.getElementById(elementId);
    msg.textContent = message;
    msg.className = isError ? "msg error" : "msg success";
    setTimeout(() => msg.textContent = "", 3000);
}


// WELCOME PAGE

async function loadStats() {
    try {
        const [qRes, sRes] = await Promise.all([
            fetch(`${BASE_URL}/questions`),
            fetch(`${BASE_URL}/scores`)
        ]);

        const questions = await qRes.json();
        const scores = await sRes.json();

        document.getElementById("total-questions").textContent = questions.length;
        document.getElementById("total-scores").textContent = scores.length;

    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

// ADD QUESTION

async function addQuestion() {
    const question = document.getElementById("new-question").value.trim();
    const category = document.getElementById("new-category").value;
    const explanation = document.getElementById("new-explanation").value.trim();
    const answerInputs = document.querySelectorAll(".answer-input");
    const correctRadio = document.querySelector('input[name="correct-answer"]:checked');

    if (!question || !category || !explanation || !correctRadio) {
        showMsg("add-msg", "Please fill in all fields and pick the correct answer!", true);
        return;
    }

    // Map the answer inputs to an array of { text, correct } objects
    const answers = Array.from(answerInputs).map((input, index) => ({
        text: input.value.trim(),
        correct: index === parseInt(correctRadio.value)
    }));

    if (answers.some(a => !a.text)) {
        showMsg("add-msg", "Please fill in all 4 answers!", true);
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, category, answers, explanation })
        });

        const data = await res.json();

        if (res.ok) {
            showMsg("add-msg", "Question added successfully! ✅");
            document.getElementById("new-question").value = "";
            document.getElementById("new-category").value = "";
            document.getElementById("new-explanation").value = "";
            answerInputs.forEach(input => input.value = "");
            if (correctRadio) correctRadio.checked = false;
            loadStats();
        } else {
            showMsg("add-msg", data.message || "Error adding question", true);
        }

    } catch (error) {
        showMsg("add-msg", "Something went wrong!", true);
        console.error("Error adding question:", error);
    }
}
// LOAD ALL QUESTIONS

async function loadQuestions(filterCategory = "") {
    const tbody = document.getElementById("questions-tbody");
    tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

    try {
        const res = await fetch(`${BASE_URL}/questions`);
        let questions = await res.json();

        if (filterCategory) {
            questions = questions.filter(q => q.category === filterCategory);
        }

        tbody.innerHTML = "";

        if (!questions.length) {
            tbody.innerHTML = "<tr><td colspan='4'>No questions found</td></tr>";
            return;
        }

        questions.forEach((q, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${q.question}</td>
                <td>${q.category}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn" onclick="deleteQuestion('${q._id}')">Delete</button>
                </td>
            `;

            // Store the full question object directly on the button element,This avoids string escaping issues with special characters in questions
            const editBtn = row.querySelector('.edit-btn');
            editBtn.questionData = q;

            editBtn.addEventListener('click', () => {
                openEditForm(
                    editBtn.questionData._id,
                    editBtn.questionData.question,
                    editBtn.questionData.explanation || '',
                    editBtn.questionData.answers
                );
            });

            tbody.appendChild(row);
        });

    } catch (error) {
        tbody.innerHTML = "<tr><td colspan='4'>Error loading questions</td></tr>"; // Show error in table
        console.error("Error loading questions:", error);
    }
}


// DELETE QUESTION

async function deleteQuestion(id) {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
        const res = await fetch(`${BASE_URL}/questions/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (res.ok) {
            loadQuestions();
            loadStats();
        } else {
            alert(data.message || "Error deleting question");
        }

    } catch (error) {
        console.error("Error deleting question:", error);
    }
}

// =====================
// EDIT QUESTION
// =====================

// Fills the edit form with the clicked question's existing data
function openEditForm(id, question, explanation, answers) {
    const editSection = document.getElementById("edit-section");
    editSection.classList.remove("hide");

    document.getElementById("edit-id").value = id;
    document.getElementById("edit-question").value = question;
    document.getElementById("edit-explanation").value = explanation;

    const answerInputs = document.querySelectorAll(".edit-answer-input");
    answers.forEach((answer, index) => {
        answerInputs[index].value = answer.text;
        if (answer.correct) {
            document.querySelector(`input[name="edit-correct"][value="${index}"]`).checked = true;
        }
    });

    // Scroll smoothly down to the edit form
    editSection.scrollIntoView({ behavior: "smooth" });
}

async function saveEdit() {
    const id = document.getElementById("edit-id").value;
    const question = document.getElementById("edit-question").value.trim();
    const explanation = document.getElementById("edit-explanation").value.trim();
    const answerInputs = document.querySelectorAll(".edit-answer-input");
    const correctRadio = document.querySelector('input[name="edit-correct"]:checked');

    if (!question || !explanation || !correctRadio) {
        showMsg("edit-msg", "Please fill in all fields!", true);
        return;
    }

    const answers = Array.from(answerInputs).map((input, index) => ({
        text: input.value.trim(),
        correct: index === parseInt(correctRadio.value)
    }));

    try {
        const res = await fetch(`${BASE_URL}/questions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, answers, explanation })
        });

        const data = await res.json();

        if (res.ok) {
            showMsg("edit-msg", "Question updated! ✅");
            setTimeout(() => {
                document.getElementById("edit-section").classList.add("hide");
                loadQuestions();
            }, 1000);
        } else {
            showMsg("edit-msg", data.message || "Error updating", true);
        }

    } catch (error) {
        showMsg("edit-msg", "Something went wrong!", true);
        console.error("Error updating question:", error);
    }
}

function cancelEdit() {
    document.getElementById("edit-section").classList.add("hide");
}


// LOAD ALL SCORES

async function loadScores() {
    const tbody = document.getElementById("scores-tbody");
    tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

    try {
        const res = await fetch(`${BASE_URL}/scores`);
        const scores = await res.json();

        tbody.innerHTML = "";

        if (!scores.length) {
            tbody.innerHTML = "<tr><td colspan='5'>No scores yet</td></tr>";
            return;
        }

        scores.forEach((s, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${s.username}</td>
                <td>${s.category}</td>
                <td>${s.points}</td>
                <td>
                    <button class="delete-btn" onclick="deleteScore('${s._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        tbody.innerHTML = "<tr><td colspan='5'>Error loading scores</td></tr>";
        console.error("Error loading scores:", error);
    }
}


// DELETE SCORE

async function deleteScore(id) {
    if (!confirm("Are you sure you want to delete this score?")) return;

    try {
        const res = await fetch(`${BASE_URL}/scores/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (res.ok) {
            loadScores();
            loadStats();
        } else {
            alert(data.message || "Error deleting score");
        }

    } catch (error) {
        console.error("Error deleting score:", error);
    }
}

// EVENT LISTENERS
document.getElementById("add-question-btn").addEventListener("click", addQuestion);
document.getElementById("save-edit-btn").addEventListener("click", saveEdit);
document.getElementById("cancel-edit-btn").addEventListener("click", cancelEdit);

document.getElementById("filter-category").addEventListener("change", (e) => {
    loadQuestions(e.target.value);
});

// ON PAGE LOAD

loadStats();