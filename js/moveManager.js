let movesScenarios = [];

let data = localStorage.getItem("data") && JSON.parse(localStorage.getItem("data"));

if (data) {
    movesScenarios = data;
}



let scenario = {
    moves: [],
    success: null,
};

function registerMove(move) {
    scenario.moves.push(move);
}

function completeScenario(success) {
    if(!success){
        console.log("gelernt");
    }
    scenario.success = success;
    let isScenarioAlreadyExists = false;
    for (let movesScenario of movesScenarios) {
        if (JSON.stringify(movesScenario) === JSON.stringify(scenario)) {
            isScenarioAlreadyExists = true;
        }
    }
    !isScenarioAlreadyExists &&  movesScenarios.push(scenario);
    localStorage.setItem("data", JSON.stringify(movesScenarios));

    resetScenario();
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function getSuccess(possibleMoves) {
    console.log("wie viele scenarios", movesScenarios.filter(s => !s.success).length);
    console.log("possibleMoves before", possibleMoves);
    let failureMoveIndex = scenario.moves.length;
    let failureScenarios = movesScenarios.filter((s) => s.success === false);
    let p = Object.assign([], possibleMoves);
    for (let failureScenario of failureScenarios) {
        if (JSON.stringify(scenario.moves) === JSON.stringify(failureScenario.moves.slice(0, failureMoveIndex))) {
            if(failureScenario.moves.length - 2 === failureMoveIndex){ // Der letzte Zug (schlechter Zug), der zur Niederlage geführt hat.
                let failureMove = failureScenario.moves[failureMoveIndex];
                console.log("failureMove", failureMove);

                p = p.filter(m => compareObj(m, failureMove) === false); // Den schlechter Zug raus nehmen.
            }
        }
    }
    console.log("possibleMoves after", p);
    return p[0];
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

    for (let key of xKeys) {
        if (x[key] !== playerMove[key]) {
            return false;
        }
    }
    return true;
}

function resetScenario() {
    scenario = Object.assign({}, {
        moves: [],
        success: null,
    });
}
