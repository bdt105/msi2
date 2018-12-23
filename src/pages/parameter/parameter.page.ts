import { Component } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { GenericComponent } from '../../angularShared/components/generic.component';
import { ParameterService } from '../../service/parameter.service';
import { AppService } from '../../angularShared/services/appService';
import { CustomService } from '../../service/custom.service';
import { Events } from 'ionic-angular';

@Component({
	selector: 'page-parameter',
	templateUrl: 'parameter.page.html'
})
export class ParameterPage extends GenericComponent {

	parameters: any = {};

	constructor(public miscellaneousService: MiscellaneousService, public parameteService: ParameterService, public customService: CustomService, public events: Events) {
		super(miscellaneousService);
	}

	ngOnInit() {
		this.parameteService.load(
			(data: any, error: any) => {
				if (data) {
					this.parameters = data;
				} else {
					console.error(error);
				}
			});
	}

	save() {
		this.parameteService.save(
			(data: any, error: any) => {
				if (data) {
					this.parameters = data;
				} else {
					console.error(error);
				}
			}, this.parameters)
	}

	setLanguage(lang: string){
		this.parameters.lang = lang;
		this.customService.setLanguage(lang);
		this.customService.setVar(this.miscellaneousService);
        this.events.publish('user:language', lang);
		this.save();
	}

}
