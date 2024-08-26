(() => {
  // src/index.js
  document.getElementById("home").onmouseenter = function() {
    document.getElementById("homeText").classList.add("homeTextShow");
  };
  document.getElementById("home").onmouseleave = function() {
    document.getElementById("homeText").classList.remove("homeTextShow");
  };
  for (let j = 0; j < journalData.length; j++) {
    let node = document.getElementById("journalTest").cloneNode(true);
    node.id = "";
    node.childNodes[1].id = "journalText" + j;
    breakPoint = document.createElement("br");
    node.childNodes[1].innerHTML = journalData[j].name;
    node.onclick = function() {
      changeJournal(this);
    };
    node.onmouseleave = function() {
      document.querySelector("#journalText" + j).classList.remove("journalShow");
    };
    node.onmouseenter = function() {
      document.querySelector("#journalText" + j).classList.add("journalShow");
      console.log(document.querySelector("#journalText" + j).innerHTML);
    };
    document.getElementById("journalButtons").appendChild(node);
    document.getElementById("journalButtons").appendChild(breakPoint);
  }
  var breakPoint;
})();
