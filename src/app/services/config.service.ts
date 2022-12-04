import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	themes = ['#d52e28', '#000000'];

	constructor() {}

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
