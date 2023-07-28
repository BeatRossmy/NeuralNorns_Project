class Sequencer {
  constructor () {
    this.step = 0;
    this.timer = 0;
    this.playing = true;
    this.worker = null;
  }
  
  work (func) {
    console.log("start worker")
    let sequencer = this;
    if (this.worker == null) {
      console.log("worker");
      
      let blob = new Blob([
        `let step = 0;
        function timedCount() {
          step = step + 1;
          postMessage(step);
          setTimeout(\"timedCount()\",150);
        }
        timedCount();`
      ], { type: "text/javascript" });
      
      this.worker = new Worker(window.URL.createObjectURL(blob));
      
      this.worker.onmessage = function (event) {
        sequencer.step = event.data;
        func(sequencer.step);
      };
    }
  }
}