console.log("Renderer script loaded");
console.log("Electron API:", window.electron);

const { electron } = window;

if (!electron) {
  console.error("Electron API is not exposed");
} else if (!electron.robot) {
  console.error("robot API is not available");
} else {
  console.log("robot API is available");
}

let recording = false;
let recordedActions = [];

const startBtn = document.getElementById("start-recording");
const stopBtn = document.getElementById("stop-recording");
const replayBtn = document.getElementById("replay-actions");

startBtn.addEventListener("click", () => {
  console.log("Start Recording clicked");
  recording = true;
  recordedActions = [];
  startBtn.disabled = true;
  stopBtn.disabled = false;
  replayBtn.disabled = true;
  console.log("Recording started...");
});

stopBtn.addEventListener("click", () => {
  console.log("Stop Recording clicked");
  recording = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  replayBtn.disabled = false;
  console.log("Recording stopped.");
  console.log(recordedActions)
});

replayBtn.addEventListener("click", () => {
  console.log("Replay clicked");
  replayActions();
});

document.addEventListener("mousemove", (event) => {
  if (recording) {
    recordedActions.push({
      type: "mousemove",
      x: event.clientX,
      y: event.clientY,
      time: Date.now(),
    });
    console.log(`Mouse moved to (${event.clientX}, ${event.clientY})`);
  }
});

document.addEventListener("click", (event) => {
  if (recording) {
    recordedActions.push({
      type: "click",
      x: event.clientX,
      y: event.clientY,
      time: Date.now(),
    });
    console.log(`Mouse clicked at (${event.clientX}, ${event.clientY})`);
  }
});

function replayActions() {
  if (recordedActions.length === 0) {
    console.log("No actions recorded to replay.");
    return;
  }

  console.log("Replaying actions...");
  let startTime = recordedActions[0].time;

  recordedActions.forEach((action) => {
    let delay = action.time - startTime;

    setTimeout(() => {
      if (action.type === "mousemove") {
        if (electron && electron.robot) {
          electron.robot.moveMouse(action.x, action.y);
          console.log(`Replayed mouse move to (${action.x}, ${action.y})`);
        } else {
          console.error("robot API is not available");
        }
      } else if (action.type === "click") {
        if (electron && electron.robot) {
          electron.robot.moveMouse(action.x, action.y);
          electron.robot.mouseClick();
          console.log(`Replayed mouse click at (${action.x}, ${action.y})`);
        } else {
          console.error("robot API is not available");
        }
      }
    }, delay);
  });
}