let step = 0;

function timedCount() {
  step = step + 1;
  postMessage(step);
  setTimeout("timedCount()",150);
}

timedCount();