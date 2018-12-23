import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { AlertController, NavController } from 'ionic-angular';
import { ItemComponent } from './item.component';
import { ArticlesPage } from '../../pages/item/articles.page';
import { ParameterService } from '../../service/parameter.service';

@Component({
	selector: 'fileComponent',
	templateUrl: 'file.component.html'
})
export class FileComponent extends ItemComponent {

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService,
		public alertCtrl: AlertController, private navCtrl: NavController, public parameterService: ParameterService) {
		super(miscellaneousService, alertCtrl);
	}

	ngOnInit() {
	}

	deleteItem() {
		this.fileService.delete((data: any, error: any) => {
			if (!error || error.message == "NOT_FOUND_ERR") {
				this.deleted.emit(this.item);
			}
		}, this.item.fileName);
	}

	onView() {
		this.navCtrl.push(ArticlesPage, { "file": this.item });
	}

	share() {
		let params = this.parameterService.loadFormCache();
		if (params) {
			this.fileService.read(
				(data: any, error: any) => {
					if (data) {
						let items = JSON.parse(data);
						switch (this.item.type) {
							case "label":
								let t: any = this.toolbox.filterArrayOfObjects(this.fileService.fileFormats, "name", this.item.type);
								if (t) {
									this.fileService.shareLabelFile(t.fileName, params.pdv, items);
								}
								break;

							default:
								break;
						}
					} else {
						if (error) {
							console.error(error);
						}
					}
				}, this.item.fileName);
		}
	}
}
