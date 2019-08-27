import { Input, Output, EventEmitter, Component } from '@angular/core';
import { GenericComponent } from '../../angularShared/components/generic.component';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { AlertController } from 'ionic-angular';

@Component({
	selector: 'itemComponent',
	templateUrl: 'item.component.html'
})

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

	confirmDelete(message: string = "Do you want to delete this item? All data attached will be lost forever!") {
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
						this.deleteItem();
					}
				}
			]
		});
		alert.present();
	}

	toggleModify() {
		this.item.modify = !this.item.modify;
		this.edited.emit(this.item);
	}

	getDataFields() {
		let ret = null;
		if (this.item && this.item.data) {
			ret = [];
			let ret1 = Object.keys(this.item.data);
			ret1.forEach((element: string) => {
				if (element == "__timestamp") {
					ret.push(element);
				}
				if (!element.startsWith("__")) {
					ret.push(element);
				}
			});
		}
		return ret;
	}

}
