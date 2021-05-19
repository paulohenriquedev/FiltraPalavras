import { Component, OnInit  } from '@angular/core';
import { fromEvent, of  } from 'rxjs';
import { 
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap 
} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private element!: HTMLElement;
  
  constructor() { }

  ngOnInit() {
    this.element = document.getElementById('type-ahead')!;
    console.log('Olá, componente Iniciado!');
    this.eventManager();
  }

  private eventManager() {    
    const subscribe = fromEvent(this.element, 'keyup')
      .pipe(
        debounceTime(200),
        map(event => (<HTMLInputElement>event.target).value),
        distinctUntilChanged(),
        switchMap(this.fakeContinentsRequest),
        tap(c => (document.getElementById('output')!.innerText = (<Array<String>>c).join('\n')))
      ).subscribe(val => console.log(val));
  }


  private fakeContinentsRequest(keys:any):any { 
    let array: String[] = [
      'africa',
      'antarctica',
      'asia',
      'australia',
      'europe',
      'north america',
      'south america'
    ].filter(e => {
      console.log(keys.toLowerCase());
      return e.indexOf(keys.toLowerCase()) > -1;
    });

    return of(array).pipe(
      tap(_ => console.log(`API CALL at ${new Date()}`))
    );
  }
}
