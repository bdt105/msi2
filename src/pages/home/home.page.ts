import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { StorageService } from '../../service/storage.service';
import { ItemsPage } from '../item/items.page';
import { NavController, Events } from 'ionic-angular';
import { FilesPage } from '../item/files.page';
import { ArticlesPage } from '../item/articles.page';
import { ItemService } from '../../service/item.service';
import { CustomService } from '../../service/custom.service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.page.html'
})
export class HomePage extends ItemsPage {

	refresher: any;

	lastFile: any;

	countFiles: any = [];

	fileInfo: { "directory": string; "fileName": never; };
	constructor(public miscellaneousService: MiscellaneousService, public storageService: StorageService, public event: Events,
		public navController: NavController, public itemService: ItemService, public customService: CustomService) {
		super(miscellaneousService);
	}

	ionViewDidEnter() {
		this.load();
		this.getFileCount();
	}

	load(refresher: any = null) {
		let lastFile = this.itemService.getLastFile();
		if (lastFile) {
			this.itemService.getFiles(
				(data: any, error: any) => {
					this.items = data;
					if (this.items) {
						let lastId = this.itemService.getLastFile().id;
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
				}, lastFile.type
			)
		}
	}

	getFileCount() {
		this.itemService.countFiles(
			(data: any, error: any) => {
				if (!error) {
					this.countFiles = data;
				}
			}
		)
	}

	countNotSent(){
		let ret = false;
		if (this.countFiles){
			let count = 0;
			if (this.countFiles.length > 0){
				this.countFiles.forEach((element: any) => {
					count += element.data && element.data.notSent ? element.data.notSent.length : 0
				});
			}
			ret = count > 0;
		}
		return ret;
	}

	goToFiles(type: string) {
		let fileFormat = this.customService.getFileFormat(type);
		this.navController.push(FilesPage, { "fileFormat": fileFormat })
	}

	// newFile(type: string) {
	// 	let file = this.itemService.newFile("label");
	// 	file.type = type;

	// 	this.navController.push(FilesPage, { "newFileType": type });
	// }

	newScan() {
		this.navController.push(ArticlesPage, { "file": this.lastFile, "files": this.items, "scan": true })
	}

	changeTheme() {
		this.event.publish('theme:toggle');
	}

}
