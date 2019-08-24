import { Component, ViewChild } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { ItemsPage } from './items.page';
import { NavParams, AlertController, NavController } from 'ionic-angular';
import { ItemService } from '../../service/item.service';
import { CustomService } from '../../service/custom.service';
import { ShareService } from '../../service/share.service';
import { Rest } from 'bdt105toolbox/dist';
import { timingSafeEqual } from 'crypto';
import { ArticleComponent } from '../../component/item/article.component';

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

	@ViewChild('articleComponent') articleComponent: ArticleComponent;

	constructor(public miscellaneousService: MiscellaneousService, public customService: CustomService, private shareService: ShareService,
		public navParams: NavParams, public itemService: ItemService, public alertCtrl: AlertController, public navController: NavController, private navCtrl: NavController) {
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

	private getValueSumOfArticle(article: any) {
		let sum: number = Number.parseFloat(article.value);
		let foundArray = this.findArticleInList(article);
		if (foundArray && foundArray.length > 0) {
			sum = 0;
			foundArray.forEach((art: any) => {
				sum += Number.parseFloat(art.value);
			});
		}
		return sum;
	}

	private saveArticle(article: any) {
		let foundArray = this.findArticleInList(article);
		let articleClone = this.toolbox.cloneObject(article);
		if (foundArray && foundArray.length > 0) {
			this.itemService.getParameters(
				(data: any, error: any) => {
					if (!error && data) {
						let sumValuesIfInList = data[0].sumValuesIfInList;
						if (sumValuesIfInList) {
							articleClone.value = this.getValueSumOfArticle(articleClone);
						} else {
							articleClone.value = article.value;
						}
					}
					this.addUpdateArticle(articleClone);
					this.save();
				}
			)
		}
	}

	private findArticleInList(article: any) {
		let foundArray = null;
		if (article && this.file && this.file.articles && this.file.articles.length > 0) {
			foundArray = this.toolbox.filterArrayOfObjects(this.file.articles, "code", article.code)
		}
		return foundArray;
	}

	private checkPresenceInList(article: any, occurence: number) {
		let message = "";
		let foundArray = this.findArticleInList(article);
		if (foundArray && foundArray.length >= occurence) {
			foundArray.forEach((element: any) => {
				message += (message && element.value ? ", " : "") + (element.value ? element.value : "");
			});
		}
		return message;
	}

	private checkPresenceInApi(callback: Function, article: any) {
		this.itemService.getParameters(
			(data: any, error: any) => {
				if (!error && data) {
					let api = data[0].apicheck + '/' + article.code;
					let checkCode = data[0].apiCheckPresence;
					let field = data[0].apicheckfield;
					if (checkCode) {
						this.rest.call((data1: any, error1: any) => {
							if (!error1) {
								if (!data1 || (data1 && data1.json && data1.json.length == 0)) {
									callback(this.translate('Warning! No data found'));
									//this.customService.callbackToast(null, this.translate('Warning! No data found'), 4000, 'top');
								} else {
									if (field && data1 && data1.json && data1.json.length > 0) {
										callback(data1.json[0][field]);
										// this.customService.callbackToast(null, data1.json[0][field], 4000, 'top');
									}
								}
							} else {
								callback(error1.message);
								// this.customService.callbackToast(data1, error1.message, 4000, 'top');
							}
						}, "GET", api)
					} else {
						callback(null);
					}
				}
			}
		)
	}

	codeChange(article: any) {
		article.label = null;
				this.checkPresenceInApi((message: string) => {
			article.label = message;
		}, article);
		let foundMessage = this.checkPresenceInList(article, 2);
		if (foundMessage) {
			this.customService.callbackToast(null, article.code + ' ' + this.translate('Values already entered') + ': ' + foundMessage, 4000);
		}
		this.itemService.touchFile(this.file);
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
		this.customService.scanSimple(
			(data: any, error: any) => {
				if (!error) {
					if (!data.cancelled) {
						let article = this.itemService.newArticle();
						article.code = data.text;
						this.itemService.touchFile(this.file);
						this.promptValue(article);
					} else {
						//this.navCtrl.pop();//. push(ArticlesPage, { "file": this.file, "files": this.files });
					}
				}
			}
		)
	}

	promptValue(article: any) {
		let callbackSave = (data: any) => {
			article.value = isNaN((data['0'])) ? "" : data['0'];
			if (data && this.itemService.isArticleValid(this.fileFormat, article)) {
				article.modify = false;
				this.items.splice(0, 0, article);
				this.saveArticle(article);
			} else {
				alert(this.translate(this.fileFormat.valueMessage) + ' ' + this.fileFormat.valuePlaceHolder);
				this.promptValue(article);
			}
		}

		let callbackSaveScan = (data: any) => {
			article.value = isNaN((data['0'])) ? "" : data['0'];
			if (data && this.itemService.isArticleValid(this.fileFormat, article)) {
				article.modify = false;
				this.items.splice(0, 0, article);
				this.save();
				this.newScan();
			} else {
				alert(this.translate(this.fileFormat.valueMessage) + ' ' + this.fileFormat.valuePlaceHolder);
				this.promptValue(article);
			}
		}

		let callbackNok = (data: any) => {
		}
		let foundMessage = this.checkPresenceInList(article, 1);

		let label = this.translate("Value");
		if (foundMessage) {
			label = this.translate("New value");
		}

		let values = [
			{
				"type": "number", "value": "1", "label": label, "checked": false, "placeholder": label
			}
		];

		let valuePrompt = this.customService.showAlertForm(
			label + ' ' + this.translate('for') + ' ' + (article ? article.code : "?"),
			[{ "label": this.translate('Save'), "callback": callbackSave },
			{ "label": this.translate('Save & scan'), "callback": callbackSaveScan },
			{ "label": this.translate('Cancel'), "callback": callbackNok }],
			values, foundMessage ? this.translate('Values already entered') + ': ' + foundMessage : null);

		this.checkPresenceInApi((message: string) => {
			valuePrompt.setTitle(message + ' ' + (article ? article.code : "?"));
			article.label = message;
		}, article);


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

}
