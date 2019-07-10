const movesScenario = [];


let scenario = {
    moves: [],
    success: null,
};

function registerMove(move) {
    scenario.moves.push(move);
}

function completeScenario(success) {
    scenario.success = success;
    movesScenario.push(scenario);
}

function getSuccess() {

}

