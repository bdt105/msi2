import { Component, ViewChild } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { ItemsPage } from './items.page';
import { NavParams, AlertController, NavController } from 'ionic-angular';
import { ItemService } from '../../service/item.service';
import { CustomService } from '../../service/custom.service';
import { ShareService } from '../../service/share.service';
import { Rest } from 'bdt105toolbox/dist';
import { ArticleComponent } from '../../component/item/article.component';
import { ModalController } from 'ionic-angular';
import { ValuePage } from './value.page';

@Component({
	selector: 'page-articles',
	templateUrl: 'articles.page.html'
})
export class ArticlesPage extends ItemsPage {

	file: any;
	files: any;
	scan: boolean = false;
	fileFormat: any;
	rest: Rest = new Rest();
	autoScan = true;

	@ViewChild('articleComponent') articleComponent: ArticleComponent;
	isManual: boolean;

	constructor(public miscellaneousService: MiscellaneousService, public customService: CustomService, private shareService: ShareService,
		public navParams: NavParams, public itemService: ItemService, public alertCtrl: AlertController, public navController: NavController, 
		public modalCtrl: ModalController) {
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
		this.isManual = true;
		let article = this.itemService.newArticle();
		this.items.splice(0, 0, article);
		this.itemService.touchFile(this.file);
	}

	clicSave(article: any) {
		this.saveArticle(article);
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

	private addUpdateArticle(article: any) {
		if (!this.items) {
			this.items = [];
		}
		let articleClone = this.toolbox.cloneObject(article);
		this.toolbox.deleteObjectsInList(this.items, "code", articleClone.code);
		this.items.splice(0, 0, articleClone);
	}

	private saveArticle(article: any) {
		this.itemService.touchItem(article);
		this.addUpdateArticle(article);
		this.save();
	}

	change() {
		this.itemService.touchFile(this.file);
	}

	delete(article: any) {
		this.toolbox.deleteObjectInList(this.file.articles, "id", article.id);
		this.itemService.touchFile(this.file);
		this.save();
	}

	newScan() {
		this.isManual = false;
		this.customService.scanSimple(
			(data: any, error: any) => {
				if (!error) {
					if (!data.cancelled) {
						let article = this.itemService.newArticle();
						article.code = data.text;
						this.itemService.touchFile(this.file);
						this.promptValue2(article);
					} else {
						 this.navController.pop();
						 this.navController. push(ArticlesPage, { "file": this.file, "files": this.files });
					}
				}
			}
		)
	}

	share() {
		this.shareService.share(
			(data1: any, error1: any) => {
				if (!error1) {
					this.file.shareDate = new Date().getTime();
					this.customService.callbackToast(null, this.translate('File shared with success!'));
					this.save();
					this.confirmDeleteFile('Has the file been shared with success? If yes, do you want to delete it now?');
				} else {
					if (error1 && error1.message == "PARAM_ERROR") {
						this.customService.callbackToast(error1, this.translate('Impossible to share. Please set user in parameters.'), 3000)
					} else {
						if (error1.http_status == 404) {
							this.customService.callbackToast(error1, this.translate("Error sharing! Please check server.") + " " + (error1.body), 3000);
						} else {
							this.customService.callbackToast(error1, this.translate("Error sharing! Please check server.") + " " + (error1.exception ? error1.exception : ""), 3000);
						}
					}
				}
			}, this.file
		)
	}

	deleteFile() {
		this.itemService.deleteFile(
			(data: any, error: any) => {
				if (!error) {
					this.customService.callbackToast(null, this.translate('File deleted with success'));
					this.navController.pop();
				}
			}, this.files, this.fileFormat.name, "id", this.file.id, true
		)
	}

	confirmDeleteFile(message: string) {
		let alert = this.alertCtrl.create({
			title: this.translate('Confirm delete'),
			message: this.translate(message),
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
						this.deleteFile();
					}
				}
			]
		});
		alert.present();
	}

	valueClicked(article: any) {
		this.promptValue2(article);
	}

	promptValue2(article: any) {
		const modal = this.modalCtrl.create(ValuePage, { "article": article, "file": this.file, "fileFormat": this.fileFormat });
		modal.present();
		let callbackSave = (data: any) => {
			article.value = data.value;
			if (data && this.itemService.isArticleValid(this.fileFormat, article)) {
				article.modify = false;
				this.saveArticle(article);
			}
		}
		modal.onDidDismiss((data: any) => {
			if (data) {
				switch (data.button) {
					case "cancel":

						break;
					case "save":
						callbackSave(data);
						if (this.autoScan && !this.isManual) {
							this.newScan();
						}
						break;
					default:
						break;
				}
			}
		});
	}

	toggleAutoScan() {
		this.autoScan = !this.autoScan;
		this.customService.callbackToast(null, this.autoScan ? this.translate('Automatic scan enabled') : this.translate('Automatic scan disabled'));
	}
}
