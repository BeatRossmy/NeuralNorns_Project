let seq = new Sequencer();
let grid;

let beat_index = 0;

let data_set = {
  w: 8,
  h: 4,
  data: []
};

function scrubThroughBeats (d) {
  if (data_set.data.length==0) return;
  d = (d<0)?(data_set.data.length+d):d;
  beat_index = (beat_index+d)%data_set.data.length;
  grid.setData(data_set.data[beat_index].data);
}

function addBeat () {
  console.log(grid.getId());
  let id = grid.getId();
  let data = grid.getData();
  if (data_set.data.filter(e => e.id === id).length == 0) {
    data_set.data.push({id: id, data: data});
    beat_index = data_set.data.length-1;
  }
  counter.innerHTML = "collected beats: "+data_set.data.length;
}

function resize (w, h, overwrite) {
  grid.resize(w,h);
  if (overwrite==true || overwrite==undefined) initDataSet();
}

function initDataSet () {
  data_set.w = grid.width;
  data_set.h = grid.height;
  data_set.data = [];
  counter.innerHTML = "collected beats: "+data_set.data.length;
}

function loadData (d) {
  if (d.w==undefined || d.h==undefined || d.data==undefined) return;
  data_set = d;
  resize(data_set.w,data_set.h,false);
  counter.innerHTML = "collected beats: "+data_set.data.length;
}

function setup() {
  gui = document.createElement("div");
  gui.className = "gui";
  document.body.appendChild(gui);
  addDropListener(gui,loadData);
  
  // TOP
  top_container = document.createElement("div");
  top_container.classList.add("top");
  gui.appendChild(top_container);
  
  // BOTTOM
  controls = document.createElement("div");
  controls.className = "bottom";
  gui.appendChild(controls);
  
  scrub = new Container(
    "next pattern",
    new Button("<", function () {scrubThroughBeats(-1);}),
    new Button(">", function () {scrubThroughBeats(+1);})
  );
  controls.appendChild(scrub.container);
  
  counter = document.createElement("p");
  counter.className = "info";
  counter.innerHTML = "0";
  controls.appendChild(counter);
  
  mute = new Button("mute", function () {
    drums.mute = !drums.mute;
    mute.setName(drums.mute?"unmute":"mute");
  });
  controls.appendChild(mute.container);
  
  clear_grid = new Button("clear grid", function () { grid.reset(); });
  controls.appendChild(clear_grid.container);
  
  clear_data = new Button("clear data", initDataSet);
  controls.appendChild(clear_data.container);
  
  save = new Button("download", function () { download(data_set, 'data_set.json', 'text/plain'); });
  
  controls.appendChild(save.container);
  
  width_ctrl = new Container(
    "width",
    new Button("-", function () {resize(grid.width-1,grid.height+0);}),
    new Button("+", function () {resize(grid.width+1,grid.height+0);})
  );
  controls.appendChild(width_ctrl.container);
  
  height_ctrl = new Container(
    "height",
    new Button("-", function () {resize(grid.width+0,grid.height-1);}),
    new Button("+", function () {resize(grid.width+0,grid.height+1);})
  );
  controls.appendChild(height_ctrl.container);
  
  grid = new Grid(8,4);
  gui.appendChild(grid.container);
  grid.key = addBeat;
  
  seq.work(soundLoop);
}

function soundLoop (st) {
  let col = st%grid.width;
  let thr = 0.4;
  for (var row=0; row<grid.height; row++) {
    if (grid.cells[row][col].state>=thr) drums.trigger(row);
  }
  grid.highlight(col);
}

function download(obj, fileName, contentType) {
  let content = JSON.stringify(obj);
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

setup();