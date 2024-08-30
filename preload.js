const { contextBridge } = require('electron');
const robot = require('robotjs');

// Expose API to the renderer process
contextBridge.exposeInMainWorld("electron", {
  robot: {
    moveMouse: (x, y) => robot.moveMouse(x, y),
    mouseClick: () => robot.mouseClick(),
  },
});