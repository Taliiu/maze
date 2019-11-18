var canvas = document.getElementById('maze-game');
var ctx = canvas.getContext('2d');
ctx.width = 400;
ctx.height = 400;
const width = 40;
const rows = ctx.height / width;
const columns = ctx.width / width;
var stack = []
var currentCell;
var cells = [];
var WallIndex;
var neighboursLength;
var visitedEdge = []


for(column = 0; column < columns; column++){
    var cell = []
    for(row = 0; row < rows; row++){
        cell.push(new Cell(column, row))    
    }
    cells.push(cell)
}
for(i = 0; i < cells.length; i++){
    for(j = 0; j < cells.length; j++){
        cells[i][j].draw();
    }
    
}

function Cell(i, j){
    //i ist column index und j ist row index
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
    this.index;
    this.getNeighbour = function(){
        var neighbours = [];
        if(j > 0){
            var TOP = cells[i][j-1]
        }
        if( i < rows-1){
            var right = cells[i+1][j]
        }
        if( j < columns-1){
            var bottom = cells[i][j+1]
        }
        if( i > 0){
            var left = cells[i-1][j]
        }
        
        if(TOP && TOP.visited === false){
            neighbours.push(TOP);
        }
        if(right && right.visited === false){
            neighbours.push(right);
        }
        if(bottom && bottom.visited === false){
            neighbours.push(bottom);
        }
        if(left && left.visited === false){
            neighbours.push(left);
        }
        if(neighbours.length > 0){
            var nextMove = neighbours[Math.floor(Math.random() * neighbours.length)]
            if(nextMove == TOP){
                WallIndex = 0;
                WallIndex2 = 2;
            }else if(nextMove == right){
                WallIndex = 1;
                WallIndex2 = 3;
            }else if(nextMove == bottom){
                WallIndex = 2;
                WallIndex2 = 0;
            }else if(nextMove == left){
                WallIndex = 3;
                WallIndex2 = 1;
            }
            neighboursLength = neighbours.length
            return nextMove;
        }
    }
    this.draw = function(){
        var x = this.i * width
        var y = this.j * width

        if(this.walls[0]){
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y);
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.closePath();
        }
        if(this.walls[1]){
            ctx.beginPath();
            ctx.moveTo(x + width, y);
            ctx.lineTo(x + width, y + width)
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.closePath();
        }
        if(this.walls[2]){
            ctx.beginPath();
            ctx.moveTo(x + width, y + width);
            ctx.lineTo(x, y + width)
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.closePath();
        }
        if(this.walls[3]){
            ctx.beginPath();
            ctx.moveTo(x, y + width);
            ctx.lineTo(x, y)
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.closePath(); 
        }
        if(this.visited){
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.fillRect(x, y, width, width);
        }
        this.drawCurrentCell = ()=>{
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, width, width);
        }
    }
}
currentCell = cells[0][0]
currentCell.visited = true;

setInterval(function(){
    //requestAnimationFrame(loop) 
    for(i = 0; i < cells.length; i++){
        for(j = 0; j < cells.length; j++){
            cells[i][j].draw();
        }
        
    }
    
    var nextMove = currentCell.getNeighbour();
    if(nextMove){
        currentCell.walls[WallIndex] = false
        currentCell.draw();
        nextMove.visited = true;
        if(nextMove.i == 0 || nextMove.j == 0 || nextMove.i == cells.length-1|| nextMove.j == cells.length-1){
            console.log(nextMove)
            visitedEdge.push(nextMove)
        }
        if(neighboursLength > 1){
            stack.push(nextMove);
        }
        currentCell = nextMove
        currentCell.walls[WallIndex2] = false
        currentCell.draw();
        currentCell.drawCurrentCell();  
        //to get the last edge cell that has been visited
        /*if(visitedEdge.length == 35){
            var i = visitedEdge[-1].i;
            var j = visitedEdge[-1].j;
            if(i == 0){
                var x = 0
            }
        } */ 
        
    }else{
        for(i = stack.length - 1; i > 0; i--){
            var goBackTo = stack[i].getNeighbour()
            if(goBackTo){
                currentCell = stack[i]
                break;
            }else{
                stack.pop()
            }
        }    
    }
},100)
