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

	constructor(public miscellaneousService: MiscellaneousService, public customService: CustomService, private shareService: ShareService,
		public navParams: NavParams, public itemService: ItemService, public alertCtrl: AlertController) {
		super(miscellaneousService);
	}

	ngOnInit() {
		this.files = this.navParams.get('files');
		this.file = this.navParams.get('file');
		if (this.file) {
			this.load();
			this.scan = this.navParams.get('scan');
			if (this.scan) {
				this.newScan();
			}
		}
	}

	load(){
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
					this.itemService.touchFile(this.file);
					this.load();
				}
			}, this.files
		)
	}

	delete(article: any) {
		this.toolbox.deleteObjectInList(this.file.articles, "id", article.id);
		this.save();
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
		let callbackSave = (data: any) => {
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
		this.shareService.share(
			(data1: any, error1: any) => {
				if (!error1) {
					this.file.shareDate = new Date().getTime();
					this.save();
				}else{
					if (error1 && error1.message == "PARAM_ERROR"){
						this.customService.callbackToast(error1, this.translate('Impossible de share. Please set PDV in parameters.'))
					}
				}
			}, this.file
		)
	}

}
