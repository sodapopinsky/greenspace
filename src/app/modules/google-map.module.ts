import {Injectable, ModuleWithProviders, NgModule} from '@angular/core';


// Declare global variables
export declare var LAZY_MAPS_API_CONFIG: any;

/**
 * Configuration for the forRoot parameters interface.
 */
interface IMapsAPILoaderConfig {
  /**
   * The Google Maps API Key (see:
   * https://developers.google.com/maps/documentation/javascript/get-api-key)
   */
  apiKey?: string;
}

/**
 * Google map service to call map loading function
 */
@Injectable()
export class AngularGoogleMapService {

  constructor() {
  }

  /**
   * Callback function to load map
   * @return Promise<any>
   */
  loadMap(): Promise<any> {
    const callbackName = 'mapAPILoader';
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    // Chrome,Firefox, Opera, Safari 3+
    script.src = this.generateSrcLink(callbackName);

    const mapPromise = new Promise((resolve, reject) => {
      window[callbackName] = () => {
        const google = window['google'];
        if (!google) {
          reject();
          return;
        }
        resolve(google);
      };
      script.onerror = (error: any) => {
        reject(error);
      };
    });

    document.getElementsByTagName('head')[0].appendChild(script);
    return mapPromise;
  }

  /**
   * Generate google acript tag link
   * @param {string} callbackName
   */
  private generateSrcLink(callbackName: string): string {
    return 'https://maps.googleapis.com/maps/api/js?key='
      + 'AIzaSyB4C_mDHANxk4I3eFEX9N7-AZB8djwdVHs'
      + '&libraries=places'
      + '&callback=' + callbackName;
  }
}

/**
 * Main google map root module
 */
@NgModule({})
export class GoogleMapCoreModule {
  static forRoot(lazyMapsAPILoaderConfig?: IMapsAPILoaderConfig): ModuleWithProviders {
    return {
      ngModule: GoogleMapCoreModule,
      providers: [
        AngularGoogleMapService,
      ],
    };
  }
}
