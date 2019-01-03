import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { ItemService } from './item.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ExportService } from './export.service';

@Injectable()
export class ShareService {

    toolbox = new Toolbox();
    constructor(private socialSharing: SocialSharing, private itemService: ItemService, private exportService: ExportService) {

    }

    private goShare(callback: Function, data: any, error: any) {
        if (!error && data) {
            let fileUrl = data.dir + data.fileName;
            this.socialSharing.share(null, null, fileUrl).then(
                (data: any) => {
                    callback(data, null);
                }
            ).catch(
                (error: any) => {
                    callback(null, { "message": "SHARE_ERROR" });
                }
            );

        } else {
            callback(data, error);
        }
    }

    private shareFile(callback: Function, file: any, station: string, user: string) {
        if (station && user) {
            let items = file.articles;
            let t: any = this.toolbox.filterArrayOfObjects(this.itemService.fileFormats, "name", file.type);
            if (t && t.length > 0) {
                let type = t[0].fileName;
                switch (file.type) {
                    case "label":
                        this.exportService.labelFile(
                            (data: any, error: any) => {
                                this.goShare(callback, data, error);
                            }, type, station, user, items);

                        break;

                    case "delivery":
                        this.exportService.templateFile(
                            (data: any, error: any) => {
                                this.goShare(callback, data, error);
                            }, type, station, user, items, "000000000000", 5, 3);

                        break;

                    case "order":
                        this.exportService.orderFile(
                            (data: any, error: any) => {
                                this.goShare(callback, data, error);
                            }, type, station, user, items);

                        break;

                    case "list":
                        this.exportService.listFile(
                            (data: any, error: any) => {
                                this.goShare(callback, data, error);
                            }, type, station, user, items);

                        break;

                    case "inventory":
                        this.exportService.templateFile(
                            (data: any, error: any) => {
                                this.goShare(callback, data, error);
                            }, type, station, user, items, "", 5, 3);

                        break;


                    default:
                        callback(null, null);
                }
            }
        } else {
            callback(null, { message: "PARAM_ERROR" });
        }
    }

    share(callback: Function, file: any) {
        this.itemService.getParameters(
            (data: any, error: any) => {
                if (!error && data) {
                    if (data && data.length > 0) {
                        let station = data[0].station;
                        let user = data[0].user;
                        this.shareFile(
                            (data1: any, error1: any) => {
                                if (!error1) {
                                    file.shareDate = new Date().getTime();
                                }
                                callback(data1, error1);
                            }, file, station, user
                        )
                    } else {
                        callback(data, error);
                    }
                } else {
                    if (!data) {
                        callback(null, { message: "PARAM_ERROR" });
                    } else {
                        callback(data, error);
                    }
                }
            }
        )
    }

}