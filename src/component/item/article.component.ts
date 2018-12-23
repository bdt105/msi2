import { Component, Input } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { AlertController, NavController } from 'ionic-angular';
import { ItemComponent } from '../item/item.component';
import { ArticlesPage } from '../../pages/item/articles.page';
import { CustomService } from '../../service/custom.service';
// import { ArticlesPage } from '../../pages/item/articles.page';

@Component({
	selector: 'articleComponent',
	templateUrl: 'article.component.html'
})
export class ArticleComponent extends ItemComponent {
	@Input() file: any;

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService,
		public customService: CustomService, public alertCtrl: AlertController, private navCtrl: NavController) {
		super(miscellaneousService, alertCtrl);
	}

	ngOnInit() {
	}

	deleteItem() {
		this.deleted.emit(this.item);
	}

	scan(article: any) {
		if (article) {
			this.customService.scanSimple((barcodeData: any, error: any) => {
				if (!error && barcodeData) {
					if (!barcodeData.cancelled) {
						article.code = barcodeData.text;
						this.changed.emit(article);
					} else {
						this.customService.callbackToast(null, this.translate("Bar code scanning canceled"));
						if (this.file && this.file.fileName) {
							this.navCtrl.push(ArticlesPage, { "fileName": this.file.fileName });
						}
						console.log("Scan cancelled");
					}
				} else {
					console.log("Could not Scan");
				}
			});
		}
	}
}
