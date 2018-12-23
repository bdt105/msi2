import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';

@Injectable()
export class ItemService {

    toolbox = new Toolbox();
    constructor() {

    }

    newFile() {
        let file: any = {};
        file.fileName = this.toolbox.getUniqueId();
        file.name = "";
        file.description = "";
        file.creationDate = new Date().toLocaleTimeString();
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

        return article;
    }

}