import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { AppService } from '../../angularShared/services/appService';
import { ItemsPage } from './items.page';
import { ItemService } from '../../service/item.service';
import { CustomService } from '../../service/custom.service';

@Component({
	selector: 'page-files',
	templateUrl: 'files.page.html'
})
export class FilesPage extends ItemsPage {

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService, public customService: CustomService, public itemService: ItemService) {
        super(miscellaneousService, fileService, customService);
        this.fileName = "files.json"
	}

	neww() {
		let file = this.itemService.newFile();
		this.items.splice(0, 0, file);
	}

}
