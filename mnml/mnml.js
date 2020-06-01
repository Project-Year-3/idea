class MNML {
  e = {
    _lastView: "v0",
    _wrapperSelector: "#mnml",
    get mnml(){
      return document.querySelector(this._wrapperSelector);
    },
    get main(){
      return this.mnml.querySelector("main");
    },
    get nav(){
      return this.mnml.querySelector("nav");
    },
    get navToggle() {
      return this.mnml.querySelector("#navToggle");
    },
    get views(){
      var views = {};
      this.mnml.querySelectorAll(".view").forEach(v => {
        views[v.id] = v;
      });
      return views;
    },
    get currentView(){
      return this.mnml.querySelector(".current.view");
    },
    set lastView(view) {
      this._lastView = view;
    },
    get lastView(){
      return this._lastView;
    },
    get controls(){
      var controls = {};
      this.mnml.querySelectorAll(".controls").forEach(c => {
        var elem = c;
        var children = {};
        var values = {};
        Array.from(c.querySelectorAll("input")).forEach(e=>{
          children[e.name] = e;
          values[e.name] = e.value;
        });
        controls[c.id] = {
          wrapper:elem,
          elements:children,
          values:values
        };
      });
      return controls;
    }
  }

  get navOpen(){
    return this.e.nav.classList.contains("open")
  }

  constructor(currentView=null){
    if(currentView){
      this.switchView(currentView);
    } else if(!currentView && !this.e.currentView){
      this.e.mnml.querySelector(".view").classList.add("current");
    }
    this.init();
  }

  switchView(view){
    if(view == -1){//go back
      self.switchView(this.e.lastView);
      return;
    }
    if(this.e.currentView){
      this.e.lastView = this.e.currentView.id;
      this.e.currentView.classList.remove("current");
    } else {
      this.e.lastView = view;
    }
    this.e.views[view].classList.add("current");
    var event = new CustomEvent("viewChange",{detail: view});
    this.e.mnml.dispatchEvent(event)
  }

  toggleNav(){
    this.e.nav.classList.toggle("open");
    this.e.navToggle.classList.toggle("open");
  }

  init(){
    this.e.navToggle.addEventListener("click",this.toggleNav.bind(this),false);

    this.e.nav.addEventListener("click",(e)=>{
      if(e.target.parentNode == e.currentTarget){
        this.switchView(e.target.dataset.view);
      }
    },false);

    this.e.mnml.addEventListener("click",function(e){
      if(this.navOpen && e.target != this.e.nav && e.target != this.e.navToggle){
        this.toggleNav();
      }
    }.bind(this),false);

    this.setupControls();
  }

  addControl(id,{label,name,type="number",value=50,min=0,max=100,step=1}) {
    var wrapper = document.createElement("div");
    var info = document.createElement("div");
    var labelElem = document.createElement("label");
    labelElem.innerHTML=label;
    var input = document.createElement("input");
    input.name = name; input.type = type;
    input.value = value; input.min = min; input.max = max; input.step = step;
    var output = document.createElement("output");
    output.innerHTML = value;
    info.appendChild(labelElem);
    info.appendChild(output);
    wrapper.appendChild(info);
    wrapper.appendChild(input);
    document.querySelector(`#${id}`).appendChild(wrapper);
    return wrapper;
  }
  
  setupControls(){
    for(var c in this.e.controls){
      this.e.controls[c].wrapper.addEventListener("input",e=>{
        e.target.parentNode.querySelector("output").innerText = e.target.value;
      },false);
      this.e.controls[c].wrapper.addEventListener("change",e=>{
        e.currentTarget.dispatchEvent(new CustomEvent("mnmlChange",{
          detail:{
            name:e.target.name,
            value:e.target.value
          }
        }))
      },false);
    }
  }
}

//mnml = new MNML("v2");