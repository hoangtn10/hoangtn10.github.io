const UP = 0
const DOWN = 1
const LEFT = 2
const RIGHT = 3
const UPLEFT = 4
const UPRIGHT = 5
const DOWNLEFT = 6
const DOWNRIGHT = 7

const NO_PLAYER = 0
const PLAYER_1  = 1
const PLAYER_2  = 2 

const PLAYER_1_COLOR = 'rgb(60, 72, 89)'
const PLAYER_2_COLOR = 'rgb(89, 60, 72)'
const CELL_COLOR = 'rgb(206, 209, 214)'

const NUM_COL = 7
const NUM_ROW = 7
const MID_COL = 3
const NUM_HOVER_ROW = 1

const GAP = 7
const SPEED = 200

var BOARD = []

var PLAYER = PLAYER_1
var WIDTH = 0
var CURR_HOVER_COL = 0
var IN_TRANSITION = false
var CONNECT_NUM = 4

for (var row = 0; row < NUM_ROW; row++) {
    var list = []
    for (var col = 0; col < NUM_COL; col++) {
        list.push(NO_PLAYER)
    }
    BOARD.push(list)
}

function load() {
    var cell = document.getElementById("cell")
    cell.onmouseover = function() {
        cellHover(0)
    }
    cell.onclick = function() {
        cellClick(0)
    }

    for (var i = 1; i < (NUM_COL * NUM_ROW); i++) {
        var cln = cell.cloneNode(true)
        cell.parentNode.insertBefore(cln, cell)
    }

    var list = document.getElementsByClassName("square")
    for (var row = 0; row < NUM_ROW; row++) {
        for (var col = 0; col < NUM_COL; col++) {
            var cell = list[row * NUM_COL + col]


            if (row != 0) {
                cell.style.borderColor = CELL_COLOR
                cell.style.backgroundColor = CELL_COLOR
            }

            cell.onmouseover = (function(col) {
                return function() {
                    cellHover(col)
                }
            })(col)

            cell.onclick = (function(col) {
                return function() {
                    cellClick(col)
                }
            })(col)
        }
    }

    cellHover(0)
    resize()
    window.addEventListener("resize", resize)
}

function cellHover(col) {
    var cell = document.getElementById("cell")
    var prevHeadCell = cell.parentNode.childNodes[CURR_HOVER_COL + 1]
    prevHeadCell.style.backgroundColor = "white"
    prevHeadCell.style.border = ""

    CURR_HOVER_COL = col

    var headCell = cell.parentNode.childNodes[col + 1]
    headCell.style.backgroundColor = PLAYER === PLAYER_1 ? PLAYER_1_COLOR : PLAYER_2_COLOR
}

function cellClick(col) {
    var row = getFreeRow(col, BOARD)
    if (row == -1 || IN_TRANSITION == true) {
        return
    }

    IN_TRANSITION = true

    BOARD[row][col] = createFreeCell(col)

    PLAYER = PLAYER == PLAYER_1 ? PLAYER_2 : PLAYER_1
    var minimaxList = minimax(3, PLAYER, BOARD)
    var move = maxIndex(minimaxList)


    if (PLAYER == PLAYER_1) {
        animate(row, col, null, null)
    } else {
        animate(row, col, cellClick, move)
    }
}

function animate(row, col, callback, callback_col) {
    $("square").finish()

    if (BOARD[row][col] == -1) {
        return
    }

    var cellX = (((WIDTH / NUM_COL) + (GAP / NUM_COL)) * col) + $(".controller").position().left + 'px'
    var cellY = ((WIDTH / NUM_COL) * row) + $(".controller").position().top + 'px'
    var cell = BOARD[row][col]

    $(cell).css({
        'left': cellX,
        'top': $(".controller").position().top
    })

    $(cell).animate({
        left: cellX,
        top: cellY
    }, SPEED, function() {
        // Completed animation
        IN_TRANSITION = false

        $(':hover').trigger('mouseover')

        if (callback) {
            callback(callback_col)
        }
    })

    $(cell).css({
        'left': cellX,
        'top': cellY
    })
}

