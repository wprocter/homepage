function pad(num) {
  return num < 10 ? '0' + num : num;
}

document.addEventListener('DOMContentLoaded', () => {
  const clockEl = document.getElementById('clock');
  const dateEl = document.getElementById('date');

  function updateTime() {
    const now = new Date();

    // Digital
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;

    // Analog
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');

    const hoursForClock = now.getHours() % 12;
    const hourDeg = (hoursForClock * 30) + (now.getMinutes() * 0.5);
    const minuteDeg = now.getMinutes() * 6;
    const secondDeg = now.getSeconds() * 6;

    hourHand.style.transform = `rotate(${hourDeg - 90}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg - 90}deg)`;
    secondHand.style.transform = `rotate(${secondDeg - 90}deg)`;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const dayName = dayNames[now.getDay()];
    const dateNum = now.getDate();
    const monthName = monthNames[now.getMonth()];
    const year = now.getFullYear();

    // suffix logic
    const suffix = (d => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    })(dateNum);

    dateEl.textContent = `${dayName} ${dateNum}${suffix} ${monthName} ${year}`;
  }

  updateTime();
  setInterval(updateTime, 1000);
});
