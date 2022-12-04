import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICounter } from '../interfaces/counter';
import { IPlace } from '../interfaces/place';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	directCounter: number = 0;
	limitCounter: number = 0;
	lastReload = 9;
	lastReloadTimestamp = 0;
	isDemi: boolean = false;

	horaires: ICounter[] = [];

	places: IPlace[] = [
		{
			nom: 'ON AIR Béziers',
			label: 'ON AIR Béziers',
			url: 'https://api.resamania.com/onair/public/attendances/qDf9-6Gnm-8Hoa-18xs',
		},
		{
			nom: 'ON AIR Montpellier',
			label: 'ON AIR Montpellier',
			url: 'https://api.resamania.com/onair/public/attendances/1CnA-rNng-lrBW-hJkd',
		},
		{
			nom: 'ON AIR Saint Jean de Védas',
			label: 'St Jean de Védas',
			url: 'https://api.resamania.com/onair/public/attendances/MrxE-sRxX-9WmA-6X46',
		},
	];

	inFetching = false;

	constructor(private _http: HttpClient) {}

	async generateLastHoraires(): Promise<void> {
		return new Promise((resolve) => {
			const date = new Date();
			let hour = date.getHours();
			this.isDemi = date.getMinutes() >= 30;
			this.horaires = [];

			for (let i = 0; i < 5; i++) {
				this.horaires.push({
					label: (hour < 10 ? '0' : '') + hour + 'H' + (this.isDemi ? '30' : '00'),
					nombre: 0,
				});
				if (this.isDemi) {
					this.isDemi = false;
				} else {
					hour -= 1;
					this.isDemi = true;
				}
			}
			resolve();
		});
	}

	async getInformations(): Promise<void> {
		this.lastReloadTimestamp = Date.now();
		return new Promise(async (resolve) => {
			if (this.inFetching) {
				resolve();
				return;
			}
			this.inFetching = true;
			await this.generateLastHoraires();
			this._http
				.get(this.placeSelected.url, { responseType: 'text' })
				.subscribe((html) => {
					this.directCounter = +html.match(
						/<div class="attendance">.*?<span class="value">(\d+)<\/span>/is
					)[1];
					try {
						this.limitCounter = +html.match(/let limit = (\d+)(;|)\s/is)[1];
					} catch (e) {
						this.limitCounter = 99;
					}

					const matchDatasets = html.match(/.*datasets: \[(.*?)options:/is)[1];
					const matchDatas = matchDatasets.match(/data: (\[.*?\])/gs);

					const hours = JSON.parse(matchDatas[1].replace('data: ', '')).reverse();
					const hoursDemi = JSON.parse(
						matchDatas[0].replace('data: ', '')
					).reverse();

					let index = 0;
					hoursDemi.forEach((horaire: string) => {
						hours.splice(index, 0, horaire);
						index += 2;
					});

					index = !this.isDemi ? 1 : 0;
					this.horaires.forEach((horaire: ICounter) => {
						horaire.nombre = hours[index];
						index += 1;
					});
				});
			this.inFetching = false;
			resolve();
		});
	}

	get firstOpen(): boolean {
		return window.localStorage.getItem('place') === null;
	}

	get placeSelected(): IPlace {
		const placeIndex = window.localStorage.getItem('place');
		if (placeIndex) {
			return this.places[+placeIndex];
		}
		return this.places[0];
	}

	setPlaceSelected(placeIndex: number) {
		window.localStorage.setItem('place', placeIndex.toString());
	}
}
