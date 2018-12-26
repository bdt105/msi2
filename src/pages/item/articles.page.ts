import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { ItemsPage } from './items.page';
import { NavParams, AlertController } from 'ionic-angular';
import { ItemService } from '../../service/item.service';
import { CustomService } from '../../service/custom.service';

@Component({
	selector: 'page-articles',
	templateUrl: 'articles.page.html'
})
export class ArticlesPage extends ItemsPage {

	file: any;
	files: any;
	scan = false;

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService, public customService: CustomService,
		public navParams: NavParams, public itemService: ItemService, public alertCtrl: AlertController) {
		super(miscellaneousService, fileService, customService);
	}

	ngOnInit() {
		this.file = this.navParams.get('file');
		this.files = this.navParams.get('files');
		if (this.file) {
			if (!this.file.articles) {
				this.file.articles = [];
			}

			this.items = this.file.articles;

			this.scan = this.navParams.get('scan');

			if (this.scan) {
				this.newScan();
			}
		}
	}

	neww() {
		let article = this.itemService.newArticle();
		this.items.splice(0, 0, article);
	}


	save() {
		this.fileService.write(
			(data: any, error: any) => {
				if (error) {
					this.customService.callbackToast(null, this.translate('Could not save files'));
				} else {

				}
			}, this.itemService.filesKey, this.files
		)
	}

	newScan() {
		this.customService.scanSimple(
			(data: any, error: any) => {
				if (!error) {
					if (!data.cancelled) {
						let article = this.itemService.newArticle();
						article.code = data.text;
						this.items.splice(0, 0, article);
						this.promptValue(article);
					}
				}
			}
		)
	}

	promptValue(article: any) {
		let callbackSave = (data) => {
			if (data) {
				article.value = data['0'];
				article.modify = false;
				this.save();
			};
		}

		let callbackSaveScan = (data: any) => {
			if (data) {
				article.value = data['0'];
				article.modify = false;
				this.save();
				this.newScan();
			};
		}

		let callbackNok = (data: any) => {
			console.log("Filter canceled");
		}

		let values = [
			{ "type": "number", "value": null, "label": this.translate('Value'), "checked": false }
		];
		this.customService.showAlertForm(
			this.translate('Value'),
			[{ "label": this.translate('Save'), "callback": callbackSave },
			{ "label": this.translate('Save & scan'), "callback": callbackSaveScan },
			{ "label": this.translate('Cancel'), "callback": callbackNok }],
			values)
	}

	share() {
		this.fileService.read(
			(data: any, error: any) => {
				if (data) {
					this.fileService.share(
						(data: any, error: any) => {
							if (error && error.message == "PARAM_ERROR"){
								this.customService.callbackToast(data, this.translate('No PDV set, please set a PDV in parameters'))
							}
						}, this.file);
				}
			}, this.itemService.parametersKey
		)
	}

}
