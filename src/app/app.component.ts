import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from './services/config.service';
import { DataService } from './services/data.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
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
		this.data.getInformations();
	}

  ngAfterViewInit(): void {
    setInterval(() => this.actualiseLastReload(), 1000);
  }

	actualiseLastReload(): void {
		const date = new Date();
    const deltaLastReload = 9 - Math.floor((Date.now() - this.data.lastReloadTimestamp) / 1000);
		this.data.lastReload = deltaLastReload < 1 ? 1 : deltaLastReload;
		this.isClosed = date.getHours() < 7 || date.getHours() >= 22;
		if (this.data.lastReload <= 1) {
			this.data.getInformations();
		}
	}

	async shareClosed(): Promise<void> {
		await this.data.getInformations();
		this.shareOpened = false;
	}
}
