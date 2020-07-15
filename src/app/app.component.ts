import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ICounter} from "./counter";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  urlApi = 'https://api.resamania.com/onair/public/attendances/qDf9-6Gnm-8Hoa-18xs';
  directCounter = 0;
  lastReload = 9;
  lastReloadTimestamp = 0;
  horaires: ICounter[] = [];
  closed;
  isDemi;

  shareOpened = true;

  constructor(
    private _http: HttpClient,
    private _route: ActivatedRoute
  ) {
    this._route.queryParams.subscribe(params => {
      this.shareOpened = !(params.app !== undefined && params.app === 'true');
    });

    this.getInformations(() => {
      setInterval(() => {
        this.actualiseLastReload();
      }, 1000);
    });
  }

  generateLastHoraires(callback?) {
    const date = new Date();
    let hour = date.getHours();
    let demi = (date.getMinutes() >= 30);
    this.isDemi = demi;
    this.horaires = [];
    for (let i = 0; i < 5; i++){
      this.horaires.push({
        label: ((hour < 10) ? '0' : '') + hour + 'H' + ((demi) ? '30' : '00'),
        nombre: 0
      });
      if (demi) {
        demi = false;
      } else {
        hour -= 1;
        demi = true;
      }
    }
    if (callback) {
      callback();
    }
  }

  getInformations(callback?) {
    this.generateLastHoraires(() => {
      this._http.get(this.urlApi, {responseType: 'text'}).subscribe((html) => {
        this.directCounter = +html.match(/<div class="attendance">(\d+)\s/si)[1];

        const matchDatasets = html.match(/.*datasets: \[(.*?)options:/si)[1];
        const matchDatas = matchDatasets.match(/data: (\[.*?\])/gs);

        const hours = JSON.parse(matchDatas[1].replace('data: ', '')).reverse();
        const hoursDemi = JSON.parse(matchDatas[0].replace('data: ', '')).reverse();

        let index = 0;
        hoursDemi.forEach((e) => {
          hours.splice(index, 0, e);
          index += 2;
        });

        index = (!this.isDemi) ? 1 : 0;
        this.horaires.forEach((e) => {
          e.nombre = hours[index];
          index += 1;
        });

      }, () => {
        alert('Une erreur est survenue');
      });

      this.lastReloadTimestamp = Date.now();
      this.actualiseLastReload();
      if (callback) {
        callback();
      }
    });
  }

  actualiseLastReload() {
    const date = new Date();
    this.lastReload = 9 - Math.floor((Date.now() - this.lastReloadTimestamp) / 1000);
    this.closed = (date.getHours() < 7 || date.getHours() >= 22);
    if (this.lastReload < 0) {
      this.getInformations();
    }
  }

}
