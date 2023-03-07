function createMinefield() {
    let minefield = {
        rows: []
    };

    for (let y =0; y < 9; y++) {
        let row = {
            spots: []
        };

        for (let x = 0; x < 9; x++) {
            let spot = {
                isCovered: true,
                content: "empty"
            };
            row.spots.push(spot);
        }
        minefield.rows.push(row);
    }
    placeRandomMine(minefield);
    calculateAllNumbers(minefield);
    return minefield;
}

function getSpot(minefield, row, column) {
    return minefield.rows[row].spots[column];
}

function placeRandomMine(minefield) {
    for (let i = 0; i < 10; i++) {
        let row = Math.round(Math.random() * 8);
        let column = Math.round(Math.random() * 8);
        let spot = getSpot(minefield, row, column);
        spot.content = "mine";
        console.log("Placed a mine at: " + row + " " + column);
    }
}

function calculateNumber(minefield, row, column) {
    let thisSpot = getSpot(minefield, row, column);
    if (thisSpot.content == 'mine') {
        return;
    }
    let minecount = 0;
    //check if first row
    if (row > 0) {
        //check if first column
        if (column > 0) {
            //top left
            let spot = getSpot(minefield, row - 1, column - 1);
            if (spot.content == "mine") {
                minecount++;
            }
        }
        //top
        let spot = getSpot(minefield, row - 1, column);
        if (spot.content == "mine") {
            minecount++;
        }
        //check if last column
        if (column < 8) {
            //top right
            let spot = getSpot(minefield, row - 1, column + 1);
            if (spot.content == "mine") {
                minecount++;
            }
        }
    }
    //check if first column
    if (column > 0) {
        //left
        let spot = getSpot(minefield, row, column - 1);
        if (spot.content == "mine") {
            minecount++;
        }
    }
    //check if last column
    if (column < 8) {
        //right
        let spot = getSpot(minefield, row, column + 1);
        if (spot.content == "mine") {
            minecount++;
        }
    }
    //check if last row
    if (row < 8) {
        //check if first column
        if (column > 0) {
            //below left
            let spot = getSpot(minefield, row + 1, column - 1);
            if (spot.content == "mine") {
                minecount++;
            }
        }
        //below
        let spot = getSpot(minefield, row + 1, column);
        if (spot.content == "mine") {
            minecount++;
        }
        if (column < 8) {
            //below right
            let spot = getSpot(minefield, row + 1, column + 1);
            if (spot.content == "mine") {
                minecount++;
            }
        }
    }

    if(minecount > 0) {
        thisSpot.content = minecount;
    }
}

function calculateAllNumbers(minefield) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            calculateNumber(minefield, x, y);
        }
    }
}

function hasWon(minefield) {
    for(let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let spot = getSpot(minefield, y, x);
            if(spot.isCovered && spot.content != "mine") {
                return false;
            }
        }
    }
    return true;
}

const minesweeperModule = angular.module('minsweeperApp', []);

const minesweeperController = function($scope) {
    const restartGame = function(minefield) {
        for(let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                let spot = getSpot(minefield, y, x);
                if(!spot.isCovered || spot.content != "empty") {
                    spot.isCovered = true;
                    spot.content = "empty";
                }
            }
        }
        placeRandomMine(minefield);
        calculateAllNumbers(minefield);
        $scope.hasLostMessageVisible = false;
        return minefield;
    }

    $scope.test = "Is Everything Working?";
    $scope.minefield = createMinefield();
    $scope.uncoverSpot = function(spot) {
        spot.isCovered = false;

        if (spot.content == "mine") {
            $scope.hasLostMessageVisible = true;
        } else {
            if(hasWon($scope.minefield)) {
                $scope.isWinMessageVisible = true;
            }
        }
    }
    $scope.restart = restartGame;
};

minesweeperModule.controller('minesweeperController', minesweeperController);