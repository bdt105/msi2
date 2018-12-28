import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageService {

    toolbox = new Toolbox();
    constructor(private storage: Storage) {

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
            console.error(error);
        });
    }

    read(callback: Function, key: string) {
        this.storage.get(key).then(
            (data: any) => {
                callback(data, null);
            }
        ).catch((error: any) => {
            callback(null, error);
            console.error(error);
        });
    }

    delete(callback: Function, key: string) {
        this.storage.remove(key).then(
            (data: any) => {
                callback(data, null);
            }, (error: any) => {
                callback(null, error);
                console.error(error);
            });
    }


    showAll(callback: Function) {
        let list = [];
        this.storage.forEach((value, key, index) => {
            list.push({ "key": key, "value": value, "index": index });
        }).then((d) => {
            callback(list, null)
        }).catch((error: any) => {
            callback(null, error);
            console.error(error);
        });
    }

}