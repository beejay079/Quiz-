// Array of 10 JavaScript questions with options, answers, and explanations
let questions = [
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    options: ["var myVar;", "variable myVar;", "v myVar;", "let myVar"],
    answer: "var myVar;",
    explanation:
      "'var' is a valid keyword to declare variables in JavaScript. 'let' and 'const' are also used in modern JavaScript, but 'var' is the traditional way.",
  },
  {
    question: "Which of these is a JavaScript data type?",
    options: ["String", "Method", "Class", "Loop"],
    answer: "String",
    explanation:
      "JavaScript has primitive data types like String, Number, Boolean, etc. 'Method', 'Class', and 'Loop' are not data types.",
  },
  {
    question: "What does 'NaN' stand for in JavaScript?",
    options: [
      "Not a Number",
      "New Array Notation",
      "Null and Negative",
      "No Assignment Number",
    ],
    answer: "Not a Number",
    explanation:
      "'NaN' represents a value that is not a valid number, often resulting from invalid mathematical operations.",
  },
  {
    question: "How do you write a comment in JavaScript?",
    options: ["<!-- Comment -->", "// Comment", "# Comment", "/* Comment */"],
    answer: "// Comment",
    explanation:
      "Single-line comments in JavaScript use '//'. '/* */' is for multi-line comments, while the others are incorrect.",
  },
  {
    question: "What is the output of '2' + 2 in JavaScript?",
    options: ["4", "22", "NaN", "Error"],
    answer: "22",
    explanation:
      "In JavaScript, '+' with a string concatenates, so '2' + 2 results in the string '22'.",
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["pop()", "push()", "shift()", "unshift()"],
    answer: "push()",
    explanation:
      "'push()' adds an element to the end of an array, while 'pop()' removes from the end, 'shift()' removes from the start, and 'unshift()' adds to the start.",
  },
  {
    question: "What does '=== ' operator do?",
    options: [
      "Checks equality without type coercion",
      "Assigns a value",
      "Checks equality with type coercion",
      "Compares length",
    ],
    answer: "Checks equality without type coercion",
    explanation:
      "'===' checks both value and type, unlike '==' which coerces types before comparison.",
  },
  {
    question: "Which keyword stops a loop in JavaScript?",
    options: ["exit", "stop", "break", "end"],
    answer: "break",
    explanation:
      "'break' exits a loop immediately, while the other options are not valid for this purpose.",
  },
  {
    question: "What is the purpose of 'console.log()'?",
    options: [
      "Display output in console",
      "Save data to file",
      "Create a loop",
      "Define a function",
    ],
    answer: "Display output in console",
    explanation:
      "'console.log()' outputs data to the browser's console for debugging or logging purposes.",
  },
  {
    question: "How do you define a function in JavaScript?",
    options: [
      "function myFunc() {}",
      "func myFunc() {}",
      "def myFunc() {}",
      "method myFunc() {}",
    ],
    answer: "function myFunc() {}",
    explanation:
      "Functions in JavaScript are defined using the 'function' keyword followed by the name and parentheses.",
  },
];

// State variables for quiz management
let currentQuestionIndex = 0; // Tracks current question
let score = 0; // Counts correct answers
let userAnswers = Array(questions.length).fill(null); // Stores user answers
let timer; // Timer for per-question time
let timeLeft = 5; // 5 seconds per question
let carryOverTime = 0; // Remaining seconds to carry over

// DOM element references
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const optionsDiv = document.getElementById("options");
const questionNumber = document.getElementById("question-number");
const timerDisplay = document.getElementById("time-left");
const scoreDisplay = document.getElementById("score");
const feedbackDisplay = document.getElementById("feedback");
const solutionsDiv = document.getElementById("solutions");
const progressBar = document.getElementById("progress");
const questionIndicators = document.getElementById("question-indicators");

// Event listeners for buttons
document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", restartQuiz);

// Shuffle array using Fisher-Yates algorithm with validation
function shuffleArray(array) {
  if (!Array.isArray(array) || array.length === 0) {
    console.error("Invalid or empty array provided to shuffleArray");
    return array;
  }
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Start the quiz, show first question
function startQuiz() {
  // Validate questions array
  if (!Array.isArray(questions) || questions.length === 0) {
    console.error("Questions array is invalid or empty");
    alert("Error: No questions available. Please try again later.");
    return;
  }
  questions = shuffleArray([...questions]); // Shuffle questions
  console.log(
    "Shuffled questions:",
    questions.map((q) => q.question)
  ); // Debug log
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = Array(questions.length).fill(null);
  timeLeft = 5; // Explicitly set to 5 seconds
  carryOverTime = 0;
  startScreen.classList.add("d-none");
  quizScreen.classList.remove("d-none");
  startTimer();
  loadQuestion();
}

// Start the per-question timer
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      carryOverTime = 0;
      nextQuestion();
    }
  }, 1000);
}

