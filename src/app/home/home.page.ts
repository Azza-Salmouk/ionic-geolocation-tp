import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnDestroy {

  latitude: number | null = null;
  longitude: number | null = null;
  altitude: number | null = null;

  errorMessage: string = '';

  watchID: number | null = null;

  positionCount: number = 0;
  trackingDuration: number = 0;

  private trackingStartTime: number = 0;
  private durationInterval: any = null;

  constructor() {}

  obtenirPositionPonctuelle() {

    this.errorMessage = '';

    if (!navigator.geolocation) {
      this.errorMessage = 'La géolocalisation n’est pas disponible.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.altitude = position.coords.altitude;

      },
      (error) => {

        this.errorMessage = this.getErrorMessage(error);

      }
    );
  }

  demarrerSuivi() {

  if (!navigator.geolocation) {
    this.errorMessage = 'La géolocalisation n’est pas disponible.';
    return;
  }

  if (this.watchID !== null) {
    return;
  }

  this.errorMessage = '';
  this.positionCount = 0;
  this.trackingDuration = 0;

  this.trackingStartTime = Date.now();

  this.watchID = navigator.geolocation.watchPosition(
    (position) => {

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.altitude = position.coords.altitude;

      this.positionCount++;
    },
    (error) => {

      this.errorMessage = this.getErrorMessage(error);

    }
  );

  this.durationInterval = setInterval(() => {

    this.trackingDuration = Math.floor(
      (Date.now() - this.trackingStartTime) / 1000
    );

  }, 1000);
}

  arreterSuivi() {

    if (this.watchID !== null) {

      navigator.geolocation.clearWatch(this.watchID);

      this.watchID = null;
    }

    if (this.durationInterval !== null) {

      clearInterval(this.durationInterval);

      this.durationInterval = null;
    }
  }

  private getErrorMessage(error: GeolocationPositionError): string {

    switch (error.code) {

      case 1:
        return 'Permission de géolocalisation refusée.';

      case 2:
        return 'Position indisponible.';

      case 3:
        return 'Délai de géolocalisation dépassé.';

      default:
        return 'Une erreur de géolocalisation est survenue.';
    }
  }

  ngOnDestroy() {

    this.arreterSuivi();

  }
}