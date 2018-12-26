import { GenericComponent } from '../../angularShared/components/generic.component';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { CustomService } from '../../service/custom.service';

export class ItemsPage extends GenericComponent {

	items = [];

	key: string;

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService, public customService: CustomService) {
		super(miscellaneousService);
	}

	ngOnInit() {
		this.loadSimple();
	}

	load(callback: Function) {

		this.fileService.read(
			(data: any, error: any) => {
				if (data) {
					this.items = data;
				} else {
					if (error) {
						console.error(error);
					}
				}
				callback(data, error);
			}, this.key);
	}

	loadSimple() {
		this.load(
			(data: any, error: any) => {

			}
		);
	}

	save() {
		this.fileService.write(
			(data: any, error: any) => {
				if (error) {
					this.customService.callbackToast(null, this.translate('Could not save files'));
				} else {

				}
			}, this.key, this.items
		)
	}

	deleted(item: any) {
		if (item) {
			let found = false;
			for (var i = 0; i < this.items.length; i++) {
				if (item.id == this.items[i].id) {
					this.items.splice(i, 1);
					found = true;
				}
			}
			if (found) {
				this.save();
			}
		}
	}

}
