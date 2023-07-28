class Grid {
  constructor (w,h) {
    this.width = Math.min(Math.max(parseInt(w), 1), 16);
    this.height = Math.min(Math.max(parseInt(h), 1), 16);
    this.container = document.createElement("div");
    this.container.classList.add("grid");
    let column_template = "";
    for (let col=0; col<this.width; col++) column_template += "auto "
    this.container.style.gridTemplateColumns = column_template;
    
    this.cells = [];
    for (let row=0; row<this.height; row++) this.cells.push([]);
    
    let grid = this;
    
    
    for (let y=this.height-1; y>=0; y--) {
      for (let x=0; x<this.width; x++) {
        
        let cell = {
          x: x,
          y: y,
          state: 0,
          html: document.createElement("div")
        };
        
        cell.html.classList.add("grid_cell");
        
        cell.html.onclick = function() {
          cell.state = (cell.state==0)?1:0;
          grid.set(cell.x,cell.y,cell.state);
        };
        
        this.cells[y][x] = cell;
        this.container.appendChild(cell.html);
      }
    }
  }
  
  reset () {
    for (let y=0; y<this.height; y++) {
      for (let x=0; x<this.width; x++) {
        this.set(x,y,0);
      }
    }
  }
  
  set (x,y,s,thr) {
    thr = (thr==undefined)? 0.4:thr;
    let cell = this.cells[y][x];
    cell.state = s;
    cell.html.style.setProperty("--brightness",String(s*100)+"%");
  }
  
  key (x,y,z) {
    console.log(x,y,z);
  }
  
  highlight (col) {
    for (let y=0; y<this.height; y++) {
      for (let x=0; x<this.width; x++) {
        this.cells[y][x].html.classList.remove("highlight");
        if (x==col) this.cells[y][x].html.classList.add("highlight");
      }
    }
  }
}

class VSlider {
  constructor (name,value) {
    this.container = document.createElement("div");
    this.container.className = "vslider";
    
    // RANGE
    this.range = document.createElement("input");
    this.range.type = "range";
    this.range.min = 0;
    this.range.max = 1;
    this.range.step = 0.01;
    this.range.setAttribute("orient","vertical");
    this.container.appendChild(this.range);
    
    // VALUE
    this.value_field = document.createElement("p");
    this.value_field.innerHTML = "0.00";
    this.container.appendChild(this.value_field);
    
    // NAME
    this.name_field = document.createElement("p");
    if (name != undefined) this.name_field.innerHTML = name;
    this.name_field.className = "name";
    this.container.appendChild(this.name_field);
    
    let obj = this;
    
    this.range.addEventListener(
      'input', // 'change'
      function (e) {
        let val = e.srcElement.value;
        obj.set(val,true);
      },
      false
    );
    
    this.set(value);
  }
  
  set (val,triggerOnChange) {
    if (isNaN(val)) return;
    this.range.value = val;
    this.value_field.innerHTML = ""+Number.parseFloat(val).toFixed(2);
    if (triggerOnChange==true) this.onChange(val);
  }
  
  get () {
    return this.range.value;
  }
  
  onChange (v) {}
}

class Button {
  constructor (name,func) {
    this.container = document.createElement("input");
    this.container.type = "button";
    this.container.value = name;
    if (func!=undefined) this.container.onclick = func;
  }
  setName (n) {
    this.container.value = n;
  }
}

function rgb(r,g,b) {
    return 'rgb(' + [(r||0),(g||0),(b||0)].join(',') + ')';
}