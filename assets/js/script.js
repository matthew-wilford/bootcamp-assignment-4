// script.js — Timed Quiz (Bootstrap UI) — UNSOLVED SCAFFOLD
// Instructions:
// 1) Fill in each TODO step in order.
// 2) Keep logic inside the IIFE to avoid globals.
// 3) Use console.log() liberally while building (DevTools > Console).

(function () {
  "use strict";

  // -----------------------------
  // 1) DATA (students: swap this out with your own data if you want!)
  // -----------------------------
  const questions = [
    {
      q: "What year did the Eagles win their first superbowl?",
      choices: ["2005", "2018", "2022", "2024"],
      answer: 1,
    },
    {
      q: "What year did Philadelphia experience a yellow fever outbreak?",
      choices: ["1793", "1856", "1957", "2004"],
      answer: 0,
    },
    {
      q: "What road is notorious for being dangerous to non-locals?",
      choices: [
        "I-95",
        "Kelly Drive",
        "Ben Franklin Parkway",
        "Schuylkill Expressway",
      ],
      answer: 1,
    },
    {
      q: "Who was the head coach of the Eagles in 2008?",
      choices: ["Nick Sirianni", "Doug Pederson", "Chip Kelly", "Andy Reid"],
      answer: 3,
    },
    {
      q: "What is the capital of Pennsylvania?",
      choices: ["Philadelphia", "Pittsburgh", "Harrisburg", "Allentown"],
      answer: 2,
    },
    {
      q: "What is the closest city to Philadelphia?",
      choices: ["New York City", "Baltimore", "Washington, D.C.", "Pittsburgh"],
      answer: 1,
    },
    {
      q: "What is the longest river in Pennsylvania?",
      choices: [
        "Ohio River",
        "Delaware River",
        "Schuykill River",
        "Susquehanna River",
      ],
      answer: 4,
    },
    {
      q: "What is Pennsylvania known as?",
      choices: [
        "The Keystone State",
        "The Free State",
        "The First State",
        "The Union State",
      ],
      answer: 0,
    },
    {
      q: "What Pennsylvania city is known as the Mushroom Capital of the World?",
      choices: ["Pottstown", "Moons Township", "Erie", "Kennet Square"],
      answer: 3,
    },
    {
      q: "What is the best gas station in Pennsylvania?",
      choices: ["Wawa", "Buc-ee's", "Sheetz", "Exxon"],
      answer: 0,
    },
  ];

  // -----------------------------
  // 2) STATE
  // -----------------------------
  let i = 0; // current question index
  let score = 0; // number of correct answers
  const total = questions.length;
  let timeLeft = 60; // seconds remaining
  let timerId = null; // holds the setInterval id

  // -----------------------------
  // 3) ELEMENT REFERENCES
  // -----------------------------
  // These IDs must exist in your HTML
  const qText = document.getElementById("questionText");
  const qIndex = document.getElementById("qIndex");
  const qTotal = document.getElementById("qTotal");
  const choices = document.getElementById("choices");

  const timeText = document.getElementById("timeText");
  const timeBar = document.getElementById("timeBar");
  const scoreBadge = document.getElementById("scoreBadge");
  const feedback = document.getElementById("feedback");
  const skipBtn = document.getElementById("skipBtn");

  // Result modal bits (Bootstrap)
  const resultModalEl = document.getElementById("resultModal");
  // Note: bootstrap.Modal is provided by the Bootstrap bundle (ensure <script src="...bootstrap.bundle.min.js">)
  const resultModal = new bootstrap.Modal(resultModalEl);
  const finalScore = document.getElementById("finalScore");
  const finalTime = document.getElementById("finalTime");
  const restartBtn = document.getElementById("restartBtn");

  // Initialize total in UI
  // TODO(1): set qTotal's text to total
  qTotal.textContent = total;

  // -----------------------------
  // 4) RENDER
  // -----------------------------
  function render() {
    // Header + timer labels
    // TODO(2): show current question number (i+1 but capped to total)
    qIndex.textContent = Math.min(i + 1, total);

    // TODO(3): update the score badge text to "Score: X/Y"
    scoreBadge.textContent = `Score: ${score}/${total}`;

    // TODO(4): update the time label to show remaining seconds like "60s"
    timeText.textContent = `${timeLeft}s`;

    // Progress bar width & contextual color
    // pct should be the percentage of time remaining (0..100)
    // TODO(5): compute pct = Math.max(0, Math.round((timeLeft/60)*100));
    const pct = Math.max(0, Math.round((timeLeft / 60) * 100));

    // TODO(6): set width style and the className based on pct
    timeBar.style.width = `${pct}%`;
    timeBar.className =
      "progress-bar progress-bar-striped progress-bar-animated " +
      (pct < 20 ? "bg-danger" : pct < 50 ? "bg-warning" : "bg-success");

    // End state: out of questions OR time is up
    /* TODO(7): check end condition (i >= total || timeLeft <= 0) false */
    if (i >= total || timeLeft <= 0) {
      endQuiz();
      return;
    }

    // Render current question and choices
    const q = questions[i];

    // TODO(8): set the question text
    qText.textContent = q.q;

    // TODO(9): clear previous choices (set innerHTML = '')
    choices.innerHTML = "";

    // Create a button for each choice
    q.choices.forEach((label, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-light text-dark choice-btn rounded-3";
      btn.innerHTML = `<span class="me-2 fw-semibold">${String.fromCharCode(65 + idx)}.</span> ${label}`;

      // TODO(10): on click, call handleChoice with a boolean indicating correctness
      btn.addEventListener("click", () => handleChoice(idx === q.answer));

      choices.appendChild(btn);
    });

    // Accessibility: move focus to first choice
    const firstBtn = choices.querySelector("button");
    if (firstBtn) firstBtn.focus();
  }

  // -----------------------------
  // 5) HANDLERS
  // -----------------------------
  function handleChoice(isCorrect) {
    // TODO(11): if correct, increment score and show a green badge
    if (isCorrect) {
      score++;
      feedback.innerHTML = '<span class="badge bg-success">Correct ✓</span>';
    } else {
      feedback.innerHTML = '<span class="badge bg-danger">Incorrect ✗</span>';
    }

    // OPTIONAL: time penalty (uncomment if you add it)
    // else { timeLeft = Math.max(0, timeLeft - 5); }

    // TODO(12): advance to next question index (i++)
    i++;

    // Show feedback briefly, then re-render
    setTimeout(() => {
      feedback.textContent = "";
      render();
    }, 400);
  }

  // -----------------------------
  // 6) TIMER
  // -----------------------------
  function tick() {
    // TODO(13): decrement timeLeft but not below 0
    timeLeft = Math.max(0, timeLeft - 1);

    // TODO(14): if timeLeft is 0, stop the timer (clearInterval)
    if (timeLeft === 0) {
      clearInterval(timerId);
    }

    // Re-render UI to reflect new time
    render();
  }

  function startTimer() {
    // TODO(15): create an interval that calls tick every 1000ms
    timerId = setInterval(tick, 1000);
  }

  // -----------------------------
  // 7) END + RESTART
  // -----------------------------
  function endQuiz() {
    // TODO(16): stop the timer if it's still running
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }

    // TODO(17): fill in finalScore and finalTime (e.g., "7 / 10" and "12s")
    finalScore.textContent = `${score} / ${total}`;
    finalTime.textContent = `${60 - timeLeft}s`;

    // Show Bootstrap modal
    resultModal.show();
  }

  function restart() {
    // TODO(18): reset i, score, timeLeft; then render() and startTimer()
    i = 0;
    score = 0;
    timeLeft = 60;
    render();
    startTimer();
  }

  // -----------------------------
  // 8) EVENTS & INIT
  // -----------------------------
  // Skip just advances the question index; do not change score
  // TODO(19): implement the skip click handler
  skipBtn.addEventListener("click", () => {
    i++;
    render();
  });

  // Restart from modal button
  // TODO(20): implement restart click handler
  restartBtn.addEventListener('click', restart);

  // Initial render + timer start
  // TODO(21): call render() and startTimer()
  render();
  startTimer();
})();
