import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Toolbox } from 'bdt105toolbox/dist';

@Injectable()
export class FileService {

    toolbox = new Toolbox();
    constructor(private file: File, private socialSharing: SocialSharing) {

    }

    fileFormats = [
        {
            "name": "label",
            "label": "Label",
            "fileName": "ETIQUETTE"
        },
        {
            "name": "inventory",
            "label": "Inventory",
            "fileName": "INVENTAIRE"
        },
        {
            "name": "price",
            "label": "Price check",
            "fileName": "PRIX"
        }
    ]

    prefixValue(prefix: string, totalSize: number, value: string) {
        let prefixSize = totalSize - value.length;
        let pref = "";
        for (var i = 0; i < prefixSize; i++) {
            pref += prefix[0];
        }
        return pref + value;
    }

    shareLabelFile(type: string, pdv: string, items: any) {
        let ret = null;
        if (items) {
            let content = "";
            items.forEach((article: any) => {
                let value = article.value + "";
                content += this.prefixValue("0", 13, article.code) + this.prefixValue("0", 4, value) + '\r\n';
            });
            let fileName = this.getFileName(type, pdv);
            ret = { "directory": this.dataDirectory(), "fileName": fileName };
            this.file.writeFile(this.dataDirectory(), fileName, content).then(
                (data: any) => {
                    this.share(ret);
                });
        }
        return ret;
    }

    //ETIQUETTE_20181119_132312_SR284C01_ut284C01.traite1
    getFileName(type: string, pdv: string, date: Date = null) {
        let name = "";
        if (date == null) {
            date = new Date();
        }
        let d = date.getFullYear() + this.prefixValue("0", 2, (date.getMonth() + 1) + "") + this.prefixValue("0", 2, date.getDate() + "") + "_" +
            this.prefixValue("0", 2, date.getHours() + "") + this.prefixValue("0", 2, date.getMinutes() + "") + this.prefixValue("0", 2, date.getSeconds() + "");
        name = d + "_ST" + pdv + "01_ut" + pdv + "01";
        return type + "_" + name + ".traite1";
    }

    private share(fileObject: any) {
        this.socialSharing.share("test", "test", fileObject.directory + "/" + fileObject.fileName);
    }

    dataDirectory() {
        return this.file.externalDataDirectory;
    }

    getNewFileContent(type: string, description: string) {
        return { "description": description, "id": this.toolbox.getUniqueId(), "type": type }
    }

    private writeNewFile(callback: Function, fileName: string, content: any) {
        this.file.writeFile(this.dataDirectory(), fileName, content).then(
            (data: any) => {
                callback(data, null);
            }, (error: any) => {
                callback(null, error);
            })
    }

    write(callback: Function, fileName: string, content: any) {
        this.file.checkFile(this.dataDirectory(), fileName).then(
            (data: any) => {
                if (data == false) {
                    this.writeNewFile(callback, fileName, content);
                } else {
                    this.file.writeExistingFile(this.dataDirectory(), fileName, content).then(
                        (data: any) => {
                            callback(data, null);
                        }, (error: any) => {
                            callback(null, error);
                        })
                }
            }, (error: any) => {
                this.writeNewFile(callback, fileName, content);
                if (error && error.message == "NOT_FOUND_ERR") {
                    this.writeNewFile(callback, fileName, content);
                } else {
                    callback(null, error);
                }
            }
        )
    }

    read(callback: Function, fileName: string) {
        this.file.readAsText(this.dataDirectory(), fileName).then(
            (data: any) => {
                callback(data, null);
            }, (error: any) => {
                callback(null, error);
            });
    }

    delete(callback: Function, fileName: string) {
        this.file.removeFile(this.dataDirectory(), fileName).then(
            (data: any) => {
                callback(data, null);
            }, (error: any) => {
                callback(null, error);
            });
    }

    list(callback: Function) {
        this.file.listDir(this.dataDirectory(), "").then(
            (data: any) => {
                callback(data, null);
            }, (error: any) => {
                callback(null, error);
            });
    }

}