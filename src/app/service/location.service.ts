import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {LocationResponse} from "../model/location-response";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) {
  }

  getCities() {
    const url = `https://esgoo.net/api-tinhthanh/1/0.htm`
    return this.http.get<LocationResponse>(url);
  }

  getDistricts(id: string) {
    const url = `https://esgoo.net/api-tinhthanh/2/${id}.htm`
    return this.http.get<LocationResponse>(url);
  }

  getCommunes(id: string) {
    const url = `https://esgoo.net/api-tinhthanh/3/${id}.htm`
    return this.http.get<LocationResponse>(url);
  }
}
