// HTML要素をJavaScriptで操作できるように取得
const problemElement = document.getElementById('problem'); // 問題表示エリア
const answerInput = document.getElementById('answerInput'); // 答えの入力欄
const submitButton = document.getElementById('submitButton'); // 判定ボタン
const skipButton = document.getElementById('skipButton'); // スキップボタン
const resultElement = document.getElementById('result'); // 結果表示エリア

let currentProblemNumber; // 現在の問題の数字を保持する変数
let correctPrimeFactors; // 現在の問題の正しい素因数を保持する変数 (例: [2, 3, 5])

// --- 素因数分解のヘルパー関数 ---
// 引数の数値を素因数分解して配列で返す関数
function getPrimeFactors(num) {
    const factors = [];
    let divisor = 2; // 2から割り始める

    while (num > 1) {
        if (num % divisor === 0) { // 割り切れる場合
            factors.push(divisor); // 因数として追加
            num /= divisor; // 割った後の数で更新
        } else {
            divisor++; // 次の数で試す
        }
    }
    return factors.sort((a, b) => a - b); // 小さい順にソートして返す
}

// ユーザーの入力 (例: "2*3*5") を素因数の配列に変換する関数
function parseUserInput(inputString) {
    // "*" で分割し、各要素を数値に変換する。不正な値は取り除く
    const factors = inputString.split('*').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 1);
    return factors.sort((a, b) => a - b); // 小さい順にソート
}

// --- ゲームの機能 ---

// 新しい問題を設定する関数
function generateNewProblem() {
    // 簡単レベルとして、今回は10から100までの整数をランダムに生成
    currentProblemNumber = Math.floor(Math.random() * 91) + 10;
    
    // 素数や1の場合など、素因数分解できない数字はスキップする（より高度なゲームでは対処が必要）
    while (getPrimeFactors(currentProblemNumber).length <= 1) {
        currentProblemNumber = Math.floor(Math.random() * 91) + 10;
    }

    problemElement.textContent = `問題: ${currentProblemNumber} を素因数分解してください。`;
    answerInput.value = ''; // 入力欄をクリア
    resultElement.textContent = ''; // 結果表示をクリア
    
    correctPrimeFactors = getPrimeFactors(currentProblemNumber);
    console.log("正解 (デバッグ用):", correctPrimeFactors.join('*')); // 開発者ツールで正解を確認できるようにしておく
}

// 判定ボタンがクリックされた時の処理
submitButton.addEventListener('click', () => {
    const userAnswer = parseUserInput(answerInput.value);
    
    // 正しい素因数とユーザーの入力を比較
    // 配列の要素数が同じ かつ 各要素が順に同じ なら正解
    const isCorrect = userAnswer.length === correctPrimeFactors.length && 
                      userAnswer.every((val, index) => val === correctPrimeFactors[index]);

    if (isCorrect) {
        resultElement.textContent = '正解です！';
        resultElement.style.color = 'green';
        // ここにポイント加算や次の問題への移行処理を追加
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


// ページが読み込まれたときに最初の問題を表示
generateNewProblem();