function resize() {
    WIDTH = $(".controller").outerWidth(true)
    var cellWidth = ((WIDTH / NUM_COL) - GAP) + 'px'

    $(".controller").css({
        "height": WIDTH * (NUM_ROW / NUM_COL) + 'px'
    })
    $(".square").css({
        "width": cellWidth,
        "height": cellWidth,
        "line-height": cellWidth
    })

    var list = document.getElementsByClassName("square")
    for (var row = 0; row < NUM_ROW; row++) {
        for (var col = 0; col < NUM_COL; col++) {

            var cell = list[row * NUM_COL + col]
            var cellX = (((WIDTH / NUM_COL) + (GAP / NUM_COL)) * col) + $(".controller").position().left + 'px'
            var cellY = ((WIDTH / NUM_COL) * row) + $(".controller").position().top + 'px'
            $(cell).css({
                'left': cellX,
                'top': cellY
            })
            if (BOARD[row][col] != -1) {
                cell = BOARD[row][col]
                $(cell).css({
                    'left': cellX,
                    'top': cellY
                })
            }
        }
    }
}

function createFreeCell(col) {
    var cell = document.getElementById("cell")
    var freeCell = cell.cloneNode(true)
    freeCell.style.backgroundColor = PLAYER == 1 ? PLAYER_1_COLOR : PLAYER_2_COLOR
    freeCell.onmouseover = function() {
        cellHover(col)
    }
    freeCell.onclick = function() {
        cellClick(col)
    }
    cell.parentNode.appendChild(freeCell)
    return freeCell
}

function newGame() {
    for (var row = 0; row < NUM_ROW; row++) {
        for (var col = 0; col < NUM_COL; col++) {
            if (BOARD[row][col] == NO_PLAYER) {
                continue
            }
            var cell = BOARD[row][col]
            cell.parentNode.removeChild(cell)
            BOARD[row][col] = NO_PLAYER
        }
    }
}

/*******************/
/** INTERACT API  **/
/*******************/

function getFreeRow(col, inputBoard) {
    for (var row = NUM_ROW - 1; row >= NUM_HOVER_ROW; row--) {
        if (inputBoard[row][col] == NO_PLAYER) {
            return row
        }
    }
    return -1
}

function getPlayer(cell) {
    if (isNaN(cell) && cell != undefined) {
        if (cell.style.backgroundColor == PLAYER_1_COLOR) {
            return PLAYER_1
        } else if (cell.style.backgroundColor == PLAYER_2_COLOR) {
            return PLAYER_2
        }
    }
    if (!isNaN(cell)) {
        return cell
    }
}

function getMove() {
    var validMoves = getValidMoves(BOARD)
    var randomMoveIndex = Math.floor(Math.random() * validMoves.length)
    return validMoves[randomMoveIndex]
}

/*******************/
/** MINIMAX AI    **/
/*******************/

function max(list) {
    max_value = -Infinity
    for (var i = 0; i < list.length; i++) {
        if (list[i] == null) {
            continue
        }
        else if (max_value < list[i]) {
            max_value = list[i]
        }
    }
    return max_value
}

function maxIndex(list) {
    max_value = -Infinity
    max_index = 0
    for (var i = 0; i < list.length; i++) {
        if (list[i] == null) {
            continue
        }
        else if (max_value < list[i]) {
            max_index = i
            max_value = list[i]
        }
    }
    return max_index
}

function min(list) {
    min_value = Infinity
    for (var i = 0; i < list.length; i++) {
        if (list[i] == null) {
            continue
        }
        else if (min_value > list[i]) {
            min_value = list[i]
        }
    }
    return min_value
}

