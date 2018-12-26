import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home.page';
import { ParameterPage } from '../pages/parameter/parameter.page';
import { GenericComponent } from '../angularShared/components/generic.component';
import { MiscellaneousService } from '../angularShared/services/miscellaneous.service';
import { FilesPage } from '../pages/item/files.page';
import { CustomService } from '../service/custom.service';

@Component({
	templateUrl: 'app.html'
})
export class MyApp  extends GenericComponent{
	@ViewChild(Nav) nav: Nav;

	rootPage: any = HomePage;

	pages: Array<{ title: string, component: any, icon: string }>;

	constructor(public miscellaneousService: MiscellaneousService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
		public customService: CustomService) {
		super(miscellaneousService);
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: HomePage, icon: "home" },
			{ title: 'Files', component: FilesPage, icon: "folder" },
			{ title: 'Parameters', component: ParameterPage, icon: "cog" }
		];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}
}
