import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AutocompleteComponent} from './autocomplete/autocomplete.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {
    estados;
    cidades;

    constructor(private http: HttpClient) {
        this.loadData();
    }

    public setFavorite() {
        const stateId = (<HTMLInputElement>document.getElementById('estado')).value;
        const city = (<HTMLInputElement>document.getElementById('cidade')).value;
        const state = document.getElementById('estado-' + stateId).className;
        alert(city + '-' + state + ' favoritado com sucesso!');
        window.localStorage.setItem('favoriteCity', city + '-' + state);
    }

    private async loadData() {
        this.estados = await this.getAll('./assets/estados.json');
        this.cidades = await this.getAll('./assets/cidades.json');

        let favCity = window.localStorage.getItem('favoriteCity');
        if (!favCity) {
            favCity = 'Blumenau-SC';
            window.localStorage.setItem('favoriteCity', favCity);
        }

        const favCityValues = favCity.split('-');
        const cidadeInput = (<HTMLInputElement>document.getElementById('cidade'));
        const estadoInput = (<HTMLInputElement>document.getElementById('estado'));

        let ec;
        if (typeof(Event) === 'function') {
            ec = new Event('change');
        } else {
            ec = document.createEvent('Event');
            ec.initEvent('change', true, true);
        }

        estadoInput.value = (<HTMLInputElement>document.getElementsByClassName(favCityValues[1])[0]).value;
        cidadeInput.value = favCityValues[0];
        estadoInput.dispatchEvent(ec);
        const ac = new AutocompleteComponent(this.http);
        ac.onSelection(cidadeInput.value);
    }

    public async getAll(jsonPath) {
        return this.http.get(jsonPath)
            .toPromise()
            .then(response => response)
            .catch(err => console.log(err));
    }

    onChange(val) {
        window['cidades'] = this.cidades.filter(c => c.Estado == val);
    }
}
