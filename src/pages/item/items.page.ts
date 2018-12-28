import { GenericComponent } from '../../angularShared/components/generic.component';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';

export class ItemsPage extends GenericComponent {

	items: any;

	constructor(public miscellaneousService: MiscellaneousService) {
		super(miscellaneousService);
	}

}
