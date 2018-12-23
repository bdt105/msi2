import { GenericComponent } from '../../angularShared/components/generic.component';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { CustomService } from '../../service/custom.service';

export class ItemsPage extends GenericComponent {

	items = [];

	fileName: string;

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService, public customService: CustomService) {
		super(miscellaneousService);
	}

	ngOnInit() {
		this.load();
	}

	load() {
		this.fileService.read(
			(data: any, error: any) => {
				if (data) {
					this.items = JSON.parse(data);
				} else {
					if (error) {
						console.error(error);
					}
				}
			}, this.fileName);
	}

	save() {
		this.fileService.write(
			(data: any, error: any) => {
				if (error) {
					this.customService.callbackToast(null, this.translate('Could not save files'));
				} else {
					this.load();
				}
			}, this.fileName, JSON.stringify(this.items)
		)
	}

	deleted(file: any) {
		if (file) {
			let found = false;
			for (var i = 0; i < this.items.length; i++) {
				if (file.fileName == this.items[i].fileName) {
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
