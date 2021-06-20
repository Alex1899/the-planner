export const calculateTimeLeft = () => {
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var secondsUntilEndOfDay = 24 * 60 * 60 - h * 60 * 60 - m * 60 - s;

  return secondsUntilEndOfDay
};
