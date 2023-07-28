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