import { Component, OnInit } from '@angular/core';
import { Square } from '../square';
import { Knight } from '../knight';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent implements OnInit {

  boardKnightStart: Knight = {
    xstart: 1,
    ystart: 1,
    xend: 1,
    yend: 1
  }

  squareHasKnightStart: number = 0 // Keeps track of the last square index where the knight start was
  squareHasKnightEnd: number = 0 // Keeps track of the last square index where the knight end was

  squares: Square[] = [];

  numOfSteps: number = 0;

  constructor() {  }

  ngOnInit(): void {
    this.makeSquares();
    this.placeKnightStart(this.boardKnightStart);
    this.placeKnightEnd(this.boardKnightStart);
    this.dijkstra();
  }

  makeSquares(): void {
    var backgroundColorString;
    var colorString
    var thisSquare;
    var rowcount = 0;
    for (let i = 0; i < 64; i++) {
      if ((i + 1 + rowcount) % 2) {
        backgroundColorString = "black";
        colorString = "white"
      } else {
          backgroundColorString = "white";
          colorString = "black"
      }
      if ((i + 1) % 8 == 0) {
        rowcount++;
      }
      this.squares[i] = {
        id: "app " + i, x: Math.floor(i/8) + 1, y: (i - ((Math.floor(i/8)) * 8)) + 1, color: colorString,
         backgroundcolor: backgroundColorString, backgroundcolornorm: backgroundColorString,
         has_knight_start: "", has_knight_end: "", has_knight_path: "" 
      }
    }
  }

  placeKnightStart(knight: Knight): void {
    let index = (this.boardKnightStart.xstart - 1) * 8 + this.boardKnightStart.ystart - 1;        

    if (this.squareHasKnightStart == this.squareHasKnightEnd) {
      this.squares[this.squareHasKnightStart].backgroundcolor = "red";
      this.squares[this.squareHasKnightStart].has_knight_end = "END";
      this.squares[this.squareHasKnightEnd].color = "white"
    } else {
      this.squares[this.squareHasKnightStart].backgroundcolor = this.squares[this.squareHasKnightStart].backgroundcolornorm;
      if (this.squares[this.squareHasKnightStart].backgroundcolor == "black") {
        this.squares[this.squareHasKnightStart].color = "white";
      } else {
        this.squares[this.squareHasKnightStart].color = "black";
      }
    }
    this.squares[this.squareHasKnightStart].has_knight_start = "";

    if (index == this.squareHasKnightEnd) {
      this.squares[index].has_knight_end = "\\E";
    }
    this.squares[index].backgroundcolor = "green";
    this.squares[index].color = "white"
    this.squares[index].has_knight_start = "K";
    this.squareHasKnightStart = index;
  }

  updateKnightStart(knight: Knight): void {
    this.boardKnightStart = knight;
    this.placeKnightStart(knight);
    this.dijkstra();
  }

  placeKnightEnd(knight: Knight): void {
    let index = (this.boardKnightStart.xend - 1) * 8 + this.boardKnightStart.yend - 1;        

    if (this.squareHasKnightEnd == this.squareHasKnightStart) {
      this.squares[this.squareHasKnightEnd].backgroundcolor = "green";
      this.squares[this.squareHasKnightEnd].color = "white";
    } else {
      this.squares[this.squareHasKnightEnd].backgroundcolor = this.squares[this.squareHasKnightEnd].backgroundcolornorm;
      if (this.squares[this.squareHasKnightEnd].backgroundcolor == "black") {
        this.squares[this.squareHasKnightEnd].color = "white";
      } else {
        this.squares[this.squareHasKnightEnd].color = "black";
      }
    }
    this.squares[this.squareHasKnightEnd].has_knight_end = "";

    this.squares[index].backgroundcolor = "red";
    this.squares[index].color = "white"
    if (index == this.squareHasKnightStart) {
      this.squares[index].has_knight_end = "\\E";
    } else {
      this.squares[index].has_knight_end = "END";
    }
    this.squareHasKnightEnd = index;
  }

  updateKnightEnd(knight: Knight): void {
    this.boardKnightStart = knight;
    this.placeKnightEnd(knight);
    this.dijkstra();
  }

  dijkstra(): void {
    this.clearBoard();
    let ksindex = this.squareHasKnightStart;
    let keindex = this.squareHasKnightEnd;
    if (ksindex == keindex) {
      this.numOfSteps = 0;
      return;
    }

    let currentPoint: number = ksindex;
    let newPoint: number = 0;
    let points: number[] = [];
    let adjPoints = new Map<string, number>();
    let tovisit = new Map<number, number>();
    let wayback: number[] = [];
    let nextPoints = new Array<number>();
    let waybackPoint: number = -1;
    let shortestPath = new Array<number>();
    let shortPathCount: number = 0;

    // initalize tovisit map and points map and wayback map
    for (let i = 0; i < 64; i++) {
      tovisit.set(i, 0);
      points[i] = 0;
      wayback[i] = -1;
    }
 
    wayback[currentPoint] = currentPoint;

    while (tovisit.size > 0) {
      adjPoints = this.findAdjacent(currentPoint, tovisit);
      adjPoints.forEach((value, key, map) => {
          if (!nextPoints.includes(value)) {
            nextPoints.push(value);
          }
          
          if (wayback[value] == -1) {
            wayback[value] = currentPoint;
            points[value] = points[currentPoint] + 1;
          } else if (wayback[value] != -1 && (points[currentPoint] + 1) < points[value]) {
            wayback[value] = currentPoint;
            points[value] = points[currentPoint] + 1;
          } 
      });
      
      tovisit.delete(currentPoint);
      // Take elements off the front of nextPoints, make this loop BFS, the earlier adjacent items get searched first.
      currentPoint = nextPoints.splice(0,1)[0];
      adjPoints.clear();
    }

    waybackPoint = keindex;
    while (waybackPoint != ksindex) {
      waybackPoint = wayback[waybackPoint];
      shortestPath.push(waybackPoint);
    }
    
    shortPathCount = shortestPath.length;
    shortestPath.forEach((value, index, arr) => {
      shortPathCount--;
      if (shortPathCount > 0) {
        this.squares[value].backgroundcolor = "blue";
        this.squares[value].has_knight_path = shortPathCount.toString();
        this.squares[value].color = "white";
      } 
    });

    this.numOfSteps = points[keindex];
  }

  findAdjacent(index: number, tovisit: Map<number, number>): Map<string, number> {
    // Started with basic cardinal directions, commented out in lieu of knight directions
    // let up: number;
    // let down: number;
    // let left: number = index - 8;
    // let right: number = index + 8;

    // if ((index + 1) % 8 == 0) {
    //   up = -1;
    // } else {
    //   up = index + 1;
    // }

    // if (index % 8 == 0) {
    //   down = -1;
    // } else {
    //   down = index - 1;
    // }
    let NE: number = 0;
    let NW: number = 0;
    let SE: number = 0;
    let SW: number = 0;
    let WN: number = 0;
    let WS: number = 0;
    let EN: number = 0;
    let ES: number = 0;

    if (index < 8) { // check if left column
      NW = -1; SW = -1; WN = -1; WS = -1;
    } else if (index > 56) { // check if right column
      NE = -1; SE = -1; EN = -1; ES = -1;
    } else if (index < 16 && index > 7) { // check second row from left
      WN = -1; WS = -1;
    } else if (index < 56 && index > 47) { // check second row from right
      EN = -1; ES = -1;
    }

    if ((index + 1) % 8 == 0) { // check if top row
      NE = -1; NW = -1; WN = -1; EN = -1;
    } else if (index % 8 == 0) { // check if bottom row
      SE = -1; SW = -1; WS = -1; ES = -1;
    } else if ((index + 2) % 8 == 0) { // check if second row from top
      NE = -1; NW = -1;
    } else if ((index - 1) % 8 == 0) { // check if second row from bottom
      SE = -1; SW = -1;
    }
    
    if (NE != -1) {
      NE = index + 2 + 8;
    }
    if (NW != -1) {
      NW = index + 2 - 8;
    }
    if (SE != -1) {
      SE = index - 2 + 8;
    }
    if (SW != -1) {
      SW = index - 2 - 8;
    }
    if (WN != -1) {
      WN = index - 16 + 1;
    }
    if (WS != -1) {
      WS = index - 16 - 1;
    }
    if (EN != -1) {
      EN = index + 16 + 1;
    }
    if (ES != -1) {
      ES = index + 16 - 1;
    }

    let returnAdj = new Map<string, number>();
    if (NE >= 0 && NE <= 63 && tovisit.has(NE)) { returnAdj.set("NE", NE) };
    if (NW >= 0 && NW <= 63  && tovisit.has(NW)) { returnAdj.set("NW", NW) };
    if (SE >= 0 && SE <= 63  && tovisit.has(SE)) { returnAdj.set("SE", SE) };
    if (SW >= 0 && SW <= 63  && tovisit.has(SW)) { returnAdj.set("SW", SW) };
    if (WN >= 0 && WN <= 63 && tovisit.has(WN)) { returnAdj.set("WN", WN) };
    if (WS >= 0 && WS <= 63  && tovisit.has(WS)) { returnAdj.set("WS", WS) };
    if (EN >= 0 && EN <= 63  && tovisit.has(EN)) { returnAdj.set("EN", EN) };
    if (ES >= 0 && ES <= 63  && tovisit.has(ES)) { returnAdj.set("ES", ES) };

    return returnAdj;
  }

  clearBoard(): void {
    this.squares.forEach((value, index, arr) => {
      value.has_knight_path = "";
      if (value.has_knight_start === "" && value.has_knight_end === "") {
        if (value.backgroundcolornorm == "black") {
          value.color = "white";
        } else {
          value.color = "black";
        }
        value.backgroundcolor = value.backgroundcolornorm;
      }
    });
  }
}
