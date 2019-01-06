import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ExportService } from './export.service';
import { CustomService } from './custom.service';
import { ItemService } from './item.service';

@Injectable()
export class ShareService {

    toolbox = new Toolbox();
    constructor(private socialSharing: SocialSharing, private itemService: ItemService, private customService: CustomService, private exportService: ExportService) {

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
        let fileFormat = this.customService.getFileFormat(file.type);
        if (fileFormat && station && user) {
            this.exportService.shareFile(
                (data: any, error: any) => {
                    this.goShare(callback, data, error);
                }, file, station, user
            );
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