function minimax(depth, player, inputBoard) {
    var otherPlayer = player == PLAYER_1 ? PLAYER_2 : PLAYER_1
    var pointList = []
    var minimaxedPointList = []

    if (depth == 1) {
        for (var col = 0; col < NUM_COL; col++) {
            pointList.push(getPoint(col, player, inputBoard))
        }
        // console.log(inputBoard)
        return pointList
    }

    // If depth is odd
    if (depth % 2 == 1) {
        for (var col = 0; col < NUM_COL; col++) {
            var newBoard = copyBoard(inputBoard)

            var row = getFreeRow(col, newBoard)
            if (row != -1) {
                newBoard[row][col] = player
            }

            if (row == -1) {
                pointList.push(null)
            }
            else if (isWon(player, newBoard)) {
                pointList.push(1000)
            }
            else {
                minimaxedPointList = minimax(depth - 1, otherPlayer, newBoard)
                // console.log(depth, minimaxedPointList)
                pointList.push(max(minimaxedPointList))
            }
        }
    }
    // If depth is odd
    else {
        for (var col = 0; col < NUM_COL; col++) {
            var newBoard = copyBoard(inputBoard)

            var row = getFreeRow(col, newBoard)
            if (row != -1) {
                newBoard[row][col] = player
            }

            if (row == -1) {
                pointList.push(null)
            }
            else if (isWon(player, newBoard)) {
                pointList.push(-1000)
            }
            else {
                minimaxedPointList = minimax(depth - 1, otherPlayer, newBoard)
                // console.log(depth, minimaxedPointList)
                pointList.push(min(minimaxedPointList))
            }
        }
    }
    return pointList
}

function getValidMoves(inputBoard) {
    var validMoveList = []
    for (var col = 0; col < NUM_COL; col++) {
        if (getFreeRow(col, inputBoard) != -1) {
            validMoveList.push(col)
        }
    }
    return validMoveList
}

function isWon(player, inputBoard) {
    // Check horizontal
    for (var row = NUM_HOVER_ROW; row < NUM_ROW; row++) {
        for (var col = 0; col < NUM_COL - CONNECT_NUM + 1; col++) {
            var won = true
            for (var inc = 0; inc < CONNECT_NUM; inc++) {
                if (getPlayer(inputBoard[row][col + inc]) != player) {
                    won = false
                }
            }
            if (won) {
                return true
            }
        }
    }
    // Check vertical
    for (var row = NUM_HOVER_ROW; row < NUM_ROW - CONNECT_NUM + 1; row++) {
        for (var col = 0; col < NUM_COL; col++) {
            var won = true
            for (var inc = 0; inc < CONNECT_NUM; inc++) {
                if (getPlayer(inputBoard[row + inc][col]) != player) {
                    won = false
                }
            }
            if (won) {
                return true
            }
        }
    }
    // Check diagonals
    for (var row = NUM_HOVER_ROW; row < NUM_ROW - CONNECT_NUM + 1; row++) {
        for (var col = 0; col < NUM_COL - CONNECT_NUM + 1; col++) {
            var won = true
            for (var inc = 0; inc < CONNECT_NUM; inc++) {
                if (getPlayer(inputBoard[row + inc][col + inc]) != player) {
                    won = false
                }
            }
            if (won) {
                return true
            }
        }
    }
    // check diagonal-backward
    for (var row = NUM_ROW - 1; row > NUM_ROW - CONNECT_NUM - 1; row--) {
        for (var col = 0; col < NUM_COL - CONNECT_NUM + 1; col++) {
            var won = true
            for (var inc = 0; inc < CONNECT_NUM; inc++) {
                if (getPlayer(inputBoard[row - inc][col + inc]) != player) {
                    won = false
                }
            }
            if (won) {
                return true
            }
        }
    }
    return false
}

function copyBoard(inputBoard) {
  var copy = []
  for (var row = 0; row < NUM_ROW; row++) {
    copy.push(inputBoard[row].slice())
  }
  return copy
}

function countPoint(count) {
    switch (count) {
        case 1:
            return 2
        case 2:
            return 5
        case 3:
            return 1000
    }
    return 0
}

