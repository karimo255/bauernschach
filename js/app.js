"use strict";


let movesScenarios = [];

let scenario = {
    moves: [],
};

function registerMove(move) {
    scenario.moves.push(move);
}

function completeScenario(winner) {
    if (winner === "cpu") {
        resetScenario();
        console.log("Nichts gelernt");
        return;
    }

    let isScenarioAlreadyExists = false;
    for (let movesScenario of movesScenarios) {
        if (JSON.stringify(movesScenario) === JSON.stringify(scenario)) {
            isScenarioAlreadyExists = true;
        }
    }
    !isScenarioAlreadyExists && movesScenarios.push(scenario);
    console.log("Gelernt");

    resetScenario();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
}

function getSuccess(possibleMoves) {
    console.log("possibleMoves before", possibleMoves.length);
    if (movesScenarios.length < 3) {
        return false;
    }
    console.log("wie viele scenarios", movesScenarios.length);
    let failureMoveIndex = scenario.moves.length;
    let failureScenarios = movesScenarios;
    let p = Object.assign([], possibleMoves);
    for (let failureScenario of failureScenarios) {
        if (JSON.stringify(scenario.moves) === JSON.stringify(failureScenario.moves.slice(0, failureMoveIndex))) {
            if (failureScenario.moves.length - 2 === failureMoveIndex) { // Der letzte Zug (schlechter Zug), der zur Niederlage geführt hat.
                console.clear();
                console.log("possibleMoves before", possibleMoves.length);
                let failureMove = failureScenario.moves[failureMoveIndex];
                console.log("failureMove", failureMove);
                p = p.filter(m => compareObj(m, failureMove) === false); // Den schlechter Zug raus nehmen.
            }
        }
    }
    console.log("possibleMoves after", p.length);

    return p[0];
}

function compareObj(x, playerMove) {
    return JSON.stringify(x) === JSON.stringify(playerMove);
}

function resetScenario() {
    scenario = Object.assign({}, {
        moves: [],
    });
}


let interval;
const LENGTH = 3;
let fields = [];

function createFields() {
    fields = [];
    for (let y = LENGTH - 1; y >= 0; y--) {
        let owner = "none";
        if (y === 0) {
            owner = "spieler";
        }
        if (y === LENGTH - 1) {
            owner = "cpu";
        }

        for (let x = 0; x < LENGTH; x++) {
            fields.push({owner, x, y});
        }
    }
}

function start() {
    createFields();
}


function resetGame() {
    start();
}

function showWinner(winner) {
    console.log(" ======== winner =========> ", winner);
}


function getPossibleMoves(whoAmi) {
    let possibleMoves = [];
    let positions = [];

    for (let field of fields) {
        let y = field.y;
        let x = field.x;

        let pos = {x, y};

        if (field.owner === whoAmi) {
            positions.push(pos);
        }
    }

    for (let pos of positions) {
        for (let field of fields) {
            let yTarget = field.y;
            let xTarget = field.x;
            let ownerTarget = field.owner;

            let xSource = pos.x;
            let ySource = pos.y;

            let move = {xSource, ySource, xTarget, yTarget, owner: whoAmi};

            if (canIMove(whoAmi, ownerTarget, xSource, ySource, xTarget, yTarget)) {
                possibleMoves.push(move);
            }

            if (canIBeat(whoAmi, ownerTarget, xSource, ySource, xTarget, yTarget)) {
                possibleMoves.push(move);
            }
        }
    }
    shuffle(possibleMoves);
    return possibleMoves;
}

function moveFigure(move) {
    let startField = fields.find((field) => field.x === move.xSource && field.y === move.ySource);
    startField.owner = "none";

    let endField = fields.find((field) => field.x === move.xTarget && field.y === move.yTarget);
    endField.owner = move.owner;

    registerMove(move);

    let winner = checkForWin(move.owner);
    if (winner !== "none") {
        showWinner(winner);
        completeScenario(winner);
        resetGame();
    }
}

function makeUserMove(move, cb) {
    moveFigure(move);
    if(cb) {
        setTimeout(() => {
            makeCPUMove();
            cb();
        }, 1000);
    }else {
        makeCPUMove();
    }

}

function makeCPUMove() {
    if (scenario.moves.length === 0) return false;
    let possibleMoves = getPossibleMoves("cpu");
    let move = getSuccess(possibleMoves);
    if (!move) {
        move = possibleMoves[0];
    }

    moveFigure(move);
}

function makeUserRandomMove(cb) {
    let possibleMoves = getPossibleMoves("spieler");
    let move = possibleMoves[0];
    makeUserMove(move, cb);
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
        return ownerTarget === "spieler" && ySource - 1 === yTarget && (xSource + 1 === xTarget || xSource - 1 === xTarget);
    }
    if (whoAmi === "spieler") {
        return ownerTarget === "cpu" && ySource + 1 === yTarget && (xSource + 1 === xTarget || xSource - 1 === xTarget);
    }
}

function checkForWin(lastMove) {

    let spieler = 0;
    let cpu = 0;

    for (let field of fields) {

        if (field.owner === "spieler") {
            if (field.y === LENGTH - 1) {
                return "spieler";
            }
            spieler++;
        }

        if (field.owner === "cpu") {
            if (field.y === 0) {
                return "cpu";
            }
            cpu++;
        }
    }

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
