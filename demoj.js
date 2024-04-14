// グローバル設定
let penaltyThreshold = 5; // ミスタイプのペナルティ閾値
let typingDuration = 10; // 入力セッションの秒数
let strategyDuration = 15; // 作戦タイムの秒数

let sessionCount = 0;
let sessionCounts = [{ slaps: 0, chars: 0, cheated: false, score: 0 }, { slaps: 0, chars: 0, cheated: false, score: 0 }, { slaps: 0, chars: 0, cheated: false, score: 0 }];

let userId1, userId2;

function confirmId() {
  userId1 = document.getElementById('userId1').value;
  userId2 = document.getElementById('userId2').value;
  document.getElementById('userId1').style.display = 'none';
  document.getElementById('userId2').style.display = 'none';
  document.querySelector('button[onclick="confirmId()"]').style.display = 'none';
  document.getElementById('startButton').style.display = 'block';
}

document.getElementById('startButton').addEventListener('click', function() {
    this.style.display = 'none';
    startSession();
});

function startSession() {
    if (sessionCount < 3) {
        countdown(3, startTypingSession);
    } else {
        displayFinalRecord();
    }
}

function countdown(duration, callback) {
    let timeLeft = duration;
    const countdownElement = document.getElementById('countdown');
    countdownElement.innerText = timeLeft;

    const timer = setInterval(() => {
        timeLeft--;
        countdownElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdownElement.innerText = '';
            callback();
        }
    }, 1000);
}

function startTypingSession() {
    document.getElementById('sessionNumber').innerText = `セッション ${sessionCount + 1}`;
    document.getElementById('strategyTime').innerText = '';
    document.getElementById('result').innerText = '';
    sessionCounts[sessionCount].cheated = false;
    document.getElementById('textInput').disabled = false;
    document.getElementById('textInput').value = '';
    document.getElementById('textInput').focus();

    document.getElementById('textInput').addEventListener('copy', function(e) {
        sessionCounts[sessionCount].cheated = true;
    });
    document.getElementById('textInput').addEventListener('paste', function(e) {
        sessionCounts[sessionCount].cheated = true;
    });

    document.getElementById('textInput').addEventListener('keydown', function(event) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            event.preventDefault();
        }
    });

    countdown(typingDuration, endTypingSession);
}

function endTypingSession() {
    document.getElementById('textInput').disabled = true;
    updateResult();
    updateSessionRecords();

    if (sessionCount < 2) {
        sessionCount++;
        strategyTime();
    } else {
        displayFinalRecord();
    }
}

function updateResult() {
    const text = document.getElementById('textInput').value.toUpperCase();
    const slapCount = (text.match(/SLAP/g) || []).length;
    const charCount = text.length;
    let mistypedCount = charCount - (slapCount * 4);
    let penalty = Math.floor(mistypedCount / penaltyThreshold);
    let score = slapCount - penalty;
    sessionCounts[sessionCount] = { slaps: slapCount, chars: charCount, cheated: sessionCounts[sessionCount].cheated, score: score };

    document.getElementById('result').innerText = `今回のスコア: ${score}`;
}


function updateSessionRecords() {
    let recordText = `各セッションの記録 (ID: ${userId1} and ${userId2}):<br>`;
    for (let i = 0; i <= sessionCount; i++) {
        let count = sessionCounts[i];
        let sessionLabel = count.cheated ? `セッション ${i + 1}*: ` : `セッション ${i + 1}: `;
        let mistypedCount = count.chars - (count.slaps * 4);
        let record = `${sessionLabel}SLAP入力数 ${count.slaps}; ミスタイプ数 ${mistypedCount}; スコア ${count.score};<br>`;
        recordText += record;
    }
    document.getElementById('record').innerHTML = recordText;
}



function strategyTime() {
    document.getElementById('strategyTime').innerHTML = `${strategyDuration} 秒間の作戦タイムです。<br>次のセッションはカウントダウンが 0 になると同時に開始されます。`;
    countdown(strategyDuration, startTypingSession);
}

function displayFinalRecord() {
    updateSessionRecords();
    document.getElementById('strategyTime').innerHTML = "SLAPタスクはこれで終了です。画面をそのままにお待ちください。<br>ありがとうございました。";
    sendGameData();
}

function sendGameData() {
  const data = {
    id1: userId1,
    id2: userId2,
    slap1: sessionCounts[0].slaps,
    tc1: sessionCounts[0].chars,
    score1: sessionCounts[0].score,
    slap2: sessionCounts[1].slaps,
    tc2: sessionCounts[1].chars,
    score2: sessionCounts[1].score,
    slap3: sessionCounts[2].slaps,
    tc3: sessionCounts[2].chars,
    score3: sessionCounts[2].score,
    cheated1: sessionCounts[0].cheated ? 1 : 0,
    cheated2: sessionCounts[1].cheated ? 1 : 0,
    cheated3: sessionCounts[2].cheated ? 1 : 0,
  };

  // ランダムな遅延を設定（0秒から10秒）
  const delay = Math.random() * 5000;

  setTimeout(() => {
    fetch('https://script.google.com/macros/s/AKfycbwxxXBIPdTMWauw22onm0-9M_j2R7HiyiQjTyamROOb-HVwFqGzgaJSbc5tFJvbEHhZpg/exec', {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    })
    .then(response => console.log('Success:', response))
    .catch(error => console.error('Error:', error));
  }, delay);
}


function updateGameRules() {
    let penaltyText = penaltyThreshold > 0 ? `しかしミスタイプは、${penaltyThreshold}文字ごとにスコアを1点減点します。` : '';
    let rulesText = `ゲームルール詳細:<br>
    1. 2人でキー入力を分担し、協力して各セッション${typingDuration}秒で、「SLAP」をできるだけ多くタイプしてください。<br>
    2. SLAPと入力された回数があなたのスコア（点数）になります。${penaltyText}<br>
    3. セッションは3回行われ、セッション間には${strategyDuration}秒の作戦タイムがあります。`;

    document.getElementById('rulesTooltip').innerHTML = rulesText;
}

document.getElementById('gameRules').addEventListener('mouseover', function() {
    document.getElementById('rulesTooltip').style.visibility = 'visible';
});

document.getElementById('gameRules').addEventListener('mouseout', function() {
    document.getElementById('rulesTooltip').style.visibility = 'hidden';
});




// ページ読み込み時と設定が変更されたときにルールを更新
window.onload = function() {
    updateGameRules();
    document.querySelector('button[onclick="confirmId()"]').addEventListener('click', confirmId);
};









