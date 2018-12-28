import { Component, Input } from '@angular/core';
import { MiscellaneousService } from '../../angularShared/services/miscellaneous.service';
import { AlertController, NavController, ActionSheetController } from 'ionic-angular';
import { ItemComponent } from '../item/item.component';
import { ArticlesPage } from '../../pages/item/articles.page';
import { CustomService } from '../../service/custom.service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'articleComponent',
	templateUrl: 'article.component.html'
})
export class ArticleComponent extends ItemComponent {
	@Input() file: any;

	base64Image: any;
	image: string;

	selected = false;
	constructor(public miscellaneousService: MiscellaneousService, public domSanitizer: DomSanitizer,
		public customService: CustomService, public alertCtrl: AlertController, private navCtrl: NavController,
		public actionSheetCtrl: ActionSheetController, private photoViewer: PhotoViewer, public camera: Camera, public filee: File) {
		super(miscellaneousService, alertCtrl);
	}

	ngOnInit() {
		if (this.item && this.item.imageUri) {
			this.loadImage(this.item.imageUri);
		}
	}

	scan(article: any) {
		if (article) {
			this.customService.scanSimple((barcodeData: any, error: any) => {
				if (!error && barcodeData) {
					if (!barcodeData.cancelled) {
						article.code = barcodeData.text;
						this.changed.emit(article);
					} else {
						this.customService.callbackToast(null, this.translate("Bar code scanning canceled"));
						if (this.file && this.file.fileName) {
							this.navCtrl.push(ArticlesPage, { "fileName": this.file.fileName });
						}
						console.log("Scan cancelled");
					}
				} else {
					console.log("Could not Scan");
				}
			});
		}
	}

	presentActionSheet() {
		this.selected = true;
		let actionSheet = this.actionSheetCtrl.create({
			title: this.translate('Choose your action'),
			buttons: [
				{
					text: this.translate('Scan'),
					icon: 'barcode',
					handler: () => {
						this.selected = false;

						this.scan(this.item);
					}
				},
				{
					text: this.translate('Edit'),
					icon: 'create',
					handler: () => {
						this.selected = false;
						if (!this.item.modify) {
							this.toggleModify()
						} else {
							this.onSave()
						}
					}
				},
				{
					text: this.translate('Delete'),
					icon: 'trash',
					handler: () => {
						this.selected = false;
						this.confirmDelete();
					}
				},
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						this.selected = false;
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

	takePhoto() {
		this.customService.getImage(
			(data: any, error: any) => {
				if (!error) {
					this.item.imageUrl = data;
					this.changed.emit(this.item);
				} else {
					this.customService.callbackToast(error, this.translate('Could not take a picture'))
				}
			}, 0
		)
	}

	takePicture(saveToPhotoAlbum: boolean = true) {
		this.camera.getPicture({
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			saveToPhotoAlbum: saveToPhotoAlbum
		}).then((imageUri: any) => {
			this.item.imageUri = imageUri;
			this.loadImage(this.item.imageUri);
			this.changed.emit(this.item);
		}, (err) => {
			console.log(err);
		});
	}

	loadImage(imageUri: any) {
		this.filee.resolveLocalFilesystemUrl(imageUri).then((entry: any) => {
			entry.file((file1: any) => {
				var reader = new FileReader();
				reader.onload = (encodedFile: any) => {
					var src = encodedFile.target.result;
					this.image = src;
				}
				reader.readAsDataURL(file1);
			})
		}).catch((error) => {
			console.log(error);
		})
	}

	viewPhoto() {
		if (this.item && this.item.imageUri) {
			this.photoViewer.show(this.item.imageUri, this.item.value, { share: true });
		}
	}

	confirmDeletePicture() {
		let alert = this.alertCtrl.create({
			title: this.translate('Confirm delete'),
			message: this.translate('Do you want to delete this picture?'),
			buttons: [
				{
					text: this.translate('No'),
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: this.translate('Yes'),
					handler: () => {
						this.deletePicture();
					}
				}
			]
		});
		alert.present();
	}

	deletePicture() {
		if (this.item && this.item.imageUri) {
			let filePath: string = this.item.imageUri;
			let l = filePath.lastIndexOf("/");
			let dir = filePath.substr(0, l + 1);
			let fileName = filePath.substr(l + 1, filePath.length - l);
			// alert(dir + ' === ' + fileName);
			this.filee.removeFile(dir, fileName).then(
				(data: any) => {
					this.item.imageUri = null;
					this.changed.emit(this.item);
				}
			).catch(
				(error: any) => {
					console.log(error);
				}
			)
		}
	}

	
}
