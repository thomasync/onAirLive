import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ConfigService } from './services/config.service';
import { DataService } from './services/data.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
	shareOpened: boolean = false;
	isClosed: boolean = false;

	constructor(
		public data: DataService,
		public config: ConfigService,
	) {}

	async ngOnInit(): Promise<void> {
		await this.data.getInformations();
    this.actualiseLastReload()
	}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.shareOpened = !this.config.isApplication || this.config.isFirstOpen;
    }, 100);
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
