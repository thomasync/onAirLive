import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
  @Output() onClose = new EventEmitter();

  isIOS = /iPad|iPhone|iPod/.test(navigator.platform || "");
  isAndroid = /android/i.test(navigator.platform || "");

  constructor() { }

  ngOnInit(): void {
  }

}
