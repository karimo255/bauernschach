const movesScenarios = [];


let scenario = {
    moves: [],
    success: null,
};

function registerMove(move) {
    scenario.moves.push(move);
}

function completeScenario(success) {
    scenario.success = success;
    movesScenarios.push(scenario);
    scenario = Object.assign({}, {
        moves: [],
        success: null,
    });
}

function getSuccess() {
    let index = scenario.moves.length - 1;
    let playerMove = scenario.moves[index];
    let successScenarios = movesScenarios.filter((s) => s.success == true);

    for (let successScenario of successScenarios){
        if(isMoveInMoves(playerMove, successScenario.moves)){
            return successScenario.moves[index + 1];
        } else{
           return false;
        }
    }
}


function dontDoIt() {

}

function compareObj(x, playerMove) {
    let xKeys = Object.keys(x);
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
    for(let m of moves){
        if(compareObj(m, move)){
            return true;
        }
    }
    return false;
}