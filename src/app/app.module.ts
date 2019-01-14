import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, APP_INITIALIZER } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer'
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
//import { Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home.page';
import { ListPage } from '../pages/list/list';
import { ParameterPage } from '../pages/parameter/parameter.page';
import { FilesPage } from '../pages/item/files.page';
import { ArticlesPage } from '../pages/item/articles.page';

// Services
import { ConnexionTokenService } from 'bdt105angularconnexionservice';
import { MiscellaneousService } from '../angularShared/services/miscellaneous.service';
import { ConfigurationService } from 'bdt105angularconfigurationservice';
import { GoogleService } from '../angularShared/services/google.service';
import { DatabaseService } from '../angularShared/services/database.service';
import { GooglePlus } from '@ionic-native/google-plus';
import { StorageService } from '../service/storage.service';
import { ShareService } from '../service/share.service';
import { ItemService } from '../service/item.service';
import { AppService } from '../angularShared/services/appService';
import { CustomService } from '../service/custom.service';
import { ExportService } from '../service/export.service';

// Components
import { FileUploaderComponent } from '../angularShared/components/fileUploader';
import { SafePipe } from '../angularShared/services/safe.pipe';
import { ImageUploaderComponent } from '../angularShared/components/imageUploader';
import { FileComponent } from "../component/item/file.component";
import { ArticleComponent } from "../component/item/article.component";

export function init(customService: CustomService) {
	return () => {
		customService.loadConfiguration();
		customService.loadTranslation();
		customService.loadFileFormat();
		customService.loadFileFormatMenu();
	}
}
@NgModule({
	declarations: [
		MyApp,
		HomePage,
		ListPage,
		SafePipe,
		ParameterPage,
		FilesPage,
		ArticlesPage,
		FileUploaderComponent,
		ImageUploaderComponent,
		ArticleComponent,
		FileComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		HttpClientModule,
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot({
			name: 'msivirtual',
			   driverOrder: ['websql']
		  })
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		ListPage,
		ParameterPage,
		FilesPage,
		ArticlesPage,
		FileUploaderComponent,
		ImageUploaderComponent,
		ArticleComponent,
		FileComponent
	],
	providers: [
		{
			'provide': APP_INITIALIZER,
			'useFactory': init,
			'deps': [CustomService],
			'multi': true
		},		
		StatusBar,
		SplashScreen,
		SocialSharing,
		PhotoViewer,
		File,
		FileTransfer,
		Camera,
		StorageService,
		ShareService,
		BarcodeScanner,
		AppService,
		CustomService,
		ExportService,
		ConfigurationService,
		MiscellaneousService,
		ConnexionTokenService,
		GoogleService,
		DatabaseService,
		GooglePlus,
		ItemService,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
