let seq = new Sequencer();
let grid;
let autoencoder = null;

function custom_setup() {
  gui = document.createElement("div");
  gui.classList.add("gui");
  document.body.appendChild(gui);
  
  addDropListener(gui,function (d) {
    autoencoder = new Sequential(d);
    addSliders(calculateAutoencoder);
    calculateAutoencoder();
  });
  addClickListener(gui,function (e) {
    console.log("click");
    for (n in sliders) {
      sliders[n].set(Math.random(),false);
    }
    calculateAutoencoder();
  });
  
  top_container = document.createElement("div");
  top_container.classList.add("top");
  gui.appendChild(top_container);
  
  /*mid_container = document.createElement("div");
  mid_container.classList.add("middle");*/
  
  // TOP
  sliders = [];
  
  // BOTTOM
  controls = document.createElement("div");
  controls.classList.add("bottom");
  gui.appendChild(controls);
  
  threshold = new VSlider("threshold",0.4);
  controls.appendChild(threshold.container);
  threshold.onChange = calculateAutoencoder;
  
  mute = new Button("mute",function () {
    drums.mute = !drums.mute;
    mute.setName(drums.mute?"unmute":"mute");
  });
  controls.appendChild(mute.container);
  
  clear = new Button("clear",function () { console.log("clear"); grid.reset(); });
  controls.appendChild(clear.container);
  
  grid = new Grid(8,4);
  gui.appendChild(grid.container);
  grid.key = function (x,y,z) {
    console.log(x,y)
  }
  
  seq.work(soundLoop);
}

function calculateAutoencoder () {
  if (autoencoder==null) return;
  let values = [];
  for (n in sliders) values.push(sliders[n].get());
  let beat = autoencoder.calcFrom(values,"decoder");
  let thr = threshold.get();

  for (var x=0; x<grid.width; x++) {
    for (var y=0; y<grid.height; y++) {
      grid.set(x,y,beat[y][x],thr);
    }
  }
}

function soundLoop (st) {
  let col = st%8;
  let thr = threshold.get();
  for (var row=0; row<grid.height; row++) {
    if (grid.cells[row][col].state>=thr) drums.trigger(row);
  }
  grid.highlight(col);
}

function addSliders (func) {
  if (autoencoder==null) return;
  for (n in sliders) sliders[n].container.remove();
  sliders.length = 0;
  
  let latent_layer = autoencoder.model.config.layers.find(function (l) {return (l.config.name=="latent")});
  
  for (var i=0; i<latent_layer.config.units; i++) {
    let slider = new VSlider(undefined,0.5);
    top_container.appendChild(slider.container);
    if (func!=undefined) slider.onChange = func;
    sliders.push(slider);
  }
}

function addDropListener (html_element,func) {
  html_element.addEventListener('dragenter',
    function(e){ e.preventDefault(); }
  );
  html_element.addEventListener('dragover',
    function(e){ e.preventDefault(); }
  );

  html_element.addEventListener('drop',
    function(event) {
      var reader = new FileReader();
      reader.onloadend = function() {
        let data = JSON.parse(this.result);
        func(data);
      };
      reader.readAsText(event.dataTransfer.files[0]);    
      event.preventDefault();
    }
  );
}

function addClickListener (html_element,func) {
  html_element.addEventListener('click',
    function(e){ 
      if (e.target==html_element) func(e); e.preventDefault();
    }
  );
}

custom_setup();