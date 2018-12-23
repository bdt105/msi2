import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { FileService } from './file.service';

@Injectable()
export class ParameterService {

    toolbox = new Toolbox();

    private fileName = "parameters.json";
    private key = "msivirtualParameters";

    constructor(private fileService: FileService) {
    }

    load(callback: Function) {
        this.fileService.read(
            (data: any, error: any) => {
                let dat = null;
                if (data) {
                    dat = JSON.parse(data);
                    this.toolbox.writeToStorage(this.key, dat, true);
                }else{
                    console.error(error);
                }
                callback(dat, error);

            }, this.fileName)
    }

    save(callback: Function, parameters: any) {
        this.fileService.write((data: any, error: any) => {
            if (error) {
                this.toolbox.logError(error);
            } else {
                data.file = this.fileService.dataDirectory() + "/" + this.fileName;
            }
            callback(data, error);
        }, this.fileName, JSON.stringify(parameters))
    }

    write(callback: Function, name: string, value: string) {
        this.read((data: any, error: any) => {
            if (!error) {
                data[name] = value;
                let content = JSON.stringify(data);
                this.fileService.write((data: any, error: any) => {
                    if (error) {
                        this.toolbox.logError(error);
                    }
                    callback(data, error);
                }, this.fileName, content)
            } else {
                this.toolbox.logError(error);
            }
        }, name)
    }

    read(callback: Function, name: string) {
        this.load(
            (data: any, error: any) => {
                let ret = null;
                if (data) {
                    let obj = null;
                    obj = JSON.parse(data);
                    ret = obj[name];
                }
                callback(ret, error);
            })
    }

    loadFormCache(){
        return this.toolbox.readFromStorage(this.key, true);
    }
}