function countOpponentPoint(count) {
    switch (count) {
        case 2:
            return -2
        case 3:
            return -100
    }
    return 0
}

function getPoint(col, player, inputBoard) {
    var point = 0
    var count = 0
    var row = getFreeRow(col, inputBoard)
    var newBoard = copyBoard(inputBoard)
    var otherPlayer = player == PLAYER_1 ? PLAYER_2 : PLAYER_1

    // Can't move here
    if (row == -1) {
        return null
    }

    // Check middle
    if (col == MID_COL) {
        point += 4
    }

    // Check vertical
    for (var inc = 0; inc < CONNECT_NUM; inc++) {
        if (row + inc >= NUM_ROW) {
            break
        }
        var disc = getPlayer(newBoard[row + inc][col])
        if (disc == otherPlayer) {
            break
        }
        if (disc == player) {
            count += 1
        }
    }
    point += countPoint(count)

    // Check horizontal
    for (var curr_col = 0; curr_col < NUM_COL - CONNECT_NUM + 1; curr_col++) {
        count = 0
        if (curr_col + CONNECT_NUM - 1 < col || curr_col > col) {
            continue
        }
        if (checkTwoInMiddle(player, newBoard, [row, curr_col], [row, curr_col + 1], [row, curr_col + 2], [row, curr_col + 3])) {
            point += 500
        }
        for (var inc = 0; inc < CONNECT_NUM; inc++) {
            var disc = getPlayer(newBoard[row][curr_col + inc])
            if (disc == otherPlayer) {
                break
            }
            if (disc == player) {
                count += 1
            }
        }
        point += countPoint(count)
    }

    // Check diagonal
    for (var dec = CONNECT_NUM - 1; dec >= 0; dec--) {
        count = 0
        if (row - dec < 1 || col - dec < 0 || row - dec + CONNECT_NUM > NUM_ROW || col - dec + CONNECT_NUM > NUM_COL) {
            continue
        }
        if (checkTwoInMiddle(player, newBoard, [row - dec, col - dec], [row - dec + 1, col - dec + 1], [row - dec + 2, col - dec + 2], [row - dec + 3, col - dec + 3])) {
            point += 500
        }
        for (var inc = 0; inc < CONNECT_NUM; inc++) {
            var disc = getPlayer(newBoard[row - dec + inc][col - dec + inc])
            if (disc == otherPlayer) {
                break
            }
            if (disc == player) {
                count += 1
            }
        }
        point += countPoint(count)
    }

    // Check diagonal-backward
    for (var dec_inc = CONNECT_NUM - 1; dec_inc >= 0; dec_inc--) {
        count = 0
        if (row + dec_inc >= NUM_ROW || col - dec_inc < 0 || row + dec_inc - CONNECT_NUM + 1 < NUM_HOVER_ROW || col - dec_inc + CONNECT_NUM - 1 >= NUM_COL) {
            continue
        }
        if (checkTwoInMiddle(player, newBoard, [row + dec_inc, col - dec_inc], [row + dec_inc - 1, col - dec_inc + 1], [row + dec_inc - 2, col - dec_inc + 2], [row + dec_inc - 3, col - dec_inc + 3])) {
            point += 500
        }
        for (var inc = 0; inc < CONNECT_NUM; inc++) {
            var disc = getPlayer(newBoard[row + dec_inc - inc][col - dec_inc + inc])
            if (disc == otherPlayer) {
                break
            }
            if (disc == player) {
                count += 1
            }
        }
        point += countPoint(count)
    }

    var opponentPoint = 0
    newBoard[row][col] = player
    for (var newCol = 0; newCol < NUM_COL; newCol++) {
        newOpponentPoint = getOpponentPoint(newCol, otherPlayer, newBoard)
        if (newOpponentPoint != null) {
            opponentPoint = Math.min(opponentPoint, getOpponentPoint(newCol, otherPlayer, newBoard)) 
        }
    }

    return point + opponentPoint
}

