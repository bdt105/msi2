import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FileService } from '../../service/file.service';
import { AppService } from '../../angularShared/services/appService';
import { GenericComponent } from '../../angularShared/components/generic.component';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';

@Component({
    selector: 'page-input',
    templateUrl: 'input.page.html'
})
export class InputPage extends GenericComponent {

    articles = [];
    pdv: string;

    fileInfo: { "directory": string; "fileName": never; };
    constructor(public miscellaneousService: MiscellaneousService, public navCtrl: NavController, private fileCreationService: FileService, public navParams: NavParams, protected appService: AppService) {
        super(miscellaneousService);

    }

    ngOnInit() {

        if (this.navParams.get('articles')) {
            this.articles = this.navParams.get('articles');
        }
    }

    newCode() {
        let article = { "code": "", "quantity": 1 }
        this.articles.push(article);
    }

    writeFile(type: string) {
        this.fileInfo = this.fileCreationService.shareLabelFile(type, this.pdv, this.articles);
    }

    scan(article: any) {
        if (article) {
            this.appService.scanSimple((barcodeData: any, error: any) => {
                if (!error && barcodeData) {
                    if (!barcodeData.cancelled) {
                        article.code = barcodeData.text;
                    } else {
                        this.navCtrl.setRoot(InputPage, { articles: this.articles });
                        console.log("Scan cancelled");
                    }
                } else {
                    console.log("Could not Scan");
                }
            });
        }
    }

}
