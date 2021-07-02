export const calculateTimeLeft = () => {
  const d = new Date();
  const h = d.getHours()
  const m = d.getMinutes()
  const s = d.getSeconds()
  const secondsUntilEndOfDay = 24 * 60 * 60 - h * 60 * 60 - m * 60 - s;

  if (secondsUntilEndOfDay < 1) {
    return null;
  }

  let hours = secondsUntilEndOfDay / 3600;
  let minutes = (hours - Math.floor(hours)) * 60;
  let seconds = (minutes - Math.floor(minutes)) * 60;

  let timeLeft = {
    hours: Math.floor(hours),
    minutes: Math.floor(minutes),
    seconds: Math.floor(seconds),
  };

  return timeLeft
};


export const tasksNotFinished = (myday) => myday.some(task => !task.checked)