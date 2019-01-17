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
		private shareService: ShareService, public alertCtrl: AlertController, private navCtrl: NavController, 
		public actionSheetCtrl: ActionSheetController, public navController: NavController) {
		super(miscellaneousService, alertCtrl);
	}

	onView() {
		this.itemService.setLastFile(this.item);
		this.navCtrl.push(ArticlesPage, { "file": this.item, "files": this.items });
	}

	share() {
		this.shareService.share(
			(data1: any, error1: any) => {
				if (!error1) {
					this.item.shareDate = new Date().getTime();
					this.customService.callbackToast(null, this.translate('File shared with success!'));
					this.shared.emit(this.item);
					this.confirmDeleteAfterShare();
				}else{
					// For test only
					// this.item.shareDate = new Date().getTime();
					// this.shared.emit(this.item);
					if (error1 && error1.message == "PARAM_ERROR"){
						this.customService.callbackToast(error1, this.translate('Impossible de share. Please set station and user in parameters.'), 3000)
					}else{
						this.customService.callbackToast(error1, this.translate("Error sharing! Please check server.") + " " + (error1.exception ? error1.exception : ""), 3000);
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

	confirmDeleteAfterShare() {
		let alert = this.alertCtrl.create({
			title: this.translate('Confirm delete'),
			message: this.translate('Has the file been shared with success? If yes, do you want to delete it now?'),
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
						this.deleteItem();
					}
				}
			]
		});
		alert.present();
	}

}
