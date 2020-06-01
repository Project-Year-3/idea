class Course {
  constructor({name,htmlUrl,jsonUrl}){
    this.name = name;
    this.loaded = false;
    let html = this.loadHTML(htmlUrl).then(d=>{this.element=d});
    let json = this.loadJSON(jsonUrl).then(d=>{this.content=d});
    this.loaded = Promise.all([html,json]);
  };

  async loadJSON(url){
    let rawData = await fetch(url);
    let data = await rawData.json();
    return data
  };

  async loadHTML(url){
    let rawData = await fetch(url);
    let data = await rawData.text();
    let template = document.createElement("div");
    template.innerHTML = data;
    return template
  };

  async populateQuiz(id){
    var e = this.element.querySelector("#"+id);
    let q = this.content[id].questions;
    for(let i in q){
      let question = q[i];
      let subview = document.createElement("div"); subview.className = "subview";
      let ask = document.createElement("div"); ask.innerText = question.Q;
      let answer = document.createElement("input"); answer.type = "hidden"; answer.name = "ans"; answer.value = question.A;
      let optionGroup = document.createElement("select");
      optionGroup.name = "chosen";
      for(let j in question.O){
        var opt = document.createElement("option"); opt.value = question.O[j]; opt.innerText = question.O[j];
        optionGroup.appendChild(opt);
      }
      let submit = document.createElement("button");
      submit.innerText = "submit"
      subview.appendChild(ask);
      subview.appendChild(optionGroup);
      subview.appendChild(answer);
      subview.appendChild(submit);

      submit.setAttribute("onclick",`Course.checkAnswer(this,${i},${q.length},'${this.content[id].apresView}')`)
      e.appendChild(subview);
    }
    e.children[0].classList.add("current");
    e.classList.add("quiz");
    return e;
  }

  async cloneElements(root){
    let views = Array.from(this.element.querySelectorAll(".view"));
    views.forEach(e=>{
      let c = e.cloneNode(true);
      document.getElementById(c.id).innerHTML = c.innerHTML;
    });
    return true;
  }

  static checkAnswer(self,i,lastIndex,apresView){
    if(self.disabled){
      return false;
    }
    let e = self.parentElement;
    let chosen = e.querySelector("[name=chosen]");
    let ans = e.querySelector("[name=ans]");
    if(chosen.value == ans.value){
      alert("correct!");
    } else {
      alert("incorrect!");
    }
    self.disabled = true;
    i += 1;
    if(i < lastIndex){
      e.classList.remove("current");
      e.parentElement.children[i].classList.add("current");
    } else {
      mnml.switchView(apresView);
    }
    return true
  }
}