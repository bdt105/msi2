import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { StorageService } from './storage.service';
import { AppService } from '../angularShared/services/appService';

@Injectable()
export class ItemService {

    toolbox = new Toolbox();

    filesKey = "files";
    parametersKey = "parameters";

    fileFormats = [
        {
            "name": "label",
            "label": "Label",
            "fileName": "ETIQUETTE",
            "icon": "pricetag",
            "color": "#6700ff"
        },
        {
            "name": "inventory",
            "label": "Inventory",
            "fileName": "INVENTAIRE",
            "icon": "clipboard",
            "color": "#005d38"
        },
        {
            "name": "price",
            "label": "Price check",
            "fileName": "PRIX",
            "icon": "cash",
            "color": "#ea0000"
        },
        {
            "name": "delivery",
            "label": "Delivery",
            "fileName": "LIVRAISON",
            "icon": "bicycle",
            "color": "#677171"
        },
        {
            "name": "order",
            "label": "Order",
            "fileName": "COMMANDE",
            "icon": "call",
            "color": "#bcc300"
        }
    ]

    constructor(public storageService: StorageService, private appService: AppService) {

    }

    getFormat(name: string) {
        let t = this.toolbox.filterArrayOfObjects(this.fileFormats, "name", name);
        if (t && t.length > 0) {
            return t[0];
        }
        return null;
    }


    newFile() {
        let file: any = {};
        file.id = this.toolbox.getUniqueId();
        file.fileName = this.toolbox.getUniqueId() + ".json";
        file.name = "";
        file.description = "";
        file.creationDate = new Date().getTime();
        file.modificationDate = file.creationDate;
        file.modify = true;
        return file;
    }

    newArticle() {
        let article: any = {};
        article.id = this.toolbox.getUniqueId();
        article.code = "";
        article.value = null;
        article.modify = true;
        article.creationDate = new Date().getTime();
        article.modificationDate = article.creationDate;
        return article;
    }

    private getItem(callback: Function, key: string) {
        this.storageService.read(
            (data: any, error: any) => {
                callback(data, error);
            }, key);
    }

    private saveItem(callback: Function, key: string, items: any) {
        this.storageService.write(
            (data: any, error: any) => {
                callback(data, error);
            }, key, items
        )
    }

    private deletedItem(callback: Function, key: string, item: any, items: any) {
        if (item) {
            let found = false;
            for (var i = 0; i < items.length; i++) {
                if (item.id == items[i].id) {
                    items.splice(i, 1);
                    found = true;
                }
            }
            if (found) {
                this.saveItem(
                    (data: any, error: any) => {
                        callback(data, error);
                    }, key, items
                );
            }
        }
    }

    getFiles(callback: Function) {
        this.getItem(
            (data: any, error: any) => {
                callback(data, error);
            }, this.filesKey
        )
    }

    getParameters(callback: Function) {
        this.getItem(
            (data: any, error: any) => {
                if (!error && data) {
                    callback(data, null);
                } else {
                    callback(null, error);
                }
            }, this.parametersKey
        )
    }

    saveParameters(callback: Function, parameters: any) {
        this.saveItem(
            (data: any, error: any) => {
                callback(data, error);
            }, this.parametersKey, parameters
        )
    }

    getFile(callback: Function, id: string) {
        this.getFiles(
            (data: any, error: any) => {
                if (!error) {
                    if (data) {
                        let filee = null;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].id == id) {
                                filee = data[i];
                                break;
                            }
                        }
                        callback(filee, null);
                    } else {
                        callback(data, error);
                    }
                } else {
                    callback(null, error);
                }
            }
        )
    }

    saveFiles(callback: Function, files: any) {
        this.saveItem(
            (data: any, error: any) => {
                callback(data, error);
            }, this.filesKey, files
        )
    }

    deleteFile(callback: Function, file: any, files: any) {
        this.deletedItem(
            (data: any, error: any) => {
                callback(data, error);
            }, this.filesKey, file, files
        )
    }

    touchFile(file: any){
        if (file){
            file.modificationDate = new Date().getTime();
        }
    }
    
    deleteArticle(callback: Function, article: any, file: any, files: any) {
        let articles = file.articles;
        let found = false;
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id = article.id) {
                articles.splice(i, 1);
            }
        }

        if (found) {
            this.saveFiles(callback, files);
        }
    }

    getLastFileId() {
        return this.appService.getSetting("lastFileId");
    }

    setLastFileId(file: any) {
        this.appService.setSetting("lastFileId", file);
    }

}