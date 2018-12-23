import { Component, ViewChild } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { FileService } from '../../service/file.service';
import { ItemsPage } from './items.page';
import { NavParams } from 'ionic-angular';
import { ItemService } from '../../service/item.service';
import { ArticleComponent } from '../../component/item/article.component';
import { CustomService } from '../../service/custom.service';

@Component({
	selector: 'page-articles',
	templateUrl: 'articles.page.html'
})
export class ArticlesPage extends ItemsPage {

	file: any;

	constructor(public miscellaneousService: MiscellaneousService, public fileService: FileService, public customService: CustomService, 
		public navParams: NavParams, public itemService: ItemService) {
		super(miscellaneousService, fileService, customService);
	}

	@ViewChild('articleComponent') private articleComponent: ArticleComponent;

	ngOnInit(){
		this.file = this.navParams.get('file');
		this.fileName = this.file.fileName;
		if (this.file.fileName){
			this.load();
		}
	}

	neww() {
		let article = this.itemService.newArticle();
		this.items.splice(0, 0, article);
	}

	newScan(){
		let article = this.itemService.newArticle();
		this.articleComponent.scan(article);
	}

}
