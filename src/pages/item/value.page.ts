import { Component, ViewChild } from '@angular/core';
import { GenericComponent } from '../../angularShared/components/generic.component';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
import { Rest } from 'bdt105toolbox/dist';
import { ItemService } from '../../service/item.service';

@Component({
    selector: 'page-value',
    templateUrl: 'value.page.html'
})
export class ValuePage extends GenericComponent {

    article: any;
    operation: string = "add";
    valueLabel: string = "Value";
    oldValue: number;
    newValue: number = null;
    file: any;
    rest: Rest = new Rest();
    fileFormat: any;
    showData = false;

    @ViewChild('valueInput') valueInput;

    constructor(public miscellaneousService: MiscellaneousService, public viewController: ViewController,
        public itemService: ItemService, public navParams: NavParams, public alertController: AlertController) {
        super(miscellaneousService);
    }

    ngOnInit() {
        this.file = this.navParams.get('file');
        this.article = this.navParams.get('article');
        this.fileFormat = this.navParams.get('fileFormat');
        this.checkPresenceInApi(
            (label: string, data: any) => {
                if (data) {
                    this.article.label = label;
                    this.article.data = data;
                }
            }, this.article
        );
        this.checkPresenceInList(this.article);
    }

    ngAfterViewChecked() {
        if (!this.showData) {
            this.valueInput.setFocus();
        }
    }

    private findArticleInList(article: any) {
        let foundArray = null;
        if (article && this.file && this.file.articles && this.file.articles.length > 0) {
            foundArray = this.toolbox.filterArrayOfObjects(this.file.articles, "code", article.code)
        }
        return foundArray;
    }

    private checkPresenceInList(article: any) {
        let foundArray = this.findArticleInList(article);
        this.oldValue = null;
        this.valueLabel = "Value";

        if (foundArray && foundArray.length >= 1) {
            this.oldValue = foundArray[0].value;
            this.valueLabel = "New value";
        }
    }

    private checkPresenceInApi(callback: Function, article: any) {
        this.itemService.getParameters(
            (data: any, error: any) => {
                if (!error && data) {
                    let api = data[0].apicheck + '/' + article.code;
                    let checkCode = data[0].apiCheckPresence;
                    let field = data[0].apicheckfield;
                    if (checkCode) {
                        this.rest.call((data1: any, error1: any) => {
                            if (!error1) {
                                if (!data1 || (data1 && data1.json && data1.json.length == 0)) {
                                    this.article.label = this.translate('Warning! No data found');
                                    this.article.data = null;
                                } else {
                                    if (field && data1 && data1.json && data1.json.length > 0) {
                                        this.article.label = data1.json[0][field];
                                        this.article.data = data1.json[0];
                                    }
                                }
                            } else {
                                this.article.label = this.translate(error1.message);
                                this.article.data = null;
                            }
                        }, "GET", api)
                    } else {
                        callback(null);
                    }
                }
            }
        )
    }

    onSaveReplace() {
        this.viewController.dismiss({ "button": "save", "operation": this.operation, "value": this.newValue });
    }

    onSaveAdd() {
        this.viewController.dismiss({ "button": "save", "operation": this.operation, "value": this.getTotal() });
    }

    onCancel() {
        this.viewController.dismiss({ "button": "cancel" });
    }

    private getTotal() {
        return Number.parseFloat(this.oldValue.toString()) + Number.parseFloat(this.newValue.toString())
    }

    getNewValue() {
        let ret = null;
        if (this.oldValue) {
            ret = Number.parseFloat(this.oldValue.toString());
            if (this.newValue != null) {
                ret = this.getTotal();
            }
        }
        return ret;
    }

    isValueValid() {
        return this.itemService.isValueValid(this.fileFormat, this.newValue);
    }

    canSave() {
        // this.article.value = this.newValue;
        let ret = this.newValue != null && this.newValue != undefined && this.isValueValid();
        return !ret;
    }

    confirmCancel() {
        if (this.newValue != null && this.newValue != undefined) {
            let alert = this.alertController.create({
                title: this.translate('Confirm cancel'),
                message: this.translate('Do you want to cancel?'),
                buttons: [
                    {
                        text: this.translate('Yes'),
                        handler: () => {
                            this.onCancel();
                        }
                    },
                    {
                        text: this.translate('No'),
                        role: 'cancel',
                        handler: () => {
                        }
                    }
                ]
            });
            alert.present();
        } else {
            this.onCancel();

        }
    }

}
