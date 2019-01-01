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

	public fileTypeFilter = null;
	public fileTypeFilterPrevious = null;

	private filter(data: any) {
		let ret = data;
		
		if (this.fileTypeFilter) {
			ret = this.toolbox.filterArrayOfObjects(data, "type", this.fileTypeFilter, false, true, true, false);
			if (ret && ret.length == 0) {
				this.customService.callbackToast(null, this.translate("No file found of this type..."));
				this.fileTypeFilter = this.fileTypeFilterPrevious;
				ret = this.filter(data);
			}
		}

		return ret;
	}

	private getFiles(refresher: any, newFileType: string){
		this.itemService.getFiles(
			(data: any, error: any) => {
				if (!error) {

					this.items = this.filter(data);

					if (!this.items) {
						this.items = [];
					}
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

	ngOnInit(refresher: any = null) {
		this.getFiles(refresher, this.navParams.get('newFileType'));
	}

	newFile(type: string) {
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


	showFilter() {
		let callbackOk = (data: any) => {
			if (data) {
				this.fileTypeFilterPrevious = this.fileTypeFilter;
				this.fileTypeFilter = data.value;
				this.getFiles(null, null);
			}
		};
		let callbackCancel = (data: any) => {
			console.log("Filter canceled");
		};

		let values = [];
		values.push({
			"type": "radio",
			"value": null,
			"label": this.translate("No filter"),
			"checked": false
		})
		for (var i = 0; i < this.itemService.fileFormats.length; i++) {
			values.push(
				{
					"type": "radio",
					"value": this.itemService.fileFormats[i].name,
					"label": this.translate(this.itemService.fileFormats[i].label),
					"checked": this.itemService.fileFormats[i].name == this.fileTypeFilter
				}
			)
		}

		this.customService.showAlertForm(
			this.translate('Choose a type of file'),
			[
				{ "label": this.translate('Filter'), "callback": callbackOk }, { "label": this.translate('Cancel'), "callback": callbackCancel }
			],
			values
		);
	}

	deleteFilter(){
		this.fileTypeFilter = null;
		this.getFiles(null, null);
	}

}
