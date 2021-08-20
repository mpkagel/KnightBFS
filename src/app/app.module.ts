import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppComponent } from './app.component';
import { KnightComponent } from './knight/knight.component';
import { ChessboardComponent } from './chessboard/chessboard.component';
import { ChesssquareComponent } from './chesssquare/chesssquare.component';

@NgModule({
  declarations: [
    AppComponent,
    KnightComponent,
    ChessboardComponent,
    ChesssquareComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
