class Sequential {
  constructor (obj) {
    
    this.activations = [];
    this.activations["identity"] = function (x) {return x;};
    this.activations["sigmoid"] = function (x) {return (1/(1+Math.exp(-x)));};
    this.activations["relu"] = function (x) {return Math.max(x,0);};
    this.activations["softplus"] = function (x) {return Math.log(Math.exp(x) + 1);};
    this.activations["softsign"] = function (x) {return (x / (Math.abs(x) + 1));};
    // TODO: implement missing activation functions
    // see: https://keras.io/api/layers/activations/
    
    this.model = null;
    if (obj.class_name=="Sequential") {
      this.model = obj;
      console.log(obj.class_name);
    }
    else {
      console.log("no Sequential model");
      return;
    }
  }
  
  calcLayer (layer,input,activationFunction) {
    let output = new Array(layer.bias.length).fill(0);
    for (let o=0; o<output.length; o++) {
      for (let i=0; i<input.length; i++) {
        output[o] += input[i]*layer.weights[i][o];
      }
      output[o] = activationFunction(output[o]+layer.bias[o]);  
    }
    return output;
  }
  
  calc (in_values) {
    if (this.model == null) return;
    
    let out = [];
    for (let l in this.model.config.layers) {
      let layer = this.model.config.layers[l];
      if (layer.class_name=="Dense") {
        let activationFunction = this.activations[layer.config.activation];
        out = this.calcLayer(layer,in_values, activationFunction);
        in_values = out;
      }
    }
    // reshape
    let reshaped = [];
      while(out.length) reshaped.push(out.splice(0,this.model.width));
    return reshaped;
  }
  
  calcFrom (in_values, layer_name) {
    if (this.model == null) return;
    
    let found = false;
    let out = [];
    for (let l in this.model.config.layers) {
      let layer = this.model.config.layers[l];
      if (layer.class_name=="Dense" && (found || layer.config.name==layer_name)) {
        found = true;
        let activationFunction = this.activations[layer.config.activation];
        out = this.calcLayer(layer,in_values, activationFunction);
        in_values = out;
      }
    }
    // reshape
    let reshaped = [];
      while(out.length) reshaped.push(out.splice(0,this.model.width));
    return reshaped;
  }
}