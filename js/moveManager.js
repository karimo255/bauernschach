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
}

function getSuccess() {
    let moveIndex = getMoveIndex();

    let playerMove = scenario.moves.filter((m, index) => m.owner === "spieler" && index ===  2 * moveIndex);
    
    succesesScenarios = movesScenarios.filter((s) => s.success == true);

    for (let succesesScenario of succesesScenarios){
        if(isMoveInMoves(playerMove, succesesScenario.moves)){
            console.log("ja", playerMove);
        } else{
            console.log("nein", playerMove);
        }
    }
}

function dontDoIt() {

}

function getMoveIndex() {
    return scenario.moves.filter((m) => m.owner === "cpu").length;
}

function compareObj(x, playerMove) {
    let xKeys = Object.keys(x);
    let playerKeys = Object.keys(playerMove);

    if (xKeys.length !== playerKeys.length) {
        console.log("false");
        return false;
    }

    for(let key of xKeys) {
            if (x[key] !== playerMove[key]) {
                console.log("false");
                return false;
            }
    }
    console.log("true");
    return true;
}

function isMoveInMoves(move, moves) {
    console.log('move', move);
    console.log('moves', moves);
    for(let m of moves){
        if(compareObj(m, move)){
            return true;
        }
    }
    return false;
}