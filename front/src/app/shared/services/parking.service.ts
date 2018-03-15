import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {ConfigService} from "./config.service";

@Injectable()
export class ParkingService {

  constructor(private apiService: ApiService,
              private config: ConfigService) {
  }

  getClosest(latitude: number, longitude: number) {
    return this.apiService.get(this.config.closest_areas_url + "?lat=" + latitude.toString() + "&long=" + longitude.toString())
      .map(res => {
        return res;
      });
  }

  addNewParkingArea(parkingArea, owner) {
    return this.apiService.post(this.config.add_parking_url + "?owner=" + owner, parkingArea)
      .map(res => {
        return res;
      });
  }

  getByOwner(owner) {
    return this.apiService.get(this.config.get_by_owner_url + "?name=" + owner)
      .map(res => {
        return res;
      });
  }

  getById(id) {
    return this.apiService.get(this.config.get_parking_by_id_url + "?id=" + id)
      .map(res => {
        return res;
      });
  }

  makeReservation(reservation, parkingId, username) {
    return this.apiService.post(this.config.make_reservation_url + "?parkingId=" + parkingId + "&username=" + username, reservation)
      .map(res => {
        return res;
      });
  }

  getByEmployee(employeeId) {
    return this.apiService.get(this.config.get_parking_by_employee_id_url + "?employeeId=" + employeeId)
      .map(res => {
        return res;
      });
  }

  editParkingArea(id, parkingArea) {
    return this.apiService.put(this.config.edit_parking_url + "?id=" + id, parkingArea)
      .map(res => {
        return res;
      });
  }

  deleteParkingArea(id) {
    return this.apiService.delete(this.config.delete_parking_url + "?id=" + id)
      .map(res => {
        return res;
      });
  }

  addLots(parkingId, numberOfLots) {
    return this.apiService.put(this.config.add_lots_url + "?parkingId=" + parkingId + "&numberOfLots=" + numberOfLots)
      .map(res => {
        return res;
      });
  }

  removeLots(parkingId, numberOfLots) {
    return this.apiService.put(this.config.remove_lots_url + "?parkingId=" + parkingId + "&numberOfLots=" + numberOfLots)
      .map(res => {
        return res;
      });
  }

  addEmployee(parkingId, employeeId) {
    return this.apiService.put(this.config.add_employee_to_parking_url + "?parkingId=" + parkingId + "&employeeId=" + employeeId)
      .map(res => {
        return res;
      });
  }

  removeEmployee(parkingId, employeeId) {
    return this.apiService.put(this.config.remove_employee_from_parking_url + "?parkingId=" + parkingId + "&employeeId=" + employeeId)
      .map(res => {
        return res;
      });
  }

  getUserReservations(userId) {
    return this.apiService.get(this.config.get_user_reservations_url + "?userId=" + userId)
      .map(res => {
        return res;
      })
  }

  cancelReservation(reservationId) {
    return this.apiService.delete(this.config.cancel_reservation_url + "?id=" + reservationId)
      .map(res => {
        return res;
      });
  }

  setLotVacant(lotId) {
    return this.apiService.put(this.config.set_lot_vacant_url + "?lotId=" + lotId)
      .map(res => {
        return res;
      });
  }

  setLotOccupied(lotId) {
    return this.apiService.put(this.config.set_lot_occupied_url + "?lotId=" + lotId)
      .map(res => {
        return res;
      });
  }

  findReservationByName(parkingId, name) {
    return this.apiService.get(this.config.get_reservation_by_name_url + "?parkingId=" + parkingId + "&name=" + name)
      .map(res => {
        return res;
      });
  }

  findReservationsByParking(parkingId) {
    return this.apiService.get(this.config.get_today_reservations_emp_url + "?parkingId=" + parkingId)
      .map(res => {
        return res;
      });
  }

  searchByTerm(term) {
    return this.apiService.get(this.config.search_parkings_by_term + "?term=" + term)
      .map(res => {
        return res;
      });
  }

  getAll() {
    return this.apiService.get(this.config.get_all_parkings_url)
      .map(res => {
        return res;
      });
  }

  searchByTermAndOwner(term, ownerId) {
    return this.apiService.get(this.config.get_parkings_by_term_owner_url + "?term=" + term + "&ownerId=" + ownerId)
      .map(res => {
        return res;
      });
  }
}
