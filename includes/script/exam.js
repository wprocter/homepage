function pad(num) { return num < 10 ? '0' + num : num; }

document.addEventListener('DOMContentLoaded', () => {
  const clockEl = document.getElementById('clock');
  const dateEl = document.getElementById('date');
  const startEl = document.getElementById('start-time');
  const finishNormalEl = document.getElementById('finish-normal');
  const finish25El = document.getElementById('finish-25');
  const finish50El = document.getElementById('finish-50');
  const lengthInput = document.getElementById('length');
  const settingsPanel = document.getElementById('settings-panel');
  const settingsBody = document.getElementById('settings-body');
  const toggleBtn = document.getElementById('toggle-settings');
  const examNameInput = document.getElementById('exam-name');
  const centerInput = document.getElementById('center-number');
  const startBtn = document.getElementById('start-btn');
  const timeLeftEl = document.getElementById('time-left');
  const container = document.getElementById('exam-container');
  const rightPanel = document.querySelector('.right-panel');
  const enable25 = document.getElementById('enable-25');
  const enable50 = document.getElementById('enable-50');
  const row25 = document.getElementById('row-25');
  const row50 = document.getElementById('row-50');
  const panelToggle = document.getElementById('toggle-panel');

  let examTimers = {};

  function updateClock() {
    const now = new Date();
    clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    const suffix = d => (d>3&&d<21)?'th':{1:'st',2:'nd',3:'rd'}[d%10]||'th';
    const date = now.getDate();
    dateEl.textContent = `${dayNames[now.getDay()]} ${date}${suffix(date)} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  }

  function updateExamTimes() {
    const length = parseFloat(lengthInput.value);
    const start = new Date();
    const finishNormal = new Date(start.getTime() + length*60000);
    const finish25 = new Date(start.getTime() + length*1.25*60000);
    const finish50 = new Date(start.getTime() + length*1.5*60000);

    startEl.textContent = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
    finishNormalEl.textContent = `${pad(finishNormal.getHours())}:${pad(finishNormal.getMinutes())}`;
    finish25El.textContent = `${pad(finish25.getHours())}:${pad(finish25.getMinutes())}`;
    finish50El.textContent = `${pad(finish50.getHours())}:${pad(finish50.getMinutes())}`;
  }

  // Toggle settings panel
  toggleBtn.addEventListener('click', () => {
    const isHidden = settingsBody.style.display === 'none';
    settingsBody.style.display = isHidden ? 'block' : 'none';
    toggleBtn.textContent = isHidden ? '▲' : '▼';
  });

  // Checkbox show/hide extra time rows
  enable25.addEventListener('change', () => {
    row25.style.display = enable25.checked ? 'block' : 'none';
  });
  enable50.addEventListener('change', () => {
    row50.style.display = enable50.checked ? 'block' : 'none';
  });

  // Start exam and calculate times
  startBtn.addEventListener('click', () => {
    updateExamTimes(); // sets start, finish times
    document.getElementById('exam-title').textContent = examNameInput.value;
    document.getElementById('display-center').textContent = centerInput.value;
    settingsBody.style.display = 'none'; toggleBtn.textContent = '▼';

    // Clear any existing timer
    if (examTimers.countdown) clearInterval(examTimers.countdown);

    // Countdown until normal finish
    const length = parseFloat(lengthInput.value) * 60000;
    const endTime = new Date().getTime() + length;
    examTimers.countdown = setInterval(() => {
      const now = Date.now();
      const diffMs = endTime - now;
      if (diffMs <= 0) {
        timeLeftEl.textContent = '00:00';
        clearInterval(examTimers.countdown);
      } else {
        const mins = Math.floor(diffMs / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        timeLeftEl.textContent = `${pad(mins)}:${pad(secs)}`;
      }
    }, 1000);
  });

  // Toggle right-panel via bottom-left arrow
  panelToggle.addEventListener('click', () => {
    rightPanel.classList.toggle('open');
    panelToggle.textContent = rightPanel.classList.contains('open') ? '▶' : '◀';
  });

  // Initial load
  updateClock();
  setInterval(updateClock, 1000);
  // Do not call updateExamTimes until start button triggers it
});
