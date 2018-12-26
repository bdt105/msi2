import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { ItemsPage } from './items.page';
import { ItemService } from '../../service/item.service';
import { CustomService } from '../../service/custom.service';
import { NavParams } from 'ionic-angular';

@Component({
	selector: 'page-files',
	templateUrl: 'files.page.html'
})
export class FilesPage extends ItemsPage {

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService, public customService: CustomService,
		public navParams: NavParams, public itemService: ItemService) {
		super(miscellaneousService, fileService, customService);
		this.key = this.itemService.filesKey;
	}

	ngOnInit() {
		this.load((data: any, error: any) => {
			
			let newFileType = this.navParams.get('newFileType');
			if (newFileType) {
				this.neww(newFileType);
			}

		})
	}

	neww(type: string = null) {
		let file = this.itemService.newFile();
		file.type = type;
		let format = this.fileService.getFormat(type);
		if (format) {
			file.name = this.translate(format.label);
		}
		this.items.splice(0, 0, file);
	}

}
