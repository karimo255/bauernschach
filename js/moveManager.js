const movesScenarios = [];


let scenario = {
    moves: [],
    success: null,
};

let zwErg = [];

function registerMove(move) {
    scenario.moves.push(move);
}

function completeScenario(success) {
    scenario.success = success;
    movesScenarios.push(scenario);
    resetScenario();
}

function getSuccess() {
    let index = scenario.moves.length - 1;
    let playerMove = scenario.moves[index];
    let successScenarios = movesScenarios.filter((s) => s.success == true);

    for (let successScenario of successScenarios){
        if(isMoveInMoves(playerMove, successScenario.moves[index])){
            return successScenario.moves[index + 1];
        }
    }

    return false;
}


function dontDoIt() {
    let index = scenario.moves.length - 1;
    let playerMove = scenario.moves[index];
    let failScenarios = movesScenarios.filter((s) => s.success == false);
    let next = false;

    for (let failScenario of failScenarios){
        next = false;
        if(isMoveInMoves(playerMove, failScenario.moves[failScenario.moves.length - 3])){
            for(let entry of zwErg) {
                if (compareObj(entry, failScenario.moves[failScenario.moves.length - 2])) {
                    next = true;
                }
            }
            if (next) {
                continue;
            } else {
                zwErg.push(failScenario.moves[failScenario.moves.length - 2]);
                return failScenario.moves[failScenario.moves.length - 2];
            }
        }
    }

    return false;
}

function compareObj(x, playerMove) {
    let xKeys = Object.keys(x);
    if (playerMove == null || playerMove == undefined) {
        return false;
    }
    let playerKeys = Object.keys(playerMove);

    if (xKeys.length !== playerKeys.length) {
        return false;
    }

    for(let key of xKeys) {
            if (x[key] !== playerMove[key]) {
                return false;
            }
    }
    return true;
}

function isMoveInMoves(move, moves) {
    /* for(let m of moves){
        if(compareObj(m, move)){
            return true;
        }
    } */
    if(compareObj(move, moves)){
        return true;
    }
    return false;
}

function resetScenario() {
    scenario = Object.assign({}, {
        moves: [],
        success: null,
    });
}

function clearZwErg() {
    zwErg = [];
}