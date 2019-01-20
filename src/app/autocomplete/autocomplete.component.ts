import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ForecastComponent} from '../forecast/forecast.component';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements AfterViewInit {
  @ViewChild('cidade') cidade: ElementRef;
  currentFocus;
  currentCity;
  latLong;
  constructor(private http: HttpClient) { }

  async onSelection(val) {
    if (this.currentCity === val) {
      return false;
    }

    const stateId = (<HTMLInputElement>document.getElementById('estado')).value;
    const state = document.getElementById('estado-' + stateId).className;
    const query = val + '-' + state;
    this.currentCity = val;

    const keys = (<any> await this.httpGet('./assets/env.json'));
    if (keys) {
      const url = 'https://maps.google.com/maps/api/geocode/json?key=' + keys.mapsKey + '&address=' + query;
      const res = (<any>await this.httpGet(url));

      if (res.results.length > 0) {
        this.latLong = res.results[0].geometry.location;
        const latLong = this.latLong.lat.toFixed(2) + ',' + this.latLong.lng.toFixed(2);

        const url2 = 'http://api.weatherunlocked.com/api/current/' + latLong + '?app_id=' + keys.weatherID + '&app_key=' + keys.weatherKey;
        const url3 = 'http://api.weatherunlocked.com/api/forecast/' + latLong + '?app_id=' + keys.weatherID + '&app_key=' + keys.weatherKey;
        const forecast = new ForecastComponent();
        forecast.updateForecast(await this.httpGet(url3));
        forecast.updateCurrentWeather(await this.httpGet(url2));
      }
    }
  }

  async httpGet(url) {
    return await this.http.get(url)
      .toPromise()
      .then(response => response)
      .catch(err => console.log(err));
  }

  ngAfterViewInit() {
      this.cidade.nativeElement.addEventListener('input', e => {
          const input = e.target;
          let a, b, i, val = input.value;
          this.closeAllLists();
          if (!val) { return false; }
          if (typeof window['cidades'] === 'undefined') {
            alert('Selecione um estado antes.');
            input.value = '';
            return false;
          }
          this.currentFocus = -1;
          a = document.createElement('div');
          a.setAttribute('id', input.id + 'autocomplete-list');
          a.setAttribute('class', 'autocomplete-items');
          input.parentNode.appendChild(a);

          for (i = 0; i < window['cidades'].length; i++) {
              if (window['cidades'][i].Nome.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                  b = document.createElement('div');
                  b.innerHTML = '<strong>' + window['cidades'][i].Nome.substr(0, val.length) + '</strong>';
                  b.innerHTML += window['cidades'][i].Nome.substr(val.length);
                  b.innerHTML += '<input type="hidden" value="' + window['cidades'][i].Nome + '">';
                  b.addEventListener('click', ev => {
                    input.value = ev.target.getElementsByTagName('input')[0].value;
                    this.closeAllLists();
                    this.onSelection(input.value);
                  });
                  a.appendChild(b);
              }
          }
      });

      this.cidade.nativeElement.addEventListener('keydown', e => {
          const list = document.getElementById(e.target.id + 'autocomplete-list');
          let x;
          if (list) {
              x = list.getElementsByTagName('div');
          }
          if (e.keyCode === 40) { // down key code
              this.currentFocus++;
              this.addActive(x);
          } else if (e.keyCode === 38) { // up key code
              this.currentFocus--;
              this.addActive(x);
          } else if (e.keyCode === 13) { // enter key code
              e.preventDefault();
              if (this.currentFocus > -1) {
                 if (x) { x[this.currentFocus].click(); }
              }
          }
      });
      document.addEventListener('click', e => this.closeAllLists(e.target));
  }

  addActive(x) {
      if (!x) { return false; }
      this.removeActive(x);
      if (this.currentFocus >= x.length) { this.currentFocus = 0; }
      if (this.currentFocus < 0) { this.currentFocus = (x.length - 1); }
      if (typeof x[this.currentFocus] !== 'undefined') { x[this.currentFocus].classList.add('autocomplete-active'); }
  }

  removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }

  closeAllLists(elmnt = null) {
      const x = document.getElementsByClassName('autocomplete-items');
      for (let i = 0; i < x.length; i++) {
          if (elmnt !== x[i] && elmnt !== this.cidade.nativeElement) {
              x[i].parentNode.removeChild(x[i]);
          }
      }
  }
}
