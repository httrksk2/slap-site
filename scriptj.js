let sessionCount = 0;
let sessionCounts = [{ slaps: 0, chars: 0, cheated: false }, { slaps: 0, chars: 0, cheated: false }, { slaps: 0, chars: 0, cheated: false }];

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

    countdown(10, endTypingSession);  //タスク入力時間！
}

function endTypingSession() {
	document.getElementById('sessionNumber').innerText = `セッション ${sessionCount + 1}`;
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
    sessionCounts[sessionCount] = { slaps: slapCount, chars: charCount, cheated: sessionCounts[sessionCount].cheated };
    document.getElementById('result').innerText = `今回のSLAP入力数: ${slapCount}`;
}

function updateSessionRecords() {
    let recordText = `各セッションの記録 (ID: ${userId1} and ${userId2}):<br>`;
    sessionCounts.forEach((count, index) => {
        let sessionLabel = count.cheated ? `セッション ${index + 1}*: ` : `セッション ${index + 1}: `;
        let record = `${sessionLabel}SLAP入力数: ${count.slaps} (総入力文字数: ${count.chars})`;
        recordText += `${record}<br>`;
    });
    document.getElementById('record').innerHTML = recordText;
}


function strategyTime() {
    document.getElementById('strategyTime').innerHTML = "90秒間の作戦タイムです。<br>次のセッションはカウントダウンが0になると同時に開始されます。";
    countdown(3, startTypingSession);   //作戦時間！
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
    score1: sessionCounts[0].slaps,
    tc1: sessionCounts[0].chars,
    score2: sessionCounts[1].slaps,
    tc2: sessionCounts[1].chars,
    score3: sessionCounts[2].slaps,
    tc3: sessionCounts[2].chars,
    cheated1: sessionCounts[0].cheated ? 1 : 0,
    cheated2: sessionCounts[1].cheated ? 1 : 0,
    cheated3: sessionCounts[2].cheated ? 1 : 0,
  };

  // ランダムな遅延を設定（0秒から10秒）
  const delay = Math.random() * 10000; // 10000ms = 10s

  setTimeout(() => {
    fetch('https://script.google.com/macros/s/AKfycbylQAqUCfzLpt_1Glnql4npDNVUXHv6GNtq3UeHqXmiaup6YWzCy0bMcLCzLdWPr92C/exec', {
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


window.onload = function() {
    document.querySelector('button[onclick="confirmId()"]').addEventListener('click', confirmId);
};

