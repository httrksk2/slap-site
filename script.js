let sessionCount = 0;
let sessionCounts = [{ slaps: 0, chars: 0 }, { slaps: 0, chars: 0 }, { slaps: 0, chars: 0 }];

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
    document.getElementById('result').innerText = '';
    sessionCount++;
    document.getElementById('strategyTime').innerText = '';
    const textInput = document.getElementById('textInput');
    textInput.disabled = false;
    textInput.value = '';
    textInput.focus();
    countdown(60, endTypingSession);
}

function endTypingSession() {
    const textInput = document.getElementById('textInput');
    textInput.disabled = true;
    showResult();

    if (sessionCount < 3) {
        strategyTime();
    } else {
        displayFinalRecord();
    }
}

function showResult() {
    const text = document.getElementById('textInput').value.toUpperCase();
    const slapCount = (text.match(/SLAP/g) || []).length;
    const charCount = text.length;
    sessionCounts[sessionCount - 1] = { slaps: slapCount, chars: charCount };
    document.getElementById('result').innerText = `Number of SLAPs: ${slapCount}`;
    updateSessionRecords();
}

function strategyTime() {
    document.getElementById('strategyTime').innerHTML = "90 sec strategy time for the team.<br>The next session will start as soon as the countdown reaches zero.";
    countdown(90, startTypingSession);
}



function updateSessionRecords() {
    let recordText = 'Session Records: \n';
    sessionCounts.forEach((count, index) => {
        recordText += `Session ${index + 1}: ${count.slaps} SLAPs (Total Characters: ${count.chars}); \n`;
    });
    document.getElementById('record').innerText = recordText;
}

function displayFinalRecord() {
    updateSessionRecords();
    document.getElementById('strategyTime').innerText = "The task is now complete. Thank you.";
}


//Slap ver 0.2 2023.11.16 Keisuke Hattori