function getOpponentPoint(col, player, inputBoard) {
    var point = 0
    var count = 0
    var row = getFreeRow(col, inputBoard)
    var newBoard = copyBoard(inputBoard)
    var otherPlayer = player == PLAYER_1 ? PLAYER_2 : PLAYER_1

    // Can't move here
    if (row == -1) {
        return null
    }

    // Check middle
    if (col == MID_COL) {
        point += 4
    }

    // Check vertical
    for (var inc = 0; inc < CONNECT_NUM; inc++) {
        if (row + inc >= NUM_ROW) {
            break
        }
        var disc = getPlayer(newBoard[row + inc][col])
        if (disc == otherPlayer) {
            break
        }
        if (disc == player) {
            count += 1
        }
    }
    point += countOpponentPoint(count)

    // Check horizontal
    for (var curr_col = 0; curr_col < NUM_COL - CONNECT_NUM + 1; curr_col++) {
        count = 0
        if (curr_col + CONNECT_NUM - 1 < col || curr_col > col) {
            continue
        }
        if (checkTwoInMiddle(player, newBoard, [row, curr_col], [row, curr_col + 1], [row, curr_col + 2], [row, curr_col + 3])) {
            point += -50
        }
        for (var inc = 0; inc < CONNECT_NUM; inc++) {
            var disc = getPlayer(newBoard[row][curr_col + inc])
            if (disc == otherPlayer) {
                break
            }
            if (disc == player) {
                count += 1
            }
        }
        point += countOpponentPoint(count)
    }

    // Check diagonal
    for (var dec = CONNECT_NUM - 1; dec >= 0; dec--) {
        count = 0
        if (row - dec < 1 || col - dec < 0 || row - dec + CONNECT_NUM > NUM_ROW || col - dec + CONNECT_NUM > NUM_COL) {
            continue
        }
        if (checkTwoInMiddle(player, newBoard, [row - dec, col - dec], [row - dec + 1, col - dec + 1], [row - dec + 2, col - dec + 2], [row - dec + 3, col - dec + 3])) {
            point += -50
        }
        for (var inc = 0; inc < CONNECT_NUM; inc++) {
            var disc = getPlayer(newBoard[row - dec + inc][col - dec + inc])
            if (disc == otherPlayer) {
                break
            }
            if (disc == player) {
                count += 1
            }
        }
        point += countOpponentPoint(count)
    }

    // Check diagonal-backward
    for (var dec_inc = CONNECT_NUM - 1; dec_inc >= 0; dec_inc--) {
        count = 0
        if (row + dec_inc >= NUM_ROW || col - dec_inc < 0 || row + dec_inc - CONNECT_NUM + 1 < NUM_HOVER_ROW || col - dec_inc + CONNECT_NUM - 1 >= NUM_COL) {
            continue
        }
        if (checkTwoInMiddle(player, newBoard, [row + dec_inc, col - dec_inc], [row + dec_inc - 1, col - dec_inc + 1], [row + dec_inc - 2, col - dec_inc + 2], [row + dec_inc - 3, col - dec_inc + 3])) {
            point += -50
        }
        for (var inc = 0; inc < CONNECT_NUM; inc++) {
            var disc = getPlayer(newBoard[row + dec_inc - inc][col - dec_inc + inc])
            if (disc == otherPlayer) {
                break
            }
            if (disc == player) {
                count += 1
            }
        }
        point += countOpponentPoint(count)
    }

    return point
}

function checkTwoInMiddle(player, inputBoard, pos1, pos2, pos3, pos4){
    if (getPlayer(inputBoard[pos1[0]][pos1[1]]) == 0)
        if (getPlayer(inputBoard[pos2[0]][pos2[1]]) == player)
            if (getPlayer(inputBoard[pos3[0]][pos3[1]]) == player)
                if (getPlayer(inputBoard[pos4[0]][pos4[1]]) == 0)
                    if (getFreeRow(pos1[1], inputBoard) == pos1[0])
                        if (getFreeRow(pos4[1], inputBoard) == pos4[0])
                            return true
    return false
}
