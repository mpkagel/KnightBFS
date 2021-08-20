import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Knight } from '../knight';
import { Observable, of, Observer } from 'rxjs';

@Component({
  selector: 'app-knight',
  templateUrl: './knight.component.html',
  styleUrls: ['./knight.component.css']
})
export class KnightComponent implements OnInit {

  @Output() knightChangedStart = new EventEmitter<Knight>();
  @Output() knightChangedEnd = new EventEmitter<Knight>();

  knight: Knight = {
    xstart: 1,
    ystart: 1,
    xend: 1,
    yend: 1
  }

  constructor() { }

  ngOnInit(): void {
  }

  changeKnightStart(knight: Knight): void {
    this.knight = knight;
    this.knightChangedStart.emit(this.knight);
  }

  changeKnightEnd(knight: Knight): void {
    this.knight = knight;
    this.knightChangedEnd.emit(this.knight);
  }
}