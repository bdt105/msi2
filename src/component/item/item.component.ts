import { Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../../angularShared/components/generic.component';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { AlertController } from 'ionic-angular';

export class ItemComponent extends GenericComponent {

	@Input() item: any;
	@Input() items: any;
	@Input() allowMenu = true;

	@Output() changed = new EventEmitter();
	@Output() deleted = new EventEmitter();
	@Output() saved = new EventEmitter();
	@Output() edited = new EventEmitter();
	@Output() shared = new EventEmitter();

	constructor(public miscellaneousService: MiscellaneousService, public alertCtrl: AlertController) {
		super(miscellaneousService);
	}

	ngOnInit() {
	}

	onChange() {
		this.changed.emit(this.item);
	}

	onSave() {
		this.item.modify = false;
		this.item.technicalModificationDate = new Date().getTime();
		this.saved.emit(this.item);
	}

	onEdit() {
		this.item.modify = true;
		this.edited.emit(this.item);
	}

	onView() {
	}

	deleteItem() {
		this.deleted.emit(this.item);
	}

	confirmDelete() {
		let alert = this.alertCtrl.create({
			title: this.translate('Confirm delete'),
			message: this.translate('Do you want to delete this item? All items attached will be lost forever!'),
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

	toggleModify(){
		this.item.modify = !this.item.modify;
	}
}
