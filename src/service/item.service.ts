import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';

@Injectable()
export class ItemService {

    toolbox = new Toolbox();

    filesKey = "files";
    parametersKey = "parameters";
    
    constructor() {

    }

    newFile() {
        let file: any = {};
        file.id = this.toolbox.getUniqueId();
        file.fileName = this.toolbox.getUniqueId() + ".json";
        file.name = "";
        file.description = "";
        file.creationDate = this.toolbox.formatDate(new Date());
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
        article.creationDate = this.toolbox.formatDate(new Date());
        article.modificationDate = article.creationDate;
        return article;
    }

}