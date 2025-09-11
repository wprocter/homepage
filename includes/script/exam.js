function pad(num) { return num < 10 ? '0' + num : num; }

  /**
   * Initialize exam timer application.
   */
  function initExam() {
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
    const setBtn = document.getElementById('set-btn');
    const timeLeftEl = document.getElementById('time-left');
    const container = document.getElementById('exam-container');
    const rightPanel = document.querySelector('.right-panel');
    const enable25 = document.getElementById('enable-25');
    const enable50 = document.getElementById('enable-50');
    const row25 = document.getElementById('row-25');
    const row50 = document.getElementById('row-50');
    const panelToggle = document.getElementById('toggle-panel');
    const settingsStartEl = document.getElementById('settings-start-time');
    const pauseOverlay = document.getElementById('pause-overlay');

    let examTimers = {};
    let isRunning = false;
    let isPaused = false;
    let startTime = null;
    let endTime = null;
    let pausedAt = null;
    let extraMs = 0; // cumulative extra time from pauses

    function updateClock() {
      const now = new Date();
      clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
      const suffix = d => (d>3&&d<21)?'th':{1:'st',2:'nd',3:'rd'}[d%10]||'th';
      const date = now.getDate();
      dateEl.textContent = `${dayNames[now.getDay()]} ${date}${suffix(date)} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    }

    /**
     * Update exam times, optionally using a provided start date
     * @param {Date} startDate 
     */
    function updateExamTimes(startDate) {
      const length = parseFloat(lengthInput.value);
      // Determine start moment: from input or now
      let start;
      if (startDate) {
        start = startDate;
      } else {
        const val = settingsStartEl.value; // input type=time, format HH:MM
        if (val) {
          const [h, m] = val.split(':').map(Number);
          start = new Date();
          start.setHours(h, m, 0, 0);
        } else {
          start = new Date();
        }
      }
      // Include any extra paused time in finish calculations
      const finishNormal = new Date(start.getTime() + length*60000 + extraMs);
      const finish25 = new Date(start.getTime() + length*1.25*60000 + extraMs);
      const finish50 = new Date(start.getTime() + length*1.5*60000 + extraMs);

      // Display start time
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

    // Set exam information without starting countdown
    setBtn.addEventListener('click', () => {
      // Populate title and center
      document.getElementById('exam-title').textContent = examNameInput.value;
      document.getElementById('display-center').textContent = "Center Number: " + centerInput.value;
      // Compute and show times based on expected start input
      updateExamTimes();
      // Show/hide extra time rows
      row25.style.display = enable25.checked ? 'block' : 'none';
      row50.style.display = enable50.checked ? 'block' : 'none';
    });

    // Initialize start/pause/resume functionality for exam button
    startBtn.addEventListener('click', () => {
      // If not started yet, start exam
      if (!isRunning) {
        isRunning = true;
        isPaused = false;
        extraMs = 0; // reset extra paused time on start
        // Use current time as actual start
        startTime = new Date();
        settingsStartEl.value = `${pad(startTime.getHours())}:${pad(startTime.getMinutes())}`;
        // Compute endTime based on length
        const lengthMs = parseFloat(lengthInput.value) * 60000;
        endTime = startTime.getTime() + lengthMs;
        // Update displayed start and finish times
        updateExamTimes(startTime);
        row25.style.display = enable25.checked ? 'block' : 'none';
        row50.style.display = enable50.checked ? 'block' : 'none';
        // Update button appearance
        startBtn.classList.remove('start', 'paused');
        startBtn.classList.add('running');
        startBtn.textContent = 'Pause';
        // Start countdown timer
        examTimers.countdown = setInterval(() => {
          const diff = endTime - Date.now();
          if (diff <= 0) {
            timeLeftEl.textContent = '00:00';
            clearInterval(examTimers.countdown);
          } else {
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            timeLeftEl.textContent = `${pad(m)}:${pad(s)}`;
          }
        }, 1000);
      }
      // If running and not paused, pause exam
      else if (isRunning && !isPaused) {
        isPaused = true;
        clearInterval(examTimers.countdown);
        pausedAt = Date.now();
        pauseOverlay.style.display = 'flex';
        // Update button appearance
        startBtn.classList.remove('running');
        startBtn.classList.add('paused');
        startBtn.textContent = 'Cont';
      }
      // If paused, resume exam
      else if (isRunning && isPaused) {
        isPaused = false;
        // Extend endTime by paused duration
        const pausedDuration = Date.now() - pausedAt;
        endTime += pausedDuration;
        // Accumulate extra paused time
        extraMs += pausedDuration;
        pauseOverlay.style.display = 'none';
        // Update displayed finish times to include extra time
        updateExamTimes(startTime);
        // Update button appearance
        startBtn.classList.remove('paused');
        startBtn.classList.add('running');
        startBtn.textContent = 'Pause';
        // Resume countdown timer
        examTimers.countdown = setInterval(() => {
          const diff = endTime - Date.now();
          if (diff <= 0) { timeLeftEl.textContent = '00:00'; clearInterval(examTimers.countdown); }
          else { const m = Math.floor(diff / 60000), s = Math.floor((diff % 60000) / 1000); timeLeftEl.textContent = `${pad(m)}:${pad(s)}`; }
        }, 1000);
      }
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
  }

  // Run initExam after full page load
  window.addEventListener('load', initExam);
