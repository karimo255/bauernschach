!function () {
    function e(t, o) {
        return n ? void (n.transaction("s").objectStore("s").get(t).onsuccess = function (e) {
            var t = e.target.result && e.target.result.v || null;
            o(t)
        }) : void setTimeout(function () {
            e(t, o)
        }, 100)
    }

    var t = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!t) return void console.error("indexDB not supported");
    var n, o = {k: "", v: ""}, r = t.open("d2", 1);
    r.onsuccess = function (e) {
        n = this.result
    }, r.onerror = function (e) {
        console.error("indexedDB request error"), console.log(e)
    }, r.onupgradeneeded = function (e) {
        n = null;
        var t = e.target.result.createObjectStore("s", {keyPath: "k"});
        t.transaction.oncomplete = function (e) {
            n = e.target.db
        }
    }, window.ldb = {
        get: e, set: function (e, t) {
            o.k = e, o.v = t, n.transaction("s", "readwrite").objectStore("s").put(o)
        }
    }
}();

let movesScenarios = [];


ldb.get('4_mal_4', function (data) {
    if (data) {
        movesScenarios = JSON.parse(data);
    }
   // ldb.set("data", null);
});


let scenario = {
    moves: [],
};

function registerMove(move) {
    scenario.moves.push(move);
}

function completeScenario(success) {
    if (success) {
        resetScenario();
        return;
    }
    // console.log("gelernt");

    let isScenarioAlreadyExists = false;
    for (let movesScenario of movesScenarios) {
        if (JSON.stringify(movesScenario) === JSON.stringify(scenario)) {
            isScenarioAlreadyExists = true;
        }
    }
    !isScenarioAlreadyExists && movesScenarios.push(scenario);
    ldb.set("4_mal_4", JSON.stringify(movesScenarios));

    resetScenario();
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function getSuccess(possibleMoves) {
    console.log("possibleMoves before", possibleMoves);
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
                console.log("possibleMoves before", possibleMoves);
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
    });
}
