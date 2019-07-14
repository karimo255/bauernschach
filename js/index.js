"use strict";

window.addEventListener(
    "load",
    () => {
        let iconId, xSource, ySource, ownerSource;
        let interval;
        let grid = document.getElementById("grid");

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

        function drop(ev) {
            ev.preventDefault();
            let icon = document.getElementById(iconId);
            let target = ev.target;

            if (target.className.includes("fas")) {
                target = target.parentNode;
            }

            icon.parentElement.dataset.owner = "none";
            target.dataset.owner = "spieler";

            target.innerHTML = ""; // clear
            icon && target.appendChild(icon);

            resetFieldsBackgroundColor();

            let move = {xSource, ySource, xTarget: parseInt(target.dataset.x), yTarget: parseInt(target.dataset.y), owner: "spieler"};
            document.getElementsByClassName("fas fa-robot")[0].classList.add("animateMe");
            makeUserMove(move, () => {
                createGrid(fields);
                document.getElementsByClassName("fas fa-robot")[0].classList.remove("animateMe");
            });
        }

        function train() {
            interval = setInterval(() => {
                document.getElementsByClassName("fas fa-robot")[0].classList.add("animateMe");
                makeUserRandomMove(() => {
                    createGrid(fields, true);
                    document.getElementsByClassName("fas fa-robot")[0].classList.remove("animateMe");
                });
            }, 10);
        }

        function resetFieldsBackgroundColor() {
            let fields = document.getElementsByClassName("field");
            let i = 0;

            for (let field of fields) {
                if (i % 2 === 0) {
                    field.style.backgroundColor = "#a4a4a4";
                } else {
                    field.style.backgroundColor = "#ffffff";
                }
                i++;
            }
        }

        // render
        function createIcon(gridElement, train) {
            let icon = document.createElement("i");
            icon.className = "fas black fa-chess-pawn";
            icon.style.fontSize = "38px";
            if (!train) {
                icon.draggable = gridElement.owner === "spieler";
                icon.addEventListener("dragstart", drag);
                icon.addEventListener("touchstart", drag);
                icon.addEventListener("dragleave", resetFieldsBackgroundColor);
                icon.addEventListener("touchend", resetFieldsBackgroundColor);
            }
            icon.id = "drag-icon" + gridElement.x + "-" + gridElement.y;
            return icon;
        }

        function createField(gridElement, train) {
            let div = document.createElement("div");
            if (!train) {
                div.addEventListener("dragover", allowDrop);
                div.addEventListener("touchmove", allowDrop);
                div.addEventListener("drop", drop);
                div.addEventListener("touchend", drop);
            }
            div.className = "field";
            div.id = "drag" + gridElement.x + "-" + gridElement.y;
            div.dataset.x = gridElement.x;
            div.dataset.y = gridElement.y;
            div.dataset.owner = gridElement.owner;
            return div;
        }

        function createGrid(gridElements, train) {
            grid.innerHTML = "";
            gridElements.forEach((gridElement) => {
                let icon = createIcon(gridElement, train);
                if (gridElement.owner === "spieler") {
                    icon.style.color = '#00b489';
                }

                let field = createField(gridElement, train);
                if (gridElement.owner !== "none") {
                    field.appendChild(icon);
                }

                grid.appendChild(field);
            });
            resetFieldsBackgroundColor();
        }

        start();
        createGrid(fields, false);

        let resetButton = document.getElementById("reset");
        resetButton.addEventListener("click", () => {
            start();
            createGrid(fields, false);
            clearInterval(interval);
        });

        let trainButton = document.getElementById("train");
        trainButton.addEventListener("click", () => {
            clearInterval(interval);
            train();
        });

        //  end render

 // train();
    });