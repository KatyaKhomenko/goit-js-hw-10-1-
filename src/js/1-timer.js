import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputField = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

startBtn.addEventListener('click', startTimer);

let userSelectedDate = null;
let timer = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      return iziToast.error({
        position: 'topRight',
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    }
    userSelectedDate = selectedDates[0];
    startBtn.disabled = false;
  },
};

flatpickr(inputField, options);

function startTimer() {
  inputField.disabled = true;
  startBtn.disabled = true;

  timer = setInterval(updateTimer, 1000);
  return;
}

function updateTimer() {
  const timeDiff = userSelectedDate - new Date();

  if (timeDiff <= 0) {
    inputField.disabled = false;
    clearInterval(timer);
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDiff);

  daysSpan.textContent = String(days).padStart(2, 0);
  hoursSpan.textContent = String(hours).padStart(2, 0);
  minutesSpan.textContent = String(minutes).padStart(2, 0);
  secondsSpan.textContent = String(seconds).padStart(2, 0);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}



console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
