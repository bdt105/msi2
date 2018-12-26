import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { CustomService } from '../../service/custom.service';
import { Events } from 'ionic-angular';
import { ItemsPage } from '../item/items.page';
import { FileService } from '../../service/file.service';
import { ItemService } from '../../service/item.service';

@Component({
	selector: 'page-parameter',
	templateUrl: 'parameter.page.html'
})
export class ParameterPage extends ItemsPage {

	parameters: any = {};

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService, public itemService: ItemService, public customService: CustomService, public events: Events) {
		super(miscellaneousService, fileService, customService);
		this.key = this.itemService.parametersKey;
	}

	ngOnInit() {
		this.load((data: any, error: any) => {
			if (!error) {
				if (data) {
					this.items = data;
					if (data.length == 0) {
						let param: any = {};
						this.items.push(param);	
					}
				}else{
					let param: any = {};
					this.items.push(param);
				}
			}
		});
	}

	setLanguage(lang: string) {
		this.parameters.lang = lang;
		this.customService.setLanguage(lang);
		this.customService.setVar(this.miscellaneousService);
		this.events.publish('user:language', lang);
		this.save();
	}

}
