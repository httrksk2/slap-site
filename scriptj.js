let sessionCount = 0;
let sessionCounts = [{ slaps: 0, chars: 0, cheated: false }, { slaps: 0, chars: 0, cheated: false }, { slaps: 0, chars: 0, cheated: false }];

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
	
    countdown(60, endTypingSession);
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
    let recordText = '各セッションの記録:<br>';
    sessionCounts.forEach((count, index) => {
        let sessionLabel = count.cheated ? `セッション ${index + 1}*: ` : `セッション ${index + 1}: `;
        let record = `${sessionLabel}SLAP入力数: ${count.slaps} (総入力文字数: ${count.chars})`;
        recordText += `${record};<br>`;
    });
    document.getElementById('record').innerHTML = recordText;
}


function strategyTime() {
    document.getElementById('strategyTime').innerHTML = "90秒間の作戦タイムです。<br>次のセッションはカウントダウンが0になると同時に開始されます。";
    countdown(90, startTypingSession);
}

function displayFinalRecord() {
    updateSessionRecords();
    document.getElementById('strategyTime').innerHTML = "SLAPタスクはこれで終了です。画面をそのままにお待ちください。<br>ありがとうございました。";
}

