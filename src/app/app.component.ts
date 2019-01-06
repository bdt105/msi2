import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
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
export class MyApp extends GenericComponent {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = HomePage;

	pages: any;

	theme: String = 'blue-theme';//keep default theme as blue

	constructor(public miscellaneousService: MiscellaneousService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
		public customService: CustomService, public event: Events) {
		super(miscellaneousService);
		this.initializeApp();


		// used for an example of ngFor and navigation
		platform.ready().then(() => {
			this.createMenus();
			event.subscribe('theme:toggle', () => {
				this.toggleTheme();
			});

		});

	}

	private createMenus() {
		this.pages = [
			{ title: 'Home', component: HomePage, iconName: "home" }
		];

		let fileFormatMenus = this.customService.getFileFormatMenus();
		fileFormatMenus.forEach((fileFormatMenu: any) => {
			let page: any = {
				title: fileFormatMenu.title,
				iconName: fileFormatMenu.iconName
			}
			if (fileFormatMenu.subMenus) {
				fileFormatMenu.subMenus.forEach((subMenu: any) => {
					if (!page.subMenus) {
						page.subMenus = [];
					}
					let fileFormat = this.customService.getFileFormat(subMenu.format);
					let subPage: any = {
						title: subMenu.title, component: FilesPage, parameter: { fileFormat: fileFormat }
					}
					page.subMenus.push(subPage);
				});
			}
			this.pages.push(page);
		});

		this.pages.push({ title: 'Parameters', component: ParameterPage, iconName: "cog" });


	}

	toggleTheme() {
		if (this.theme === 'blue-theme') {
			this.theme = 'red-theme';
		} else {
			this.theme = 'blue-theme';
		}
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	openPage(page: any, parameter: any) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component, parameter);
	}

}
