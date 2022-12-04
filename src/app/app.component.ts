import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from './services/config.service';
import { DataService } from './services/data.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	shareOpened: boolean = true;
	isClosed: boolean = false;

	constructor(
		public data: DataService,
		public config: ConfigService,
		private _route: ActivatedRoute
	) {
		this._route.queryParams.subscribe((params) => {
			this.shareOpened = !(params.app !== undefined && params.app === 'true') || this.data.firstOpen;
		});
	}

	async ngOnInit(): Promise<void> {
		await this.data.getInformations();
		setInterval(() => this.actualiseLastReload(), 1000);
	}

	actualiseLastReload(): void {
		const date = new Date();
		this.data.lastReload = 9 - Math.floor((Date.now() - this.data.lastReloadTimestamp) / 1000);
		this.isClosed = date.getHours() < 7 || date.getHours() >= 22;
		if (this.data.lastReload < 0) {
			this.data.getInformations();
		}
	}

	async shareClosed(): Promise<void> {
		await this.data.getInformations();
		this.shareOpened = false;
	}
}
