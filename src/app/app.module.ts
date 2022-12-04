import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ShareComponent } from './ui/share/share.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [AppComponent, ShareComponent],
	imports: [BrowserModule, HttpClientModule, RouterModule.forRoot([])],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
