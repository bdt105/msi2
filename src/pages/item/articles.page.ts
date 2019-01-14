import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { ItemsPage } from './items.page';
import { NavParams, AlertController } from 'ionic-angular';
import { ItemService } from '../../service/item.service';
import { CustomService } from '../../service/custom.service';
import { ShareService } from '../../service/share.service';

@Component({
	selector: 'page-articles',
	templateUrl: 'articles.page.html'
})
export class ArticlesPage extends ItemsPage {

	file: any;
	files: any;
	scan = false;
	fileFormat: any;

	constructor(public miscellaneousService: MiscellaneousService, public customService: CustomService, private shareService: ShareService,
		public navParams: NavParams, public itemService: ItemService, public alertCtrl: AlertController) {
		super(miscellaneousService);
	}

	ngOnInit() {
		this.files = this.navParams.get('files');
		this.file = this.navParams.get('file');
		if (this.file) {
			this.fileFormat = this.customService.getFileFormat(this.file.type);
			this.load();
			this.scan = this.navParams.get('scan');
			if (this.scan) {
				this.newScan();
			}
		}
	}

	load() {
		if (this.file) {
			if (!this.file.articles) {
				this.file.articles = [];
			}
			this.items = this.file.articles;
		}
	}

	neww() {
		let article = this.itemService.newArticle();
		this.items.splice(0, 0, article);
		this.itemService.touchFile(this.file);
	}

	save() {
		this.itemService.saveFiles(
			(data: any, error: any) => {
				if (error) {
					this.customService.callbackToast(null, this.translate('Could not save files'));
				} else {
					this.load();
				}
			}, this.files, this.file.type
		)
	}

	change(){
		this.itemService.touchFile(this.file);
	}
	
	delete(article: any) {
		this.toolbox.deleteObjectInList(this.file.articles, "id", article.id);
		this.itemService.touchFile(this.file);
		this.save();
	}

	newScan() {
		this.customService.scanSimple(
			(data: any, error: any) => {
				if (!error) {
					if (!data.cancelled) {
						let article = this.itemService.newArticle();
						article.code = data.text;
						this.itemService.touchFile(this.file);
						this.promptValue(article);
					}
				}
			}
		)
	}

	promptValue(article: any) {
		let callbackSave = (data: any) => {
			article.value = data['0'];
			if (data && this.itemService.isArticleValid(this.fileFormat, article)) {
				article.modify = false;
				this.items.splice(0, 0, article);
				this.save();
			} else {
				alert(this.translate(this.fileFormat.valueMessage));
				this.promptValue(article);
			}
		}

		let callbackSaveScan = (data: any) => {
			article.value = data['0'];
			if (data && this.itemService.isArticleValid(this.fileFormat, article)) {
				article.modify = false;
				this.items.splice(0, 0, article);
				this.save();
				this.newScan();
			} else {
				alert(this.translate(this.fileFormat.valueMessage));
				this.promptValue(article);
			}
		}

		let callbackNok = (data: any) => {
		}

		let values = [
			{ "type": "number", "value": null, "label": this.translate('Value'), "checked": false, "placeholder": this.fileFormat.placeholder }
		];

		this.customService.showAlertForm(
			this.translate('Value'),
			[{ "label": this.translate('Save'), "callback": callbackSave },
			{ "label": this.translate('Save & scan'), "callback": callbackSaveScan },
			{ "label": this.translate('Cancel'), "callback": callbackNok }],
			values)
	}

	share() {
		this.shareService.share(
			(data1: any, error1: any) => {
				if (!error1) {
					this.file.shareDate = new Date().getTime();
					this.customService.callbackToast(null, this.translate('File shared with success!'));
					this.save();
				} else {
					if (error1 && error1.message == "PARAM_ERROR") {
						this.customService.callbackToast(error1, this.translate('Impossible de share. Please set station and user in parameters.'), 3000)
					} else {
						this.customService.callbackToast(error1, this.translate("Error sharing! Please check server.") + " " + (error1.exception ? error1.exception : ""), 3000);
					}
				}
			}, this.file
		)
	}

}
