"use strict";

window.addEventListener(
  "load",
  () => {
    function ziehen(ev) {
      console.log("ziehen", event);
    	ev.dataTransfer.setData('text', ev.target.id);
    }

    function ablegenErlauben(ev) {
  	ev.preventDefault();
    }

    function ablegen(ev) {
      console.log("ablegen");
    	ev.preventDefault();
    	var data = ev.dataTransfer.getData('text');
      var target = ev.target;
      console.log(ev.target.className);
      if (target.className.includes("fas")) {
        target = target.parentNode;
      }
      console.log(ev);
      if (target.className === "field") {
        target.innerHTML = ""; // clear
      	document.getElementById(data) && target.appendChild(document.getElementById(data));
      }
    }

    function createGrid(gridElements){
      grid.innerHTML = "";
      gridElements.forEach((g, index) => {
        var icon = document.createElement("i");
        icon.className = "fas black fa-chess-pawn";
        icon.style.fontSize = "28px";
        icon.draggable = "true";
        icon.addEventListener("dragstart",ziehen);
        icon.id = "drag-icon"+index;
        var div = document.createElement("div");
        div.addEventListener("dragover",ablegenErlauben);
        div.addEventListener("drop",ablegen);
        div.className = "field";
        div.id = "drag"+index
        if (g.owner === "spieler") {
          icon.style.color = 'green';
        }
        if (g.status) {
          div.appendChild(icon);
        }
        grid.appendChild(div);
      });
    }

    var grid = document.getElementById("grid");
    var gridElements = [
      { status: true, owner: "cpu" },
      { status: true, owner: "cpu" },
      { status: true, owner: "cpu" },
      { status: false },
      { status: false },
      { status: false },
      { status: true, owner: "spieler" },
      { status: true, owner: "spieler" },
      { status: true, owner: "spieler" },
    ];
    createGrid(gridElements);

    var controll = document.getElementById("controll");
    controll.addEventListener("click", () =>{
      createGrid(gridElements);
    });
  },
  false
);
