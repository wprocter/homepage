document.addEventListener('DOMContentLoaded', () => {
  const toggleTime = document.getElementById('toggle-time');
  const toggleExam = document.getElementById('toggle-exam');
  const timeOverlay = document.getElementById('time-overlay');
  const examOverlay = document.getElementById('exam-overlay');
  const closeTime = document.getElementById('close-time');
  const closeExam = document.getElementById('close-exam');

  toggleTime.addEventListener('click', () => {
    timeOverlay.classList.add('open');
    examOverlay.classList.remove('open');
    // hide time toggle icon when open
    toggleTime.style.display = 'none';
    toggleExam.style.display = 'block';
  });
  toggleExam.addEventListener('click', () => {
    examOverlay.classList.add('open');
    timeOverlay.classList.remove('open');
    // hide exam toggle icon when open
    toggleExam.style.display = 'none';
    toggleTime.style.display = 'block';
  });
  closeTime.addEventListener('click', () => {
    timeOverlay.classList.remove('open');
    // restore time toggle icon when closed
    toggleTime.style.display = 'block';
  });
  closeExam.addEventListener('click', () => {
    examOverlay.classList.remove('open');
    // restore exam toggle icon when closed
    toggleExam.style.display = 'block';
  });
});
