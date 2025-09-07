// HTML要素をJavaScriptで操作できるように取得
const problemElement = document.getElementById('problem');
const answerInput = document.getElementById('answerInput');
const submitButton = document.getElementById('submitButton');
const skipButton = document.getElementById('skipButton');
const resultElement = document.getElementById('result');
const timerElement = document.getElementById('timer'); // NEW! タイマー表示エリア
const scoreElement = document.getElementById('score'); // NEW! スコア表示エリア

let currentProblemNumber;
let correctPrimeFactors;

// --- NEW! ゲームの状態に関する変数を追加 ---
let score = 0; // スコア
let timeLeft = 60; // 残り時間（秒）
let timerId; // タイマーを管理するためのID

// --- 素因数分解のヘルパー関数 ---
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

// --- ゲームの機能 ---

// 新しい問題を設定する関数
function generateNewProblem() {
    currentProblemNumber = Math.floor(Math.random() * 91) + 10;
    while (getPrimeFactors(currentProblemNumber).length <= 1) {
        currentProblemNumber = Math.floor(Math.random() * 91) + 10;
    }
    problemElement.textContent = `問題: ${currentProblemNumber} を素因数分解してください。`;
    answerInput.value = '';
    resultElement.textContent = '';
    correctPrimeFactors = getPrimeFactors(currentProblemNumber);
    console.log("正解 (デバッグ用):", correctPrimeFactors.join('*'));
}

// 判定ボタンがクリックされた時の処理
submitButton.addEventListener('click', () => {
    const userAnswer = parseUserInput(answerInput.value);
    const isCorrect = userAnswer.length === correctPrimeFactors.length &&
                      userAnswer.every((val, index) => val === correctPrimeFactors[index]);

    if (isCorrect) {
        resultElement.textContent = '正解です！';
        resultElement.style.color = 'green';
        
        // --- NEW! スコアを加算して表示を更新 ---
        score += 10; // 正解したら10点加算
        scoreElement.textContent = score;

        generateNewProblem(); // 次の問題へ
    } else {
        resultElement.textContent = '不正解です。もう一度挑戦！';
        resultElement.style.color = 'red';
    }
});

// スキップボタンがクリックされた時の処理
skipButton.addEventListener('click', () => {
    resultElement.textContent = `スキップしました。正解は ${correctPrimeFactors.join('*')} でした。`;
    resultElement.style.color = 'blue';
    generateNewProblem(); // 次の問題へ
});


// --- NEW! タイマーを開始する関数 ---
function startTimer() {
    // 1秒ごと（1000ミリ秒）に中の処理を繰り返す
    timerId = setInterval(() => {
        timeLeft--; // 時間を1減らす
        timerElement.textContent = timeLeft; // 画面に表示

        // 時間が0になったら
        if (timeLeft <= 0) {
            clearInterval(timerId); // タイマーを停止
            problemElement.textContent = "時間切れ！";
            // ボタンや入力欄を無効化する
            answerInput.disabled = true;
            submitButton.disabled = true;
            skipButton.disabled = true;
        }
    }, 1000);
}

// --- NEW! ゲームを開始する関数 ---
function startGame() {
    score = 0;
    timeLeft = 60;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    
    // ボタンや入力欄を有効化する（時間切れ後のリスタート用）
    answerInput.disabled = false;
    submitButton.disabled = false;
    skipButton.disabled = false;

    generateNewProblem();
    startTimer();
}

// ページが読み込まれたときにゲームを開始
startGame();