import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ExportService } from './export.service';
import { CustomService } from './custom.service';
import { ItemService } from './item.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

@Injectable()
export class ShareService {

    toolbox = new Toolbox();
    constructor(private socialSharing: SocialSharing, private itemService: ItemService, private customService: CustomService,
        private exportService: ExportService, private fileTransfer: FileTransfer) {

    }

    private goShare(callback: Function, fileUrl: string) {
        if (fileUrl) {
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
            callback(null, "No url for the file");
        }
    }

    private goSendToUrl(callback: Function, fileUrl: string, more: any, destinationUrl: string) {
        if (fileUrl && destinationUrl) {
            let fileTransfer: FileTransferObject = this.fileTransfer.create();
            fileTransfer.upload(fileUrl, destinationUrl, more, true).then(
                (val: any) => {
                    callback(val, null);
                }).catch((error: any) => {
                    callback(null, error);
                });
        } else {
            callback(null, "No url for the file");
        }
    }

    private shareFile(callback: Function, file: any, station: string, user: string, destinationUrl: string) {
        let fileFormat = this.customService.getFileFormat(file.type);
        if (fileFormat && station && user) {
            this.exportService.shareFile(
                (data: any, error: any) => {
                    if (destinationUrl) {
                        // let more = {"fileName": data.fileName, "station": station, "user": user};
                        var uploadOptions = {
                            fileKey: "file", // change fileKey
                            chunkedMode: false, // add chunkedMode
                            mimeType: "multipart/form-data", // add mimeType
                            fileName: data.fileName,
                            params: { 'fileName': data.fileName, "station": station, "user": user }
                        };
                        this.goSendToUrl(callback, data.dir + data.fileName, uploadOptions, destinationUrl)
                    } else {
                        if (!error) {
                            this.goShare(callback, data.dir + data.fileName);
                        } else {
                            callback(null, error);
                        }
                    }
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
                        let shateToUrl = data[0].shateToUrl;
                        let destinationUrl = shateToUrl ?
                            "http://" + data[0].serverUrl + ":" + data[0].port + "/upload" :
                            "";
                        this.shareFile(
                            (data1: any, error1: any) => {
                                callback(data1, error1);
                            }, file, station, user, destinationUrl
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