import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { ItemService } from '../../service/item.service';
import { CustomService } from '../../service/custom.service';
import { NavParams, AlertController, NavController } from 'ionic-angular';
import { ItemsPage } from './items.page';
import { ArticlesPage } from './articles.page';

@Component({
	selector: 'page-files',
	templateUrl: 'files.page.html'
})
export class FilesPage extends ItemsPage {

	constructor(public miscellaneousService: MiscellaneousService, public customService: CustomService, private navCtrl: NavController,
		public navParams: NavParams, public itemService: ItemService, public alertCtrl: AlertController) {
		super(miscellaneousService);
	}

	public fileFormat = null;

	public fileSplited: any;

	ionViewDidEnter() {
		this.ngOnInit();
	}

	/*
		private filter(data: any, fileFormatName: string) {
			let ret = data;
	
			if (fileFormatName) {
				ret = this.toolbox.filterArrayOfObjects(data, "type", fileFormatName, false, true, true, false);
				if (ret && ret.length == 0) {
					this.customService.callbackToast(null, this.translate("No file found of this type..."));
				}
			}
	
			return ret;
		}
	*/

	private getFiles(refresher: any, type: string, createNew: boolean) {
		this.itemService.getFiles(
			(data: any, error: any) => {
				if (!error) {
					this.items = data;
					this.fileSplited = this.itemService.splitSentFiles(this.items);
					if (!this.items) {
						this.items = [];
					}
					if (!this.fileSplited.notSent) {
						this.fileSplited.notSent = [];
					}
					if (!this.fileSplited.sent) {
						this.fileSplited.sent = [];
					}
					if (createNew) {
						this.newFile(type);
						this.save(false, null);
					}
				} else {
					this.customService.callbackToast(error, this.translate('Impossible to get files'));
				}
				if (refresher) {
					refresher.complete();
				}
			}, type);
	}

	ngOnInit(refresher: any = null) {
		this.fileFormat = this.navParams.get('fileFormat')
		this.load(refresher, this.navParams.get('createNew'));
	}

	load(refresher: any = null, createNew: boolean = false) {
		this.getFiles(refresher, this.fileFormat.name, createNew);
	}

	newFile(type: string) {
		let file = this.itemService.newFile(type);
		let format = this.customService.getFileFormat(type);
		if (format) {
			file.name = this.translate(format.label);
		}
		if (this.fileSplited.notSent) {
			this.fileSplited.notSent.splice(0, 0, file);
		}
	}

	save(reload: boolean, file: any) {
		this.items = this.fileSplited.notSent.concat(this.fileSplited.sent);
		this.itemService.saveFiles(
			(data: any, error: any) => {
				if (error) {
					this.customService.callbackToast(null, this.translate('Could not save files'));
				} else {
					if (reload) {
						this.load();
					} else {
						if (file && (!file.articles || (file.articles && file.articles.length == 0))) {
							this.navCtrl.push(ArticlesPage, { "file": file, "files": this.items });
						}
					}
				}
			}, this.items, this.fileFormat.name
		)
	}

	delete(file: any) {
		this.itemService.deleteFile(
			(data: any, error: any) => {
				this.load();
			}, this.items, this.fileFormat.name, "id", file.id, true
		)
	}

	private deleteAll() {
		this.itemService.deleteAllFile(
			(data: any, error: any) => {
				if (!error) {
					this.load();
					this.customService.callbackToast(null,
						this.translate('All files') + ' ' + this.translate(this.fileFormat.label) + ' ' + this.translate('deleted'))
				} else {
					this.customService.callbackToast(null, this.translate('Unable to delete all files'))
				}
			}, this.fileFormat.name
		)
	}

	confirmDeleteAll() {
		if (this.items && this.items.length > 0) {
			let alert = this.alertCtrl.create({
				title: this.translate('Confirm delete'),
				message: this.translate('Do you want to delete ALL files ') + this.translate(this.fileFormat.label) + '?',
				buttons: [
					{
						text: this.translate('No'),
						role: 'cancel',
						handler: () => {
							console.log('Cancel clicked');
						}
					},
					{
						text: this.translate('Yes'),
						handler: () => {
							this.deleteAll();
						}
					}
				]
			});
			alert.present();
		}
	}

	confirmDelete() {
		let callbackOk = (data: any) => {
			if (data) {
				if (data.value == 2) {
					this.itemService.deleteAllFile(
						(data: any, error: any) => {
							if (!error) {
								this.customService.callbackToast(null, this.translate('All files deleted'));
								this.load()
							}
						}, this.fileFormat.name
					)
				}
				if (data.value == 1) {
					this.itemService.deleteFile(
						(data: any, error: any) => {
							if (!error) {
								this.customService.callbackToast(null, this.translate('Files sent deleted'));
								this.load()
							}
						}, this.items, this.fileFormat.name, "shareDate", null, false
					)
				}
				if (data.value == 0) {
					this.itemService.deleteFile(
						(data: any, error: any) => {
							if (!error) {
								this.customService.callbackToast(null, this.translate('Files not sent deleted'));
								this.load()
							}
						}, this.items, this.fileFormat.name, "shareDate", null, true
					)
				}
			}
		};
		let callbackCancel = (data: any) => {
			this.customService.callbackToast(null, this.translate('Deletion canceled'));
			this.load()
		};

		let values = [
			{ "type": "radio", "value": 2, "label": this.translate("All files"), "checked": false },
			{ "type": "radio", "value": 1, "label": this.translate("Files sent only"), "checked": false },
			{ "type": "radio", "value": 0, "label": this.translate("Files not sent only"), "checked": false },
		];
		this.customService.showAlertForm(
			this.translate('Delete files'),
			[
				{ "label": this.translate('Delete'), "callback": callbackOk }, { "label": this.translate('Cancel'), "callback": callbackCancel }
			],
			values
		);
	}
	/*	
			deleteFilter(){
				this.fileTypeFilter = null;
				this.getFiles(null, null);
			}
		*/
}
