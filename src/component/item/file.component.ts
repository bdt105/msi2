import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { AlertController, NavController, ActionSheetController } from 'ionic-angular';
import { ItemComponent } from './item.component';
import { ArticlesPage } from '../../pages/item/articles.page';
import { CustomService } from '../../service/custom.service';
import { ItemService } from '../../service/item.service';
import { ShareService } from '../../service/share.service';

@Component({
	selector: 'fileComponent',
	templateUrl: 'file.component.html'
})
export class FileComponent extends ItemComponent {
	selected = false;

	constructor(public miscellaneousService: MiscellaneousService, public itemService: ItemService, public customService: CustomService,
		private shareService: ShareService, public alertCtrl: AlertController, private navCtrl: NavController, public actionSheetCtrl: ActionSheetController) {
		super(miscellaneousService, alertCtrl);
	}

	ngOnInit() {
	}

	onView() {
		this.itemService.setLastFileId(this.item.id);
		// if (this.item) {
		// 	this.customService.callbackToast(null, this.translate('Current file is now: ') + this.item.name)
		// }
		this.navCtrl.push(ArticlesPage, { "file": this.item, "files": this.items });
	}

	share() {
		this.shareService.share(
			(data1: any, error1: any) => {
				if (!error1) {
					this.item.shareDate = new Date().getTime();
					this.changed.emit(this.item);
				}else{
					if (error1 && error1.message == "PARAM_ERROR"){
						this.customService.callbackToast(error1, this.translate('Impossible de share. Please set station and user in parameters.'))
					}
				}
			}, this.item
		)
	}

	presentActionSheet() {
		this.selected = true;

		const actionSheet = this.actionSheetCtrl.create({
			title: this.translate('Choose your action'),
			buttons: [
				{
					text: this.translate('Share'),
					icon: 'share',
					handler: () => {
						this.selected = false;
						if (this.item && this.item.articles && this.item.articles.length > 0) {
							this.share();
						} else {
							this.customService.callbackToast(null, this.translate('No article to share'))
						}
					}
				},
				{
					text: this.translate('Edit'),
					icon: 'create',
					handler: () => {
						this.selected = false;
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
						this.selected = false;
						this.confirmDelete();
					}
				},
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						this.selected = false;
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

}
