import { Injectable } from '@angular/core';
import { MiscellaneousService } from '../angularShared/services/miscellaneous.service';
import { ConfigurationService } from 'bdt105angularconfigurationservice';
import { ToastController, LoadingController, Platform, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toolbox } from 'bdt105toolbox/dist';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../angularShared/services/appService';
import { Camera } from '@ionic-native/camera';

@Injectable()
export class CustomService extends AppService {

    public itemsPlusStorageKey = 'itemsPlus';

    toolbox: Toolbox = new Toolbox();

    private customKeys = {
        configurationKey: "configurationMsiv",
        translateKey: "translateMsiv",
        connexionKey: "connexionMsiv",
        settingKey: "settingsMsiv",
        fileFormatKey: "fileFormatMsiv",
        fileFormatMenuKey: "fileFormatMenuMsiv"
    }

    constructor(public http: HttpClient, public configurationService: ConfigurationService, public toastController: ToastController,
        public platform: Platform, public miscellaneousService: MiscellaneousService, public barcodeScanner: BarcodeScanner,
        public loadingCtrl: LoadingController, public alertCtrl: AlertController, public camera: Camera) {
        super(http, configurationService, toastController, platform, miscellaneousService, barcodeScanner, loadingCtrl, alertCtrl, camera);
        this.setVar(this.miscellaneousService);
    }

    setVar(miscellaneousService: MiscellaneousService) {
        this.setVariable(this.customKeys, "Msi Virtual", miscellaneousService);
    }

    smartDate(dateInMilliseconds: number) {
        if (dateInMilliseconds) {
            let date = new Date(dateInMilliseconds);
            return this.toolbox.smartDate(date);
        }
        return null;
    }

    myFormatDate(dateInMilliseconds: number) {
        if (dateInMilliseconds) {
            let date = new Date(dateInMilliseconds);
            return this.toolbox.formatDate(date);
        }
        return null;
    }

    loadFileFormat() {
        this.configurationService.load(this.customKeys.fileFormatKey, "./assets/fileFormat.json", false);
    }

    loadFileFormatMenu() {
        return this.configurationService.load(this.customKeys.fileFormatMenuKey, "./assets/fileFormatMenu.json", false);
    }

    getFileFormats() {
        return this.toolbox.readFromStorage(this.customKeys.fileFormatKey);
    }

    getFileFormatMenus() {
        return this.toolbox.readFromStorage(this.customKeys.fileFormatMenuKey, true);
    }

    getFileFormat(name: string) {
        let fileFormats = this.getFileFormats();
        if (fileFormats) {
            let t = this.toolbox.filterArrayOfObjects(fileFormats, "name", name);
            if (t && t.length > 0) {
                return t[0];
            }
        }
        return null;
    }

    checkRegEx(value: string, regex: string) {
        var patt = new RegExp(regex/*"^[0-9]{1,5}.[0-9]$"*/);
        let ret = patt.test(value);
        return ret;
    }

 
}