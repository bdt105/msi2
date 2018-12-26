import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { ItemService } from './item.service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Injectable()
export class FileService {

    toolbox = new Toolbox();
    constructor(private storage: Storage, private file: File, private socialSharing: SocialSharing, private itemService: ItemService) {

    }

    fileFormats = [
        {
            "name": "label",
            "label": "Label",
            "fileName": "ETIQUETTE",
            "icon": "pricetag"
        },
        {
            "name": "inventory",
            "label": "Inventory",
            "fileName": "INVENTAIRE",
            "icon": "book"
        },
        {
            "name": "price",
            "label": "Price check",
            "fileName": "PRIX",
            "icon": "cash"
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


    share(callback, file: any) {

        this.read(
            (data: any, error: any) => {
                let params = data;
                if (params && params.length > 0) {
                    let items = file.articles;
                    switch (file.type) {
                        case "label":
                            let t: any = this.toolbox.filterArrayOfObjects(this.fileFormats, "name", file.type);
                            if (t && t.length > 0) {
                                let type = t[0].fileName;
                                let pdv = params[0].pdv;

                                this.shareLabelFile(
                                    (data: any, error: any) => {
                                        callback(data, error);
                                    }, type, pdv, items);
                            }
                            break;

                        default:
                            callback(null, null);
                    }
                } else {
                    callback(null, { "message": "PARAM_ERROR" });
                }
            }, this.itemService.parametersKey)
    }

    private shareLabelFile(callback: Function, type: string, pdv: string, items: any) {
        let dir = this.file.externalDataDirectory;
        if (items) {
            let content = "";
            items.forEach((article: any) => {
                let value = article.value + "";
                content += this.prefixValue("0", 13, article.code) + this.prefixValue("0", 4, value) + '\r\n';
            });
            let typ = this.getFormat(type) ? this.getFormat(type).fileName : type;
            let fileName = this.getFileName(typ, pdv);
            let fileUrl = dir + fileName;
            this.file.writeFile(dir, fileName, content).then(
                (data: any) => {
                    this.socialSharing.share(null, null, fileUrl).then(
                        (data: any) => {
                            callback(data, null);
                        }
                    ).catch(
                        (error: any) => {
                            callback(null, {"message": "SHARE_ERROR"});
                        }
                    );
                }).catch(
                    (error: any) => {
                        callback(null, error);
                    }
                );
        }
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

    getNewFileContent(type: string, description: string) {
        return { "description": description, "id": this.toolbox.getUniqueId(), "type": type }
    }

    write(callback: Function, key: string, content: any) {
        this.storage.set(key, content).then(
            (data: any) => {
                callback(data, null);
            }
        ).catch((error: any) => {
            callback(null, error);
        });
    }

    read(callback: Function, key: string) {
        this.storage.get(key).then(
            (data: any) => {
                callback(data, null);
            }
        ).catch((error: any) => {
            callback(null, error);
        });
    }

    delete(callback: Function, key: string) {
        this.storage.remove(key).then(
            (data: any) => {
                callback(data, null);
            }, (error: any) => {
                callback(null, error);
            });
    }

    getFormat(name: string) {
        let t = this.toolbox.filterArrayOfObjects(this.fileFormats, "name", name);
        if (t && t.length > 0) {
            return t[0];
        }
        return null;
    }

}