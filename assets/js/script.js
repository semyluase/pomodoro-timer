const btnBreakIncrase = document.querySelector('.break-increment');
const btnBreakDecrase = document.querySelector('.break-decrement');
const btnSessionIncrase = document.querySelector('.session-increment');
const btnSessionDecrase = document.querySelector('.session-decrement');
const breakLabel = document.querySelector('.break-length');
const sessionLabel = document.querySelector('.session-length');
const timeLabel = document.querySelector('.timer-label');
const timeLeftLabel = document.querySelector('.time-left');
const btnStart = document.querySelector('.start');
const btnStop = document.querySelector('.stop');
const btnReset = document.querySelector('#reset');
const beepAudio = document.querySelector('#beep');
let pauseStats = false;
let startTimer;
let playSound = false;

const loadData = () => {
    breakLabel.innerHTML = '5';
    sessionLabel.innerHTML = '25';
    timeLabel.innerHTML = 'Session';
    timeLeftLabel.innerHTML = '25:00';
};

btnBreakDecrase.addEventListener('click', () => {
    let total = parseInt(breakLabel.innerHTML);
    if (total <= 1) return;
    total--;
    timeLeftLabel.innerHTML = timer('break', total, 0);
    breakLabel.innerHTML = total;
});

btnBreakIncrase.addEventListener('click', () => {
    let total = parseInt(breakLabel.innerHTML);
    if (total >= 60) return;
    total++;
    timeLeftLabel.innerHTML = timer('break', total, 0);
    breakLabel.innerHTML = total;
});

btnSessionDecrase.addEventListener('click', () => {
    let total = parseInt(sessionLabel.innerHTML);
    if (total <= 1) return;
    total--;
    timeLeftLabel.innerHTML = timer('session', total, 0);
    sessionLabel.innerHTML = total;
});

btnSessionIncrase.addEventListener('click', () => {
    let total = parseInt(sessionLabel.innerHTML);
    if (total >= 60) return;
    total++;
    timeLeftLabel.innerHTML = time('session', total, 0);
    sessionLabel.innerHTML = total;
});

btnStart.addEventListener('click', () => {
    btnStart.classList.add('inactive');
    btnStop.classList.remove('inactive');
    let timeSessionMinutes,
        timeBreakMinutes,
        timeSessionSeconds,
        timeBreakSeconds;
    if (!pauseStats) {
        timeSessionMinutes = parseInt(sessionLabel.innerHTML);
        timeBreakMinutes = parseInt(breakLabel.innerHTML);
        timeSessionSeconds = 0;
        timeBreakSeconds = 0;
    } else {
        const timeString = timeLeftLabel.innerHTML.split(':');
        const prevStats = timeLabel.innerHTML;
        if (prevStats == 'Session') {
            timeSessionMinutes = parseInt(timeString[0]);
            timeSessionSeconds = parseInt(timeString[1]);
            timeBreakMinutes = parseInt(breakLabel.innerHTML);
            timeBreakSeconds = 0;
        } else {
            timeSessionMinutes = 0;
            timeSessionSeconds = 0;
            timeBreakMinutes = parseInt(timeString[0]);
            timeBreakSeconds = parseInt(timeString[1]);
        }
    }
    startTimer = setInterval(() => {
        if (timeSessionSeconds != 0) {
            timeSessionSeconds--;
            timeLeftLabel.innerHTML = timer(
                'session',
                timeSessionMinutes,
                timeSessionSeconds,
            );
        } else if (timeSessionMinutes != 0 && timeSessionSeconds == 0) {
            timeSessionSeconds = 59;
            timeSessionMinutes--;
            timeLeftLabel.innerHTML = timer(
                'session',
                timeSessionMinutes,
                timeSessionSeconds,
            );
        } else if (
            timeSessionMinutes == 0 &&
            timeSessionSeconds == 0 &&
            (timeBreakMinutes != 0 || timeBreakSeconds != 0)
        ) {
            if (!playSound) {
                beepAudio.play();
                playSound = true;
            }
            if (timeBreakSeconds != 0) {
                timeBreakSeconds--;
                timeLeftLabel.innerHTML = timer(
                    'break',
                    timeBreakMinutes,
                    timeBreakSeconds,
                );
            } else {
                timeBreakSeconds = 59;
                timeBreakMinutes--;
                timeLeftLabel.innerHTML = timer(
                    'break',
                    timeBreakMinutes,
                    timeBreakSeconds,
                );
            }
        } else {
            playSound = false;
            beepAudio.play();
            timeSessionMinutes = parseInt(sessionLabel.innerHTML);
            timeBreakMinutes = parseInt(breakLabel.innerHTML);
            timeSessionSeconds = 0;
            timeBreakSeconds = 0;
        }
    }, 1000);
});

btnReset.addEventListener('click', () => {
    breakLabel.innerHTML = 5;
    sessionLabel.innerHTML = 25;
    timeLabel.innerHTML = 'Session';
    timeLeftLabel.innerHTML = '25:00';
    playSound = false;
    clearInterval(startTimer);
    pauseStats = false;
    btnStart.classList.remove('inactive');
    btnStop.classList.add('inactive');
});

btnStop.addEventListener('click', () => {
    if (pauseStats) {
        return (pauseStats = false);
    } else {
        clearInterval(startTimer);
        btnStart.classList.remove('inactive');
        btnStop.classList.add('inactive');
        return (pauseStats = true);
    }
});

const timer = (name, minutes, second) => {
    const timeString = timeLeftLabel.innerHTML.split(':');
    if (name === 'break') {
        timeLabel.innerHTML = 'Break';
        timeString[0] = minutes.toString().padStart(2, '0');
        if (second === 0) {
            timeString[1] = '00';
        } else {
            timeString[1] = second.toString().padStart(2, '0');
        }
    } else {
        timeLabel.innerHTML = 'Session';
        timeString[0] = minutes.toString().padStart(2, '0');
        if (second === 0) {
            timeString[1] = '00';
        } else {
            timeString[1] = second.toString().padStart(2, '0');
        }
    }
    return timeString[0] + ':' + timeString[1];
};

loadData();