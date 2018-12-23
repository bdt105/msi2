import { Component } from '@angular/core';
import { GenericComponent } from '../../angularShared/components/generic.component';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.page.html'
})
export class HomePage extends GenericComponent  {

	articles = [];
	pdv: string;

	fileInfo: { "directory": string; "fileName": never; };
	constructor(public miscellaneousService: MiscellaneousService) {
		super(miscellaneousService);
	}

    ngOnInit() {

	}
		

}
