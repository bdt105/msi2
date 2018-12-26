import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { ItemsPage } from '../item/items.page';
import { CustomService } from '../../service/custom.service';
import { NavController } from 'ionic-angular';
import { FilesPage } from '../item/files.page';
import { ArticlesPage } from '../item/articles.page';
import { ItemService } from '../../service/item.service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.page.html'
})
export class HomePage extends ItemsPage {

	articles = [];
	pdv: string;

	lastFile: any;

	fileInfo: { "directory": string; "fileName": never; };
	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService, customService: CustomService,
		public navController: NavController, public itemService: ItemService) {
		super(miscellaneousService, fileService, customService);
		this.key = this.itemService.filesKey;
	}

	ngOnInit() {
		this.lastFile = this.customService.getLastFile();
		this.load((data: any, error: any) => {

		});
	}

	goToPage(page: string) {
		let lastFile = this.customService.getLastFile();
		switch (page) {
			case "lastFile":
				this.navController.setRoot(ArticlesPage, { "file": lastFile })
				break;

			case "files":
				this.navController.setRoot(FilesPage)
				break;

			default:
				break;
		}
	}

	newFile(type: string) {
		let file = this.itemService.newFile();
		file.type = type;

		this.navController.setRoot(FilesPage, {"newFileType": type});
	}

	newScan(){
		let lastFile = this.customService.getLastFile();
		this.navController.setRoot(ArticlesPage, { "file": lastFile, "scan": true})
	}


}
