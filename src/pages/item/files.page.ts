import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { ItemService } from '../../service/item.service';
import { CustomService } from '../../service/custom.service';
import { NavParams } from 'ionic-angular';
import { ItemsPage } from './items.page';

@Component({
	selector: 'page-files',
	templateUrl: 'files.page.html'
})
export class FilesPage extends ItemsPage {

	constructor(public miscellaneousService: MiscellaneousService, public customService: CustomService,
		public navParams: NavParams, public itemService: ItemService) {
		super(miscellaneousService);
	}

	ngOnInit(refresher: any = null) {
		this.itemService.getFiles(
			(data: any, error: any) => {
				if (!error) {
					this.items = data;
					if (!this.items){
						this.items = [];
					}
					let newFileType = this.navParams.get('newFileType');
					if (newFileType) {
						this.newFile(newFileType);
						this.save();
					}
				} else {
					this.customService.callbackToast(error, this.translate('Impossible to get files'));
				}
				if (refresher) {
					refresher.complete();
				}
			})
	}

	newFile(type: string)  {
		let file = this.itemService.newFile();
		file.type = type;
		let format = this.itemService.getFormat(type);
		if (format) {
			file.name = this.translate(format.label);
		}
		this.items.splice(0, 0, file);
	}

	save() {
		this.itemService.saveFiles(
			(data: any, error: any) => {
				if (error) {
					this.customService.callbackToast(null, this.translate('Could not save files'));
				}
			}, this.items
		)
	}

	delete(file: any) {
		this.itemService.deleteFile(
			(data: any, error: any) => {
			}, file, this.items
		)
	}
}
