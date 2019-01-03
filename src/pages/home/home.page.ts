import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { StorageService } from '../../service/storage.service';
import { ItemsPage } from '../item/items.page';
import { NavController, Events } from 'ionic-angular';
import { FilesPage } from '../item/files.page';
import { ArticlesPage } from '../item/articles.page';
import { ItemService } from '../../service/item.service';
import { ParameterPage } from '../parameter/parameter.page';
import { CustomService } from '../../service/custom.service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.page.html'
})
export class HomePage extends ItemsPage {

	refresher: any;

	lastFile: any;

	fileInfo: { "directory": string; "fileName": never; };
	constructor(public miscellaneousService: MiscellaneousService, public storageService: StorageService, public event: Events,
		public navController: NavController, public itemService: ItemService, public customService: CustomService) {
		super(miscellaneousService);
	}

	ionViewDidEnter() {
		this.load();
	}

	load(refresher: any = null) {
		this.itemService.getFiles(
			(data: any, error: any) => {
				this.items = data;
				if (this.items) {
					let lastId = this.itemService.getLastFileId();
					if (lastId) {
						for (var i = 0; i < this.items.length; i++) {
							if (lastId == this.items[i].id) {
								this.lastFile = this.items[i];
							}
						}
					}
				}
				if (refresher) {
					refresher.complete();
				}
			}
		)
	}

	// ngOnInit(refresher: any = null) {
	// 	this.load(refresher);
	// }

	goToPage(page: string) {
		switch (page) {
			case "files":
				this.navController.push(FilesPage)
				break;

			case "params":
				this.navController.push(ParameterPage)
				break;

			default:
				break;
		}
	}

	newFile(type: string) {
		let file = this.itemService.newFile();
		file.type = type;

		this.navController.push(FilesPage, { "newFileType": type });
	}

	newScan() {
		this.navController.push(ArticlesPage, { "file": this.lastFile, "files": this.items, "scan": true })
	}

	changeTheme() {
		this.event.publish('theme:toggle');
	}

}
