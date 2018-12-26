import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { AlertController, NavController, ActionSheetController } from 'ionic-angular';
import { ItemComponent } from './item.component';
import { ArticlesPage } from '../../pages/item/articles.page';
import { CustomService } from '../../service/custom.service';

@Component({
	selector: 'fileComponent',
	templateUrl: 'file.component.html'
})
export class FileComponent extends ItemComponent {

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService, public customService: CustomService,
		public alertCtrl: AlertController, private navCtrl: NavController, public actionSheetCtrl: ActionSheetController) {
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
		this.customService.setLastFile(this.item);
		if (this.item) {
			this.customService.callbackToast(null, this.translate('Current file is now: ') + this.item.name)
		}
		this.navCtrl.push(ArticlesPage, { "file": this.item, "files": this.items });
	}

	presentActionSheet() {
		const actionSheet = this.actionSheetCtrl.create({
			title: this.translate('Choose your action'),
			buttons: [
				{
					text: this.translate('Share'),
					icon: 'share',
					handler: () => {
						this.fileService.share(
							(data: any, error: any) => {
								if (error && error.message == "PARAM_ERROR") {
									this.customService.callbackToast(data, this.translate('Parameters or PDV not defined! Please set parameters before sharing'))
								}
							}, this.item);
					}
				},
				{
					text: this.translate('Edit'),
					icon: 'create',
					handler: () => {
						if (!this.item.modify) {
							this.toggleModify()
						} else {
							this.onSave()
						}
					}
				},
				{
					text: this.translate('Delete'),
					icon: 'trash',
					handler: () => {
						this.confirmDelete();
					}
				},
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

}
