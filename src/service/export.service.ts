import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { CustomService } from './custom.service';

@Injectable()
export class ExportService {

    toolbox = new Toolbox();
    constructor(private file: File, private customService: CustomService, public platform: Platform) {

    }

    private getDirectory() {
        let ret = this.file.externalDataDirectory;
        if (this.platform.is('ios')) {
            ret = this.file.tempDirectory;
        }
        return ret;
    }

    private completeValue(text: string, totalSize: number, value: string, before: boolean = true) {
        let prefixSize = totalSize - value.length;
        let pref = "";
        for (var i = 0; i < prefixSize; i++) {
            pref += text;
        }
        return before ? pref + value : value + pref;
    }

    private send(callback: Function, type: string, station: string, user: string, dir: string, content: string) {
        let typ = this.customService.getFileFormat(type) ? this.customService.getFileFormat(type).fileName : type;
        let fileName = this.getFileName(typ, station, user);
        this.file.writeFile(dir, fileName, content).then(
            (data: any) => {
                data.dir = dir;
                data.fileName = fileName;
                callback(data, null);
            }).catch(
                (error: any) => {
                    callback(null, error);
                }
            );
    }
/*
    labelFile(callback: Function, type: string, station: string, user: string, items: any) {
        let dir = this.getDirectory();
        if (items) {
            let content = "";
            items.forEach((article: any) => {
                let value = article.value + "";
                content += this.completeValue("0", 13, article.code) + this.completeValue("0", 4, value) + '\r\n';
            });
            this.send(callback, type, station, user, dir, content);
        }
    }

    orderFile(callback: Function, type: string, station: string, user: string, items: any) {
        let dir = this.getDirectory();
        if (items) {
            let content = "";
            items.forEach((article: any) => {
                let value = (article.value > 99 ? 0 : article.value) + "";
                content += this.completeValue("0", 13, article.code) + this.completeValue("0", 2, value) + '\r\n';
            });
            this.send(callback, type, station, user, dir, content);
        }
    }

    listFile(callback: Function, type: string, station: string, user: string, items: any) {
        let dir = this.getDirectory();
        if (items) {
            let content = "";
            items.forEach((article: any) => {
                content += this.completeValue("0", 13, article.code) + '\r\n';
            });
            this.send(callback, type, station, user, dir, content);
        }
    }

    templateFile(callback: Function, type: string, station: string, user: string, items: any, prefix: string, intSize: number, decSize: number) {
        let dir = this.getDirectory();
        if (items) {
            let content = "";
            items.forEach((article: any) => {
                let v = article.value.toString();
                let ar = v.split(".");
                let i = this.completeValue("0", intSize, ar[0]);
                let d = this.completeValue("0", decSize, ar.length > 1 ? ar[1] : "", false);
                let qte = i + d;
                content += prefix + this.completeValue("0", 13, article.code) + qte + '\r\n';
            });
            this.send(callback, type, station, user, dir, content);
        }
    }
*/

//ETIQUETTE_20181119_132312_SR284C01_ut284C01.traite1
    getFileName(type: string, station: string, user: string, date: Date = null) {
        let name = "";
        if (date == null) {
            date = new Date();
        }
        let d = date.getFullYear() + this.completeValue("0", 2, (date.getMonth() + 1) + "") + this.completeValue("0", 2, date.getDate() + "") + "_" +
            this.completeValue("0", 2, date.getHours() + "") + this.completeValue("0", 2, date.getMinutes() + "") + this.completeValue("0", 2, date.getSeconds() + "");
        name = d + "_" + station + "_" + user;
        return type + "_" + name + ".traite1";
    }

    /*
    "fileFormat": [
        {
            "length": 13,
            "fillWith": "0",
            "field": "code",
            "insertBefore": true
        },
        {
            "length": 5,
            "fillWith": "0",
            "field": "valueInteger",
            "insertBefore": true
        },
        {
            "length": 5,
            "fillWith": "0",
            "field": "valueDecimal",
            "insertBefore": false
        }
    ]
    */
    private getFileContentLine(article: any, fileFormat: any) {
        let ret = "";
        if (article && fileFormat) {
            fileFormat.forEach((element: any) => {
                let value = "";
                if (element.field == "code") {
                    value = this.completeValue("0", element.length, article.code);
                }
                if (element.field == "valueInteger") {
                    let v = article.value.toString();
                    let ar = v.split(".");
                    value = this.completeValue("0", element.length, ar[0]);
                }
                if (element.field == "valueDecimal") {
                    let v = article.value.toString();
                    let ar = v.split(".");
                    value = this.completeValue("0", element.length, ar.length > 1 ? ar[1] : "", false);
                }
                ret += this.completeValue(element.fillWith, element.length, value, element.insertBefore);
            });
        }
        return ret;
    }

    shareFile(callback: Function, file: any, station: string, user: string) {
        let dir = this.getDirectory();
        if (file && file.articles) {
            let content = "";
            let fileFormat = this.customService.getFileFormat(file.type);
            file.articles.forEach((article: any) => {
                content += this.getFileContentLine(article, fileFormat.fileFormat) + '\r\n';
            });
            this.send(callback, file.type, station, user, dir, content);
        }else{
            callback(null, "No file or article");
        }
    }

}