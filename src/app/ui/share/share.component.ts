import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IPlace } from 'src/app/interfaces/place';
import { ConfigService } from 'src/app/services/config.service';
import { DataService } from 'src/app/services/data.service';

@Component({
	selector: 'app-share',
	templateUrl: './share.component.html',
	styleUrls: ['./share.component.scss'],
})
export class ShareComponent {
	@Output() onClose = new EventEmitter();

	isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.platform || '');
	isAndroid: boolean = /android/i.test(navigator.platform || '');

	constructor(public data: DataService, public config: ConfigService) {}

	close(): void {
		this.onClose.emit();
	}

	placeChanged(placeIndex: number) {
		this.data.setPlaceSelected(placeIndex);
	}
}
