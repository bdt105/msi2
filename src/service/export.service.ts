import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { File } from '@ionic-native/file';
import { ItemService } from './item.service';

@Injectable()
export class ExportService {

    toolbox = new Toolbox();
    constructor(private file: File, private itemService: ItemService) {

    }

    private getDirectory(){
        return this.file.externalDataDirectory;
    }

    private completeValue(text: string, totalSize: number, value: string, before: boolean = true) {
        let prefixSize = totalSize - value.length;
        let pref = "";
        for (var i = 0; i < prefixSize; i++) {
            pref += text;
        }
        return before ? pref + value : value + pref;
    }

    private send(callback: Function, type: string, pdv: string, dir: string, content: string) {
        let typ = this.itemService.getFormat(type) ? this.itemService.getFormat(type).fileName : type;
        let fileName = this.getFileName(typ, pdv);
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

    labelFile(callback: Function, type: string, pdv: string, items: any) {
        let dir = this.getDirectory();
        if (items) {
            let content = "";
            items.forEach((article: any) => {
                let value = article.value + "";
                content += this.completeValue("0", 13, article.code) + this.completeValue("0", 4, value) + '\r\n';
            });
            this.send(callback, type, pdv, dir, content);
        }
    }

    orderFile(callback: Function, type: string, pdv: string, items: any) {
        let dir = this.getDirectory();
        if (items) {
            let content = "";
            items.forEach((article: any) => {
                let value = (article.value > 99 ? 0 : article.value) + "";
                content += this.completeValue("0", 13, article.code) + this.completeValue("0", 2, value) + '\r\n';
            });
            this.send(callback, type, pdv, dir, content);
        }
    }

    listFile(callback: Function, type: string, pdv: string, items: any) {
        let dir = this.getDirectory();
        if (items) {
            let content = "";
            items.forEach((article: any) => {
                content += this.completeValue("0", 13, article.code) + '\r\n';
            });
            this.send(callback, type, pdv, dir, content);
        }
    }

    templateFile(callback: Function, type: string, pdv: string, items: any, prefix: string, intSize: number, decSize: number) {
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
            this.send(callback, type, pdv, dir, content);
        }
    }

    //ETIQUETTE_20181119_132312_SR284C01_ut284C01.traite1
    getFileName(type: string, pdv: string, date: Date = null) {
        let name = "";
        if (date == null) {
            date = new Date();
        }
        let d = date.getFullYear() + this.completeValue("0", 2, (date.getMonth() + 1) + "") + this.completeValue("0", 2, date.getDate() + "") + "_" +
            this.completeValue("0", 2, date.getHours() + "") + this.completeValue("0", 2, date.getMinutes() + "") + this.completeValue("0", 2, date.getSeconds() + "");
        name = d + "_ST" + pdv + "01_ut" + pdv + "01";
        return type + "_" + name + ".traite1";
    }

}