// Load the current question and options
function loadQuestion() {
  const question = questions[currentQuestionIndex];
  questionText.textContent = question.question;
  questionNumber.textContent = currentQuestionIndex + 1;
  optionsDiv.innerHTML = "";
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = `btn btn-outline-primary w-100 text-start mb-2 ${
      userAnswers[currentQuestionIndex] === option
        ? "btn-primary text-white"
        : ""
    }`;
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.addEventListener("click", () => selectOption(option));
    optionsDiv.appendChild(button);
  });
  updateProgress();
  updateIndicators();
  timerDisplay.textContent = `${timeLeft}s`;
}

function updateIndicators() {
  // Ensure required variables exist
  if (!questionIndicators || !questions || !userAnswers) {
    console.error(
      "Required variables (questionIndicators, questions, or userAnswers) are not defined"
    );
    return;
  }

  // Clear existing indicators
  questionIndicators.innerHTML = "";

  // Create indicators for each question
  questions.forEach((question, index) => {
    const indicator = document.createElement("div");
    let indicatorClass = "question-indicator";

    // Check if question is answered and determine correctness
    if (userAnswers[index] !== null && userAnswers[index] !== undefined) {
      indicatorClass +=
        userAnswers[index] === question.answer ? " correct" : " incorrect";
    }

    indicator.className = indicatorClass;
    indicator.textContent = index + 1;
    indicator.setAttribute(
      "aria-label",
      `Question ${index + 1} ${
        userAnswers[index] === null
          ? "unanswered"
          : userAnswers[index] === question.answer
          ? "correct"
          : "incorrect"
      }`
    );
    indicator.addEventListener("click", () => goToQuestion(index));
    questionIndicators.appendChild(indicator);
  });
} z

// Navigate to a specific question when circle is clicked
function goToQuestion(index) {
  carryOverTime = timeLeft > 0 ? timeLeft : 0;
  clearInterval(timer);
  currentQuestionIndex = index;
  timeLeft = 5 + carryOverTime;
  startTimer();
  loadQuestion();
}

// Handle option selection and advance
function selectOption(option) {
  userAnswers[currentQuestionIndex] = option;
  carryOverTime = timeLeft > 0 ? timeLeft : 0;
  clearInterval(timer);
  updateIndicators(); // Update indicators to reflect new answer
  nextQuestion();
}

// Move to the next question or end quiz
function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    timeLeft = 5 + carryOverTime;
    startTimer();
    loadQuestion();
  } else {
    endQuiz();
  }
}

// Update progress bar
function updateProgress() {
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
  progressBar.setAttribute("aria-valuenow", progressPercent);
}

// End quiz and show results
function endQuiz() {
  clearInterval(timer);
  quizScreen.classList.add("d-none");
  resultScreen.classList.remove("d-none");
  score = userAnswers.reduce((total, answer, index) => {
    return answer === questions[index].answer ? total + 1 : total;
  }, 0);
  const total = questions.length;
  scoreDisplay.textContent = `${score} out of ${total} (${(
    (score / total) *
    100
  ).toFixed(2)}%)`;
  feedbackDisplay.textContent = getRemarks(score, total);
  showSolutions();
}

// Generate remarks based on score
function getRemarks(score, total) {
  const percentage = (score / total) * 100;
  if (percentage >= 80) return "Excellent! You're ready for JAMB!";
  if (percentage >= 70) return "Great job! You passed!";
  if (percentage >= 50) return "Fair effort. Keep practicing!";
  return "You need more practice to ace this.";
}

// Display solutions with green/red styling
function showSolutions() {
  solutionsDiv.innerHTML = "";
  questions.forEach((question, index) => {
    const solutionDiv = document.createElement("div");
    solutionDiv.className = "border p-3 rounded bg-light mb-3";
    const userAnswer = userAnswers[index] || "Not answered";
    const isCorrect = userAnswer === question.answer;
    const isUnanswered = userAnswer === "Not answered";
    solutionDiv.innerHTML = `
      <p class="fw-bold">Question ${index + 1}: ${question.question}</p>
      <p>Your Answer: <span class="${
        isCorrect
          ? "text-success"
          : isUnanswered
          ? "text-danger"
          : "text-danger"
      }">${userAnswer}</span></p>
      <p>Correct Answer: <span class="text-success">${
        question.answer
      }</span></p>
      <p>Explanation: ${question.explanation}</p>
    `;
    solutionsDiv.appendChild(solutionDiv);
  });
}

// Restart quiz, shuffle questions, return to start screen
function restartQuiz() {
  questions = shuffleArray([...questions]); // Shuffle questions for new order
  console.log(
    "Shuffled questions on restart:",
    questions.map((q) => q.question)
  ); // Debug log
  resultScreen.classList.add("d-none");
  startScreen.classList.remove("d-none");
  timeLeft = 5;
  carryOverTime = 0;
  userAnswers = Array(questions.length).fill(null);
  score = 0;
}
