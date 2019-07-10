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
            let t = ev.target;
            if(ev.target.parentNode.className === "field"){
                console.log("ja", ev.target.parentNode.className);
                t= ev.target.parentNode;
            }
            let xTarget = parseInt(t.dataset.x);
            let yTarget = parseInt(t.dataset.y);
            let ownerTarget = t.dataset.owner;

            if(ownerSource === "cpu") { // deleteMe: just test
                ev.preventDefault();
            }

            if (ownerTarget === "none" && ySource + 1 === yTarget && xSource === xTarget) {
                console.log("set color", t.id);
                document.getElementById(t.id).style.backgroundColor = "red";
                t.style.backgroundColor = "#dbf7c8";
                ev.preventDefault();
                return false;
            }

            console.log("Owner: ", ownerTarget);
            if (ownerTarget === "cpu" && ySource + 1 === yTarget && (xSource + 1 === xTarget || xSource - 1 === xTarget)) {
                t.style.backgroundColor = "#dbf7c8";
                ev.preventDefault();
                return false;
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
            target.dataset.owner = ownerSource;

            if (target.className.includes("fas")) {
                target = target.parentNode;
            }

            if (target.className === "field") {
                target.innerHTML = ""; // clear
                icon && target.appendChild(icon);
            }

            /* if (checkForWin() == "none") {
                zugComputer();
            } else {

            } */

            // console.log("hatDaWerGewonnen?", checkForWin());

            setTimeout(zugComputer, 1000);
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
            let posCom = [];
            let posPlayer = [];
            let fields = document.getElementsByClassName("field");
            for(let field of fields) {
                let zwErg = {x: parseInt(field.dataset.x), y: parseInt(field.dataset.y)};
                if (field.dataset.owner == "cpu") {
                    posCom.push(zwErg);
                }
                if (field.dataset.owner == "spieler") {
                    posPlayer.push(zwErg);
                }
            }
            for(let computer of posCom) {
                for(let field of fields) {
                    let zwErg = {xSource: computer.x, ySource: computer.y, xTarget: field.dataset.x, yTarget: field.dataset.y};
                    console.log("computer.x",computer.x);
                    console.log(" parseInt(field.dataset.x)", parseInt(field.dataset.x));
                    console.log("computer.x === parseInt(field.dataset.x)", computer.x === parseInt(field.dataset.x));
                    if (field.dataset.owner === "none" && computer.y - 1 === parseInt(field.dataset.y) && computer.x === parseInt(field.dataset.x)) {
                        möglicheZüge.push(zwErg);
                    }
        
                    if (field.dataset.owner === "spieler" && computer.y - 1 === parseInt(field.dataset.y) && (computer.x + 1 === parseInt(field.dataset.x) || computer.x - 1 === parseInt(field.dataset.x))) {
                        möglicheZüge.push(zwErg);
                    }
                }
            }
            let zug = randomNum(möglicheZüge.length);
            console.log("Möglich: ", möglicheZüge);
            let startField = document.querySelector("[data-x=" + CSS.escape(möglicheZüge[zug].xSource) + "][data-y=" + CSS.escape(möglicheZüge[zug].ySource) + "]");
            let endField = document.querySelector("[data-x=" + CSS.escape(möglicheZüge[zug].xTarget) + "][data-y=" + CSS.escape(möglicheZüge[zug].yTarget) + "]");
            
            iconId = startField.firstChild.id;
            let icon = document.getElementById(iconId);
            startField.innerHTML = ""; // clear
            startField.dataset.owner = "none";
            endField.innerHTML = "";
            endField.dataset.owner = "cpu";
            icon && endField.appendChild(icon);
            
        }

        function randomNum(length) { 
            return (Math.floor(Math.random() * length));
        }

        function checkForWin() {
            let fields = document.getElementsByClassName("field");
            let spieler = 0;
            let cpu = 0;

            for(let field in fields) {
                if (field.dataset.owner === "spieler" && parseInt(field.dataset.y) === 2) {
                    return "spieler";
                } else if (field.dataset.owner === "spieler") {
                    spieler++;
                }
                if (field.dataset.owner === "cpu" && parseInt(field.dataset.y) === 0) {
                    return "cpu";
                } else if (field.dataset.owner === "cpu") {
                    cpu++;
                }
            }

            if (!cpu) {
                return "spieler"
            } else if (!spieler) {
                return "cpu";
            } else {
                return "none";
            }
        }

    },
    false
);
