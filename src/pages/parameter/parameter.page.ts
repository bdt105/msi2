import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { CustomService } from '../../service/custom.service';
import { Events, AlertController } from 'ionic-angular';
import { ItemsPage } from '../item/items.page';
import { StorageService } from '../../service/storage.service';
import { ItemService } from '../../service/item.service';

@Component({
	selector: 'page-parameter',
	templateUrl: 'parameter.page.html'
})
export class ParameterPage extends ItemsPage {

	allElements: any;
	showStorage = false;

	countShowExtra = 0;

	constructor(public miscellaneousService: MiscellaneousService, public storageService: StorageService,
		public itemService: ItemService, public customService: CustomService, public events: Events, public alertCtrl: AlertController) {
		super(miscellaneousService);
	}

	ionViewDidEnter() {
		this.countShowExtra = 0;
	}

	setDefaultUrl(){
		this.items[0].serverUrl = this.customService.getConfiguration().uploadServer.baseUrl;
		this.save();
	}

	ngOnInit() {
		this.items = null;
		this.itemService.getParameters(
			(data: any, error: any) => {
				if (!error) {
					this.items = data;
					if (!this.items) {
						this.items = [{}];
					}
					this.items[0].station = "MSIVirtual";
					if (!this.items[0].serverUrl) {
						this.setDefaultUrl();
					}
					this.save();
				}
			});
		this.getAllData();
	}

	setLanguage(lang: string) {
		this.customService.setLanguage(lang);
		this.customService.setVar(this.miscellaneousService);
		this.events.publish('user:language', lang);
	}

	getAllData() {
		this.storageService.showAll(
			(data: any, error: any) => {
				if (!error) {
					var prettyHtml = require('json-pretty-html').default;
					this.allElements = prettyHtml(data);
				}
			}
		)
	}

	toggleAllData() {
		this.showStorage = !this.showStorage;
		if (this.showStorage) {
			this.getAllData();
		}
	}

	/*
		private clearFiles() {
			this.storageService.delete(
				(data: any, error: any) => {
					if (!error) {
						this.customService.callbackToast(null, this.translate('All files and data deleted!'));
					} else {
						this.customService.callbackToast(null, this.translate('All files and data NOT deleted!'));
					}
				}, this.itemService.filesKey
			)
		}
	
		confirmDelete() {
			let alert = this.alertCtrl.create({
				title: this.translate('Confirm delete'),
				message: this.translate('Do you want to delete all files? All items attached will be lost forever!'),
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
							this.clearFiles();
						}
					}
				]
			});
			alert.present();
		}
	*/

	save() {
		this.items[0].station = "MSIVirtual";
		this.itemService.saveParameters(
			(data: any, error: any) => {
				if (error) {
					this.customService.callbackToast(error, this.translate('Could not save parameters'));
				}
			}, this.items
		)
	}

	saveUser() {
		if (this.items && this.items.length > 0) {
			this.items[0].user = this.items[0].user.replace(/[^a-zA-Z0-9]/g, "");
		}
		this.save();
	}
}
