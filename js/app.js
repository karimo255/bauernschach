"use strict";
// alert("hallo");

window.addEventListener(
  "load",
  () => {
    var grid = document.getElementById("grid");
    var gridElements = [
      {status :true}, {status: true}, {status: true},
      {status :false}, {status: false}, {status: false},
      {status :true}, {status: true}, {status: true},
     ];
    gridElements.forEach((g, index) => {
      var icon = document.createElement("i");
      icon.className = "fas black fa-chess-pawn";
      icon.style.fontSize = '28px';
      var div = document.createElement("div");
      div.className = "field";
      if(g.status) {
        div.appendChild(icon);
      }
      grid.appendChild(div);
    });
  },
  false
);
