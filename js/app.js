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
            let cpuInfoBox = document.getElementById("cpuInfoBox");
            cpuInfoBox.innerHTML = "";
            let spielerInfoBox = document.getElementById("spielerInfoBox");
            spielerInfoBox.innerHTML = "";
            createGrid(gridElements);
        });

        function drag(ev) {
            iconId = ev.target.id;
            xSource = parseInt(ev.target.parentNode.dataset.x);
            ySource = parseInt(ev.target.parentNode.dataset.y);
            ownerSource = ev.target.parentNode.dataset.owner;
        }

        function allowDrop(ev) {
            resetFieldsBackgroundColor();

            let t = ev.target;
            if (ev.target.parentNode.className === "field") {
                t = ev.target.parentNode;
            }
            let xTarget = parseInt(t.dataset.x);
            let yTarget = parseInt(t.dataset.y);
            let ownerTarget = t.dataset.owner;


            if (canIMove("spieler", ownerTarget, xSource, ySource, xTarget, yTarget)) {
                t.style.backgroundColor = "#dbf7c8";
                ev.preventDefault();
                return false;
            }

            if (canIBeat("spieler", ownerTarget, xSource, ySource, xTarget, yTarget)) {
                t.style.backgroundColor = "#a7ecf2";
                ev.preventDefault();
                return false;
            }
        }

        function resetFieldsBackgroundColor() {
            let fields = document.getElementsByClassName("field");

            for (let field of fields) {
                field.style.backgroundColor = "#ffffff";
            }
        }

        function drop(ev) {
            ev.preventDefault();
            let icon = document.getElementById(iconId);

            icon.parentElement.dataset.owner = "none";
            let target = ev.target;
            target.dataset.owner = ownerSource;

            if (target.className.includes("fas")) {
                target = target.parentNode;
            }

            target.innerHTML = ""; // clear
            icon && target.appendChild(icon);

            resetFieldsBackgroundColor();

            let winner = checkForWin("spieler");
            showWinner(winner);
            if (winner === "none") {
                setTimeout(() => {
                    makeCPUMove();
                    let winner = checkForWin("cpu");
                    showWinner(winner)
                }, 1000);

            }
        }

        function showWinner(winner) {
            if (winner === "none") return false;

            let winnerP = document.createElement("p");
            let text = "Du hast verloren.";
            if (winner === "spieler") {
                text = "Du hast Gewonnen.";
            }
            winnerP.textContent = text;

            let winnerContainer = document.createElement("div");
            winnerContainer.className = "winnerContainer";

            winnerContainer.appendChild(winnerP);
            grid.appendChild(winnerContainer);
        }

        function createIcon(gridElement) {
            let icon = document.createElement("i");
            icon.className = "fas black fa-chess-pawn";
            icon.style.fontSize = "34px";
            icon.draggable = gridElement.owner === "spieler";
            icon.addEventListener("dragstart", drag);
            icon.addEventListener("dragleave", resetFieldsBackgroundColor);
            icon.id = "drag-icon" + gridElement.x + "-" + gridElement.y;
            return icon;
        }

        function createField(gridElement) {
            let div = document.createElement("div");
            div.addEventListener("dragover", allowDrop);
            div.addEventListener("drop", drop);
            div.className = "field";
            div.id = "drag" + gridElement.x + "-" + gridElement.y;
            div.dataset.x = gridElement.x;
            div.dataset.y = gridElement.y;
            div.dataset.owner = gridElement.owner;
            return div;
        }

        function createGrid(gridElements) {
            grid.innerHTML = "";
            gridElements.forEach((gridElement) => {
                let icon = createIcon(gridElement);
                if (gridElement.owner === "spieler") {
                    icon.style.color = '#00b489';
                }

                let field = createField(gridElement);
                if (gridElement.owner !== "none") {
                    field.appendChild(icon);
                }

                grid.appendChild(field);
            });
        }

        function getPossibleMoves(whoAmi) {
            let fields = document.getElementsByClassName("field");
            let possibleMoves = [];
            let positions = [];

            for (let field of fields) {
                let y = parseInt(field.dataset.y);
                let x = parseInt(field.dataset.x);

                let zwErg = {x, y};

                if (field.dataset.owner === whoAmi) {
                    positions.push(zwErg);
                }
            }

            for (let pos of positions) {
                for (let field of fields) {
                    let yTarget = parseInt(field.dataset.y);
                    let xTarget = parseInt(field.dataset.x);
                    let ownerTarget = field.dataset.owner;

                    let xSource = pos.x;
                    let ySource = pos.y;

                    let move = {xSource, ySource, xTarget, yTarget};

                    if (canIMove(whoAmi, ownerTarget, xSource, ySource, xTarget, yTarget)) {
                        possibleMoves.push(move);
                    }

                    if (canIBeat(whoAmi, ownerTarget, xSource, ySource, xTarget, yTarget)) {
                        possibleMoves.push(move);
                    }
                }
            }
            return possibleMoves;
        }

        function makeCPUMove() {
            const possibleMoves = getPossibleMoves("cpu");

            let moveIndex = randomNum(possibleMoves.length);
            let move = possibleMoves[moveIndex];
            let startField = document.querySelector("[data-x=" + CSS.escape(move.xSource) + "][data-y=" + CSS.escape(move.ySource) + "]");
            let endField = document.querySelector("[data-x=" + CSS.escape(move.xTarget) + "][data-y=" + CSS.escape(move.yTarget) + "]");

            iconId = startField.firstChild.id;
            let icon = document.getElementById(iconId);
            startField.innerHTML = ""; // clear
            startField.dataset.owner = "none";
            endField.innerHTML = "";
            endField.dataset.owner = "cpu";
            icon && endField.appendChild(icon);
        }

        function canIMove(whoAmi, ownerTarget, xSource, ySource, xTarget, yTarget) {
            if (ownerTarget !== "none") {
                return false;
            }
            if (whoAmi === "cpu") {
                return ySource - 1 === yTarget && xSource === xTarget;
            }
            if (whoAmi === "spieler") {
                return ySource + 1 === yTarget && xSource === xTarget;
            }
        }

        function canIBeat(whoAmi, ownerTarget, xSource, ySource, xTarget, yTarget) {
            if (ownerTarget === "none") {
                return false;
            }
            if (whoAmi === "cpu") {
                return ownerTarget === "spieler" && ySource - 1 === yTarget && (xSource + 1 === xTarget || ySource - 1 === xTarget);
            }
            if (whoAmi === "spieler") {
                return ownerTarget === "cpu" && ySource + 1 === yTarget && (xSource + 1 === xTarget || xSource - 1 === xTarget);
            }
        }

        function randomNum(length) {
            return (Math.floor(Math.random() * length));
        }

        function checkForWin(lastMove) {

            let fields = document.getElementsByClassName("field");
            let spieler = 0;
            let cpu = 0;

            for (let field of fields) {
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

            showInfo(cpu, spieler);

            let cpuPossibleMoves = getPossibleMoves("cpu");
            let spielerPossibleMoves = getPossibleMoves("spieler");

            if (cpuPossibleMoves.length === 0 && lastMove === "spieler") {
                return "spieler";
            }
            if (spielerPossibleMoves.length === 0 && lastMove === "cpu") {
                return "cpu";
            }

            if (!cpu) {
                return "spieler"
            }
            if (!spieler) {
                return "cpu";
            }
            return "none";
        }

        function showInfo(cpu, spieler) {
            let cpuInfoBox = document.getElementById("cpuInfoBox");
            cpuInfoBox.innerHTML = "";

            for (let i = 0; i < 3 - spieler; i++) {
                let icon = document.createElement("i");
                icon.className = "fas black fa-chess-pawn";
                icon.style.fontSize = "30px";
                icon.style.color = '#00b489';
                cpuInfoBox.appendChild(icon);
            }

            let spielerInfoBox = document.getElementById("spielerInfoBox");
            spielerInfoBox.innerHTML = "";

            for (let i = 0; i < 3 - cpu; i++) {
                let icon = document.createElement("i");
                icon.className = "fas black fa-chess-pawn";
                icon.style.fontSize = "30px";
                spielerInfoBox.appendChild(icon);
            }
        }

    },
    false
);
