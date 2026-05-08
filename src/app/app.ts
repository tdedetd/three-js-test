import { Component } from '@angular/core';
import { Scene } from './components/scene/scene';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Scene]
})
export class App {

}
