"use strict";

window.addEventListener(
    "load",
    () => {
        let iconId, xSource, ySource, ownerSource;
        let grid = document.getElementById("grid");

        let gridElements = [
            {owner: "cpu", x: 0, y: 2},
            {owner: "cpu", x: 1, y: 2},
            {owner: "cpu", x: 2, y: 2},
            {owner: "none", x: 0, y: 1},
            {owner: "none", x: 1, y: 1},
            {owner: "none", x: 2, y: 1},
            {owner: "spieler", x: 0, y: 0},
            {owner: "spieler", x: 1, y: 0},
            {owner: "spieler", x: 2, y: 0},
        ];
        createGrid(gridElements);

        let control = document.getElementById("control");
        control.addEventListener("click", () => {
            createGrid(gridElements);
        });

        function ziehen(ev) {
            iconId = ev.target.id;
            xSource = parseInt(ev.target.parentNode.dataset.x);
            ySource = parseInt(ev.target.parentNode.dataset.y);
            ownerSource = ev.target.parentNode.dataset.owner;

        }

        function ablegenErlauben(ev) {
            let xTarget = parseInt(ev.target.dataset.x);
            let yTarget = parseInt(ev.target.dataset.y);
            let ownerTarget = ev.target.dataset.owner;
            console.log('ySource', ySource);
            console.log('yTarget', yTarget);

            if(ownerSource === "cpu") { // deleteMe: just test
                ev.preventDefault();
            }

            if (ownerTarget === "none" && ySource + 1 === yTarget && xSource === xTarget) {
                console.log("alkert");
                ev.target.style.backgroundColor = "#dbf7c8";
                ev.preventDefault();
                // return false;
            }

            if (ownerTarget === "cpu" && ySource + 1 === yTarget && (xSource + 1 === xTarget || xSource - 1 === xTarget)) {
                ev.target.style.backgroundColor = "#dbf7c8";
                ev.preventDefault();
                // return false;
            }

            let fields = document.getElementsByClassName("field");
            changeColor(fields, "#ffffff");
        }

        function changeColor(coll, color){

            for(var i=0, len=coll.length; i<len; i++)
            {
                coll[i].style["background-color"] = color;
            }
        }

        function ablegen(ev) {
            ev.preventDefault();
            let icon = document.getElementById(iconId);
            let fields = document.getElementsByClassName("field");
            changeColor(fields, "#ffffff");
            icon.parentElement.dataset.owner = "none";
            let target = ev.target;
            console.log(ev.target.className);
            target.dataset.owner = ownerSource;

            if (target.className.includes("fas")) {
                target = target.parentNode;
            }

            if (target.className === "field") {
                target.innerHTML = ""; // clear
                icon && target.appendChild(icon);
            }

            zugComputer();
        }

        function createIcon(x, y) {
            let icon = document.createElement("i");
            icon.className = "fas black fa-chess-pawn";
            icon.style.fontSize = "34px";
            icon.draggable = true;
            icon.addEventListener("dragstart", ziehen);
            icon.id = "drag-icon" + x + "-" + y;
            return icon;
        }

        function resetColor(ev) {
            ev.target.style.backgroundColor = "#ffffff";
        }

        function createGrid(gridElements) {
            grid.innerHTML = "";
            gridElements.forEach((g, index) => {
                let icon = createIcon(g.x, g.y);
                let div = document.createElement("div");
                div.addEventListener("dragover", ablegenErlauben);
                div.addEventListener("drop", ablegen);
                div.addEventListener("mouseout", resetColor);
                div.className = "field";
                div.id = "drag" + index;
                div.dataset.x = g.x;
                div.dataset.y = g.y;
                div.dataset.owner = g.owner;
                if (g.owner === "spieler") {
                    icon.style.color = '#00b489';
                }
                if (g.owner !== "none") {
                    div.appendChild(icon);
                }
                grid.appendChild(div);
            });
        }

        function zugComputer() {
            let möglicheZüge = [];
            for(field in gridElements) {
                if (field.owner == "cpu") {
                    let zwErg = "" + field.x + field.y;

                    if () {
                        
                    }
                }
            }
        }

    },
    false
);
