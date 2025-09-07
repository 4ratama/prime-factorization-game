// HTML要素を取得
const homeScreen = document.getElementById('homeScreen');
const gameArea = document.getElementById('gameArea');
const difficultyButtons = document.querySelectorAll('.difficultyBtn');
const selectedDifficultySpan = document.getElementById('selectedDifficulty');
const startGameBtn = document.getElementById('startGameBtn');
const homeBtn = document.getElementById('homeBtn');
const highScoreElement = document.getElementById('highScore');

const problemElement = document.getElementById('problem');
const answerInput = document.getElementById('answerInput');
const submitButton = document.getElementById('submitButton');
const skipButton = document.getElementById('skipButton');
const resultElement = document.getElementById('result');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');

const keypad = document.getElementById('keypad');

// ゲームの状態を管理する変数
let correctPrimeFactors;
let score = 0;
let timeLeft = 60;
let timerId;
let currentDifficulty = null;
let highScore = 0;
let currentDifficultySettings; // 現在のゲームの難易度設定を保持

const difficultySettings = {
    easy: { min: 10, max: 100, points: 10, name: "簡単" },
    normal: { min: 100, max: 500, points: 20, name: "普通" },
    hard: { min: 500, max: 2000, points: 50, name: "難しい" },
    insane: { min: 2000, max: 10000, points: 100, name: "ゲキムズ" }
};

// --- ハイスコア機能 ---
function loadHighScore() {
    const savedHighScore = localStorage.getItem('primeGameHighScore');
    if (savedHighScore) {
        highScore = parseInt(savedHighScore, 10);
    }
    highScoreElement.textContent = highScore;
}

function saveHighScore(newScore) {
    localStorage.setItem('primeGameHighScore', newScore);
}

// --- 画面表示の切り替え ---
function showScreen(screenName) {
    if (screenName === 'home') {
        homeScreen.style.display = 'block';
        gameArea.style.display = 'none';
        if (timerId) clearInterval(timerId);
        loadHighScore();
    } else if (screenName === 'game') {
        homeScreen.style.display = 'none';
        gameArea.style.display = 'block';
    }
}

// --- イベントリスナー ---

// 難易度ボタンのクリック処理
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        difficultyButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        currentDifficulty = button.dataset.difficulty;
        selectedDifficultySpan.textContent = difficultySettings[currentDifficulty].name;
    });
});

// ゲーム開始ボタンのクリック処理
startGameBtn.addEventListener('click', () => {
    if (currentDifficulty) {
        startGame(currentDifficulty);
    } else {
        alert('難易度を選んでください！');
    }
});

// ホームへ戻るボタンのクリック処理
homeBtn.addEventListener('click', () => {
    showScreen('home');
});

// 判定ボタンのクリック処理
submitButton.addEventListener('click', () => {
    const userAnswer = parseUserInput(answerInput.value);
    const isCorrect = userAnswer.length === correctPrimeFactors.length &&
                      userAnswer.every((val, index) => val === correctPrimeFactors[index]);

    if (isCorrect) {
        resultElement.textContent = '正解です！';
        resultElement.style.color = 'green';
        
        const basePoints = currentDifficultySettings.points;
        const problemNumber = correctPrimeFactors.reduce((a, b) => a * b, 1);
        const bonusPoints = Math.floor(Math.log10(problemNumber)) * 5;
        score += basePoints + bonusPoints;
        scoreElement.textContent = score;

        currentDifficultySettings.min = Math.floor(currentDifficultySettings.min * 1.1);
        currentDifficultySettings.max = Math.floor(currentDifficultySettings.max * 1.2);
        
        generateNewProblem();
    } else {
        resultElement.textContent = '不正解です。もう一度挑戦！';
        resultElement.style.color = 'red';
    }
});

// スキップボタンのクリック処理
skipButton.addEventListener('click', () => {
    resultElement.textContent = `スキップしました。正解は ${correctPrimeFactors.join('*')} でした。`;
    resultElement.style.color = 'blue';
    generateNewProblem();
});

// キーパッドのクリック処理
keypad.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName !== 'BUTTON' || target.id === 'submitButton' || target.id === 'skipButton') {
        return;
    }
    const value = target.dataset.value;
    if (value === 'del') {
        answerInput.value = answerInput.value.slice(0, -1);
    } else if (value) {
        answerInput.value += value;
    }
});

// Enterキーでの判定処理
answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        submitButton.click();
    }
});

// --- ゲーム本体の関数 ---

function startGame(difficulty) {
    currentDifficultySettings = { ...difficultySettings[difficulty] };
    score = 0;
    timeLeft = 60;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    answerInput.disabled = false;
    submitButton.disabled = false;
    skipButton.disabled = false;
    showScreen('game');
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

            if (score > highScore) {
                highScore = score;
                saveHighScore(highScore);
                resultElement.textContent = `新記録！ ファイナルスコア: ${score}`;
            } else {
                resultElement.textContent = `ファイナルスコア: ${score}`;
            }
        }
    }, 1000);
}

function generateNewProblem() {
    const settings = currentDifficultySettings;
    const range = settings.max - settings.min + 1;
    let num = Math.floor(Math.random() * range) + settings.min;
    while (getPrimeFactors(num).length <= 1 || num > settings.max) {
        num = Math.floor(Math.random() * range) + settings.min;
    }
    problemElement.textContent = `問題: ${num} を素因数分解してください。`;
    answerInput.value = '';
    resultElement.textContent = '';
    correctPrimeFactors = getPrimeFactors(num);
    console.log(`正解 (Min:${settings.min}, Max:${settings.max}):`, correctPrimeFactors.join('*'));
}

// --- ヘルパー関数 ---
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

// --- 初期化処理 ---
loadHighScore();
showScreen('home');