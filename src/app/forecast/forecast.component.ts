import {Component, ViewChild, AfterViewInit} from '@angular/core';
import { ChartComponent } from 'angular2-chartjs';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements AfterViewInit {
  @ViewChild('weaklyChart') weaklyChart: ChartComponent;
  minWeaklyTemp = 100;
  maxWeaklyTemp = -100;
  type = 'line';
  data = {
      labels: [],
      datasets: [
          {
              label: 'Temperatura Mínima ºC',
              data: [],
              borderColor: 'rgba(0, 188, 212, 0.75)',
              backgroundColor: 'rgba(0, 188, 212, 0)',
              pointBorderColor: 'rgba(0, 188, 212, 0)',
              pointBackgroundColor: 'rgba(0, 188, 212, 0.9)',
              pointBorderWidth: 1
          },
          {
              label: 'Temperatura Máxima ºC',
              data: [],
              borderColor: 'rgba(255, 99, 132, 0.75)',
              backgroundColor: 'rgba(255, 99, 132, 0)',
              pointBorderColor: 'rgba(255, 99, 132, 0)',
              pointBackgroundColor: 'rgba(255, 99, 132, 0.9)',
              pointBorderWidth: 1
          }
      ]
  };
  options = {
    responsive: true
  };

  constructor() {
  }

  ngAfterViewInit() {
    window.addEventListener('updateChart', e => {
        this.weaklyChart.chart.data = (<any>e).detail;
        this.weaklyChart.chart.update();
    });
  }

  public updateCurrentWeather(cityCurrentWeather) {
    const iconUrl = 'http://www.weatherunlocked.com/Images/icons/1/' + cityCurrentWeather.wx_icon;
    const statusNow = this.translateWeather(cityCurrentWeather.wx_icon);
    this.createRecomendation(statusNow);

    document.getElementById('forecast-day-0').innerText = 'Clima agora em ' + (<HTMLInputElement>document.getElementById('cidade')).value;
    (<HTMLImageElement>document.getElementById('forecast-img-0')).src = iconUrl;
    document.getElementById('forecast-status-0').innerText = statusNow;
    document.getElementById('forecast-temp-0').innerText = cityCurrentWeather.temp_c + 'ºC';

    document.getElementById('weather-data').classList.remove('hidden');
    document.getElementById('loader').classList.add('hidden');

  }

  public updateForecast(cityForecast) {
    cityForecast.Days.map((d, i) => {
      if (i === 0) {
        return true;
      }
      this.treatWeaklyMinMaxTemp(d.date, d.temp_min_c, d.temp_max_c);
      const iconUrl = 'http://www.weatherunlocked.com/Images/icons/1/' + d.Timeframes[0].wx_icon;
      document.getElementById('forecast-day-' + i).innerText = d.date;
      (<HTMLImageElement>document.getElementById('forecast-img-' + i)).src = iconUrl;
      document.getElementById('forecast-status-' + i).innerText = this.translateWeather(d.Timeframes[0].wx_icon);
      document.getElementById('forecast-min-' + i).innerText = 'Mín: ' + d.temp_min_c + '°C';
      document.getElementById('forecast-max-' + i).innerText = 'Máx: ' + d.temp_max_c + '°C';
    });
    document.getElementById('forecast-min').innerText = 'Mín: ' + this.minWeaklyTemp + '°C';
    document.getElementById('forecast-max').innerText = 'Máx: ' + this.maxWeaklyTemp + '°C';

    window.dispatchEvent(new CustomEvent('updateChart', {detail: this.data}));
  }

  private treatWeaklyMinMaxTemp(date, min, max) {
      this.data.labels.push(date);
      this.data.datasets[0].data.push(min);
      this.data.datasets[1].data.push(max);
      if (min < this.minWeaklyTemp) {
          this.minWeaklyTemp = min;
      }
      if (max > this.maxWeaklyTemp) {
          this.maxWeaklyTemp = max;
      }
  }

  private createRecomendation(val) {
    val = val.toLowerCase();
    switch (true) {
        case val.indexOf('nevasca') !== -1:
          document.getElementById('forecast-weather-now').innerText = 'O que fazer durante uma nevasca';
          document.getElementById('activity-desc').innerText = 'Atividades dentro de casa, visto que nevascas podem ser perigosas.';
          break;
        case val.indexOf('claro') !== -1:
          document.getElementById('forecast-weather-now').innerText = 'O que fazer durante um tempo claro';
          document.getElementById('activity-desc').innerText = 'Caminhadas, exercícios, banhos de praia/piscina, passeios com animal de estimação, encontrar amigos ao ar livre, tudo é bem confortável a céu claro.';
          break;
        case val.indexOf('trovoada') !== -1:
          document.getElementById('forecast-weather-now').innerText = 'O que fazer durante uma trovoada';
          document.getElementById('activity-desc').innerText = 'Atividades dentro de casa, visto que trovoadas sempre acompanham chuvas e não é saudável ficar muito tempo na chuva, cuidado com os aparelhos na tomada também!';
          break;
        case val.indexOf('nublado') !== -1:
          document.getElementById('forecast-weather-now').innerText = 'O que fazer durante um tempo nublado';
          document.getElementById('activity-desc').innerText = 'Tempo nublado também permite atividades externas (Caminhadas, exercícios, passeios, encontros) e podem ter a vantagem de não estar com temperatura alta.';
          break;
        case val.indexOf('nevoeiro') !== -1:
        case val.indexOf('névoa') !== -1:
          document.getElementById('forecast-weather-now').innerText = 'O que fazer durante um nevoeiro';
          document.getElementById('activity-desc').innerText = 'Nevoeiros não são o tempo mais perigoso, a não ser se esse encobre a visão quando estiver dirigindo, prossiga devagar, como a névoa bloqueia grande parte da visão, prefira atividades internas.';
          break;
        case val.indexOf('chuva') !== -1:
          document.getElementById('forecast-weather-now').innerText = 'O que fazer durante um tempo chuvoso';
          document.getElementById('activity-desc').innerText = 'Atividades internas, não é saudável ficar muito tempo na chuva.';
          break;
        case val.indexOf('neve') !== -1:
          document.getElementById('forecast-weather-now').innerText = 'O que fazer durante um tempo de neve';
          document.getElementById('activity-desc').innerText = 'Neve sempre possibilita brincadeiras divertidas como desenhos na neve e montar bonecos de neve, lembre-se de manter agasalhado pois neve geralmente acompanha clima frio!';
          break;
        case val.indexOf('ensolarado') !== -1:
          document.getElementById('forecast-weather-now').innerText = 'O que fazer durante um tempo ensolarado';
          document.getElementById('activity-desc').innerText = 'Caminhadas, exercícios, banhos de praia/piscina, passeios com animal de estimação, encontrar amigos ao ar livre, é um ótimo tempo mas geralmente acompanha calor, use filtro solar se precisa ficar exposto ao sol por muito tempo.';
          break;
    }
  }

  private translateWeather(val) {
      switch (val) {
          case 'Blizzard.gif':
            return 'Nevasca';
          case 'Clear.gif':
            return 'Céu claro';
          case 'CloudRainThunder.gif':
            return 'Trovoada';
          case 'CloudSleetSnowThunder.gif':
            return 'Trovoada com nevasca';
          case 'Cloudy.gif':
            return 'Nublado';
          case 'Fog.gif':
            return 'Nevoeiro';
          case 'FreezingDrizzle.gif':
            return 'Chuva Gelada';
          case 'FreezingFog.gif':
            return 'Nevoeiro Congelante';
          case 'FreezingRain.gif':
            return 'Chuva congelante';
          case 'HeavyRain.gif':
            return 'Chuva pesada';
          case 'HeavyRainSwrsDay.gif':
            return 'Pancadas de chuva forte ao dia';
          case 'HeavyRainSwrsNight.gif':
            return 'Pancadas de chuva forte a noite';
          case 'HeavySleet.gif':
            return 'Chuva com neve';
          case 'HeavySleetSwrsDay.gif':
            return 'Pancadas de chuva forte com neve ao dia';
          case 'HeavySleetSwrsNight.gif':
            return 'Pancadas de chuva forte com neve a noite';
          case 'HeavySnow.gif':
            return 'Nevasca forte';
          case 'HeavySnowSwrsDay.gif':
            return 'Pancadas de nevasca forte ao dia';
          case 'HeavySnowSwrsNight.gif':
            return 'Pancadas de nevasca forte a noite';
          case 'IsoRainSwrsDay.gif':
              return 'Pancadas de chuva ao dia';
          case 'IsoRainSwrsNight.gif':
              return 'Pancadas de chuva a noite';
          case 'IsoSleetSwrsDay.gif':
              return 'Pancadas de chuva com neve ao dia';
          case 'IsoSleetSwrsNight.gif':
              return 'Pancadas de chuva com neve a noite';
          case 'IsoSnowSwrsDay.gif':
              return 'Pancadas de neve ao dia';
          case 'IsoSnowSwrsNight.gif':
              return 'Pancadas de neve a noite';
          case 'Mist.gif':
            return 'Névoa';
          case 'ModRain.gif':
            return 'Chuva moderada';
          case 'ModRainSwrsDay.gif':
            return 'Pancadas de chuva moderada';
          case 'ModSleet.gif':
            return 'Chuva com neve moderada';
          case 'ModSleetSwrsDay.gif':
              return 'Pancadas de chuva moderada com neve ao dia';
          case 'ModSleetSwrsNight.gif':
              return 'Pancadas de chuva moderada com neve a noite';
          case 'ModSnow.gif':
            return 'Nevasca moderada';
          case 'ModSnowSwrsDay.gif':
              return 'Pancadas de nevasca moderada ao dia';
          case 'ModSnowSwrsNight.gif':
              return 'Pancadas de nevasca moderada a noite';
          case 'OccLightRain.gif':
            return 'Chuva fraca';
          case 'OccLightSleet.gif':
            return 'Chuva com neve fraca';
          case 'OccLightSnow.gif':
            return 'Nevasca fraca';
          case 'Overcast.gif':
            return 'Nublado';
          case 'PartCloudRainThunderDay.gif':
            return 'Trovoada parcial ao dia';
          case 'PartCloudRainThunderNight.gif':
            return 'Trovoada parcial a noite';
          case 'PartCloudSleetSnowThunderDay.gif':
            return 'Trovoada com neve parcial ao dia';
          case 'PartCloudSleetSnowThunderNight.gif':
            return 'Trovoada com neve parcial a noite';
          case 'PartlyCloudyDay.gif':
            return 'Parcialmente nublado ao dia';
          case 'PartlyCloudyNight.gif':
              return 'Parcialmente nublado a noite';
          case 'Sunny.gif':
            return 'Ensolarado';
          default:
            return 'Valor não reconhecido';
      }
  }

}
