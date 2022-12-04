import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	themes = ['#d52e28', '#000000'];
  isApplication = false;
  isFirstOpen = false;

  isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.platform || '');
	isAndroid: boolean = /android/i.test(navigator.platform || '');

	constructor(private _route: ActivatedRoute) {
    this._route.queryParams.subscribe((params) => {
			this.isApplication = (params.app !== undefined && params.app === 'true');
		});
    this.isFirstOpen = this.firstOpen();
  }

  firstOpen(): boolean {
		return window.localStorage.getItem('place') === null;
	}

	get themeColor(): string {
		const themeIndex = localStorage.getItem('themeColor');
		if (themeIndex) {
			return this.themes[+themeIndex];
		}
		return this.themes[0];
	}

	setTheme(themeIndex: number): void {
		localStorage.setItem('themeColor', themeIndex.toString());
	}
}
