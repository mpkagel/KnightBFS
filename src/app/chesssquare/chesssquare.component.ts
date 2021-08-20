import { Component, OnInit, Input } from '@angular/core';
import { Square } from '../square';

@Component({
  selector: 'app-chesssquare',
  templateUrl: './chesssquare.component.html',
  styleUrls: ['./chesssquare.component.css']
})
export class ChesssquareComponent implements OnInit {

  @Input() square: Square = {
    id: "",
    x: 0,
    y: 0,
    color: "black",
    backgroundcolor: "white",
    backgroundcolornorm: "white",
    has_knight_start: "",
    has_knight_end: "",
    has_knight_path: ""
  }

  constructor() { 
  }

  ngOnInit(): void {
  }
}
