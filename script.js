// HTML要素を取得
const homeScreen = document.getElementById('homeScreen');
const gameArea = document.getElementById('gameArea');
const difficultyButtons = document.querySelectorAll('.difficultyBtn');
const selectedDifficultySpan = document.getElementById('selectedDifficulty');
const startGameBtn = document.getElementById('startGameBtn');
const homeBtn = document.getElementById('homeBtn');

const problemElement = document.getElementById('problem');
const answerInput = document.getElementById('answerInput');
const submitButton = document.getElementById('submitButton');
const skipButton = document.getElementById('skipButton');
const resultElement = document.getElementById('result');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');

// ゲームの状態を管理する変数
let correctPrimeFactors;
let score = 0;
let timeLeft = 60;
let timerId;
let currentDifficulty = null; // 選択された難易度を保持

const difficultySettings = {
    easy: { min: 10, max: 100, points: 10, name: "簡単" },
    normal: { min: 100, max: 500, points: 20, name: "普通" },
    hard: { min: 500, max: 2000, points: 50, name: "難しい" },
    insane: { min: 2000, max: 10000, points: 100, name: "ゲキムズ" }
};

// --- 画面表示を切り替える関数 ---
function showScreen(screenName) {
    if (screenName === 'home') {
        homeScreen.style.display = 'block';
        gameArea.style.display = 'none';
        // タイマーが動いていれば止める
        if (timerId) {
            clearInterval(timerId);
        }
    } else if (screenName === 'game') {
        homeScreen.style.display = 'none';
        gameArea.style.display = 'block';
    }
}

// --- イベントリスナーの設定 ---

// 難易度ボタンがクリックされた時の処理
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 他のボタンの選択状態を解除
        difficultyButtons.forEach(btn => btn.classList.remove('selected'));
        // クリックされたボタンを選択状態にする
        button.classList.add('selected');

        currentDifficulty = button.dataset.difficulty;
        selectedDifficultySpan.textContent = difficultySettings[currentDifficulty].name;
    });
});

// ゲーム開始ボタンがクリックされた時の処理
startGameBtn.addEventListener('click', () => {
    if (currentDifficulty) { // 難易度が選択されている場合のみ
        startGame(currentDifficulty);
    } else {
        alert('難易度を選んでください！');
    }
});

// ホームへ戻るボタンがクリックされた時の処理
homeBtn.addEventListener('click', () => {
    showScreen('home');
});

// --- ゲーム本体の関数 ---

function startGame(difficulty) {
    currentDifficulty = difficulty;
    score = 0;
    timeLeft = 60;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    answerInput.disabled = false;
    submitButton.disabled = false;
    skipButton.disabled = false;

    showScreen('game'); // ゲーム画面に切り替え
    generateNewProblem();
    startTimer();
}

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            problemElement.textContent = "時間切れ！";
            answerInput.disabled = true;
            submitButton.disabled = true;
            skipButton.disabled = true;
        }
    }, 1000);
}

function generateNewProblem() {
    const settings = difficultySettings[currentDifficulty];
    const range = settings.max - settings.min + 1;
    let num = Math.floor(Math.random() * range) + settings.min;

    while (getPrimeFactors(num).length <= 1) {
        num = Math.floor(Math.random() * range) + settings.min;
    }
    problemElement.textContent = `問題: ${num} を素因数分解してください。`;
    answerInput.value = '';
    resultElement.textContent = '';
    correctPrimeFactors = getPrimeFactors(num);
    console.log(`正解 (${currentDifficulty}):`, correctPrimeFactors.join('*'));
}

submitButton.addEventListener('click', () => {
    const userAnswer = parseUserInput(answerInput.value);
    const isCorrect = userAnswer.length === correctPrimeFactors.length &&
                      userAnswer.every((val, index) => val === correctPrimeFactors[index]);

    if (isCorrect) {
        resultElement.textContent = '正解です！';
        resultElement.style.color = 'green';
        score += difficultySettings[currentDifficulty].points;
        scoreElement.textContent = score;
        generateNewProblem();
    } else {
        resultElement.textContent = '不正解です。もう一度挑戦！';
        resultElement.style.color = 'red';
    }
});

skipButton.addEventListener('click', () => {
    resultElement.textContent = `スキップしました。正解は ${correctPrimeFactors.join('*')} でした。`;
    resultElement.style.color = 'blue';
    generateNewProblem();
});


// --- 素因数分解のヘルパー関数 (変更なし) ---
function getPrimeFactors(num) {
    const factors = [];
    let divisor = 2;
    while (num > 1) {
        if (num % divisor === 0) {
            factors.push(divisor);
            num /= divisor;
        } else {
            divisor++;
        }
    }
    return factors.sort((a, b) => a - b);
}

function parseUserInput(inputString) {
    const factors = inputString.split('*').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 1);
    return factors.sort((a, b) => a - b);
}

// 初期状態ではホーム画面を表示
showScreen('home');