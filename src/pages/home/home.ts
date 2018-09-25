import {Component, ElementRef, ViewChild, OnInit, NgZone} from '@angular/core';
import {ILocationData} from '../../app/interface/ILocationData';
import {IMarkerIcon} from '../../app/interface/IMarkerIcon';
import {AngularGoogleMapService} from '../../app/modules/google-map.module';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  locationData: Array<ILocationData>;
  google;
  public selectedLocationId: number;
  markers: any = [];
  defaultIcon: IMarkerIcon;
  selectedIcon: IMarkerIcon;
  currentLocationIcon: IMarkerIcon;

  constructor(public angularGoogleMapService: AngularGoogleMapService, private zone: NgZone) {
  }

  async ngOnInit() {
    /**
     * WIP
     */
    navigator.geolocation.getCurrentPosition(this.showPosition, this.locationError, {
      enableHighAccuracy: true,
      maximumAge: 1000000,
      timeout: 2000
    });

    /**
     * Initialize google variable
     */
    this.google = await this.angularGoogleMapService.loadMap();

    /**
     * Initialize default marker icon
     */
    this.defaultIcon = {
      url: 'assets/imgs/gray.png', // url
      scaledSize: new this.google.maps.Size(50, 50),
      origin: new this.google.maps.Point(0, 0),
      anchor: new this.google.maps.Point(0, 0),
    };

    /**
     * Initialize selected location marker icon
     */
    this.selectedIcon = {
      url: 'assets/imgs/yellow.png', // url
      scaledSize: new this.google.maps.Size(50, 50),
      origin: new this.google.maps.Point(0, 0),
      anchor: new this.google.maps.Point(0, 0),
    };

    /**
     * Initialize user current location marker icon
     */
    this.currentLocationIcon = {
      url: 'assets/imgs/blue.png', // url
      scaledSize: new this.google.maps.Size(50, 50),
      origin: new this.google.maps.Point(0, 0),
      anchor: new this.google.maps.Point(0, 0),
    };

    /**
     * Default list view data
     */
    this.locationData = [
      {name: 'Pi 12345', lat: 23.2233, lng: 72.6477, val: 5.3, id: 100},
      {name: 'Pi 78954', lat: 23.1953, lng: 72.6333, val: 5.3, id: 101}
    ];
    this.loadMap();
  }


  /**
   * THis function for load map
   */
  loadMap() {
    this.map = new this.google.maps.Map(this.mapElement.nativeElement, {
      zoom: 12,
      center: {lat: 23.1935255, lng: 72.5973378}
    });

    this.addMarker({lat: 23.1935255, lng: 72.5973378}, this.currentLocationIcon, -1);
    this.locationData.forEach((location, index) => {
      this.addMarker({lat: location.lat, lng: location.lng}, this.defaultIcon, location.id);
    });
  }

  /**
   * This function does change marker icons
   */
  toggleIcons(selectedMarkerId): void {
    this.markers.forEach((marker, index) => {
      if (marker.data.id === selectedMarkerId) {
        marker.setIcon(this.selectedIcon);
      } else if (marker.data.id === -1) {
        marker.setIcon(this.currentLocationIcon);
      } else {
        marker.setIcon(this.defaultIcon);
      }
    });
  }

  /**
   * This function use for select item in list view
   */
  toggleItemSelection(selectedMarkerId) {
    this.selectedLocationId = selectedMarkerId;
    this.toggleIcons(selectedMarkerId);
  }


  /**
   * It is add marker to the map
   */
  addMarker(location, icon, id) {
    const marker = new this.google.maps.Marker({
      position: {lat: parseFloat(location.lat), lng: parseFloat(location.lng)},
      draggable: false,
      map: this.map,
      icon: icon,
      data: {
        id: id
      }
    });
    this.markers.push(marker);

    this.google.maps.event.addListener(marker, 'click', () => {
      if (marker.data.id === -1) {
        return;
      }
      this.zone.run(() => {
        this.selectedLocationId = marker.data.id;
        this.toggleIcons(marker.data.id);
      });
    });
  }

  /**
   * WIP
   */
  showPosition(position) {
    const currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log('currentLocation ', currentLocation);
  }

  /**
   * WIP
   */
  locationError(error) {
    console.log('error ', JSON.stringify(error));
  }

}
