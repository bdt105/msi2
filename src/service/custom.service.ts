import { Injectable } from '@angular/core';
import { MiscellaneousService } from '../angularShared/services/miscellaneous.service';
import { ConfigurationService } from 'bdt105angularconfigurationservice';
import { ToastController, LoadingController, Platform, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toolbox } from 'bdt105toolbox/dist';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../angularShared/services/appService';

@Injectable()
export class CustomService extends AppService {

    public itemsPlusStorageKey = 'itemsPlus';

    toolbox: Toolbox = new Toolbox();

    constructor(public http: HttpClient, public configurationService: ConfigurationService, public toastController: ToastController,
        public platform: Platform, public miscellaneousService: MiscellaneousService, public barcodeScanner: BarcodeScanner,
        public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        super(http, configurationService, toastController, platform, miscellaneousService, barcodeScanner, loadingCtrl, alertCtrl);
        this.setVar(this.miscellaneousService);
    }

    setVar(miscellaneousService: MiscellaneousService) {
        this.setVariable(
            {
                configurationKey: "configurationMsiv",
                translateKey: "translateMsiv",
                connexionKey: "connexionMsiv",
                settingKey: "settingsMsiv"
            }, "Msi Virtual", miscellaneousService);
    }
}