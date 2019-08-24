import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { StorageService } from './storage.service';
import { CustomService } from './custom.service';

@Injectable()
export class ItemService {

    toolbox = new Toolbox();

    filesKey = "files";
    parametersKey = "parameters";

    constructor(public storageService: StorageService, private customService: CustomService) {

    }

    newFile(type: string) {
        let file: any = {};
        file.id = this.toolbox.getUniqueId();
        file.fileName = this.toolbox.getUniqueId() + ".json";
        file.type = type;
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

    private deletedItem(callback: Function, storageKey: string, field: string, value: string, equal: boolean, items: any) {
        let deleted = this.toolbox.deleteObjectsInList(items, field, value, equal);
        if (deleted > 0) {
            this.saveItem(
                (data: any, error: any) => {
                    callback(data, error);
                }, storageKey, items
            );
        } else {
            callback(null, null);
        }
    }

    // copyFile(callback: Function, sourceFile: any, destinationType: string){
    //     if (sourceFile && destinationType){
    //         this.storageService.read((data: any, error: any) => {

    //         }, )
    //     }

    // }

    getFiles(callback: Function, type: string) {
        this.getItem(
            (data: any, error: any) => {
                callback(data, error);
            }, this.filesKey + "_" + type
        )
    }

    saveFiles(callback: Function, files: any, type: string) {
        this.saveItem(
            (data: any, error: any) => {
                callback(data, error);
            }, this.filesKey + "_" + type, files
        )
    }

    deleteFile(callback: Function, files: any, type: string, field: string, value: string, equal: boolean) {
        this.deletedItem(
            (data: any, error: any) => {
                callback(data, error);
            }, this.filesKey + "_" + type, field, value, equal, files
        )
    }

    deleteAllFile(callback: Function, type: string) {
        this.storageService.delete(
            (data: any, error: any) => {
                callback(data, error);
            }, this.filesKey + "_" + type
        )
    }

    touchFile(file: any) {
        if (file) {
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
            this.saveFiles(callback, files, file.type);
        }
    }

    getLastFile() {
        return this.customService.getSetting("lastFile");
    }

    setLastFile(file: any) {
        this.customService.setSetting("lastFile", file);
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

    splitSentFiles(files: any) {
        let ret: any = {};
        if (files) {
            files.forEach((file: any) => {
                if (!ret.sent) {
                    ret.sent = [];
                }
                if (!ret.notSent) {
                    ret.notSent = [];
                }
                if (file.shareDate) {
                    ret.sent.push(file);
                } else {
                    ret.notSent.push(file);
                }
            });
        }
        return ret;
    }

    countFiles(callback: Function) {
        this.storageService.showAll(
            (data: any, error: any) => {
                if (!error && data) {
                    let ret = [];
                    data.forEach((element: any) => {
                        if (element.value && element.key.startsWith(this.filesKey)) {
                            let split = this.splitSentFiles(element.value);
                            ret.push(
                                {
                                    "type": element.key.replace(this.filesKey + "_", ""),
                                    "data": split,
                                    "length": element.value.length
                                }
                            );
                        }
                    });
                    callback(ret, null);
                } else {
                    callback(null, error);
                }
            }
        )
    }

    isArticleValid(fileFormat: any, article: any) {
        let ret = true;
        if (fileFormat && fileFormat.valueRegex) {
            ret = this.customService.checkRegEx(article.value, fileFormat.valueRegex);
        }
        return ret && (article.code != null && article.code != undefined);
    }

    getFileCount(callback: Function, fileFormat: any) {
        if (fileFormat) {

            this.getFiles(
                (data: any, error: any) => {
                    if (!error && data) {
                        callback(data.length, null);
                    } else {
                        callback(data, error);
                    }
                }, fileFormat.name
            )
        }
    }


}