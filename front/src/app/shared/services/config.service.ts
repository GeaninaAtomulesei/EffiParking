import {Injectable} from "@angular/core";

@Injectable()
export class ConfigService {

  private _api_url = '/api';
  private _users_url = this.api_url + '/users';
  private _parkings_url = this.api_url + '/parkings';
  private _employees_url = this.api_url + '/employees';
  private _reservations_url = this.api_url + '/reservations';
  private _lots_url = this.api_url + '/lots';
  private _refresh_token_url = this._api_url + '/refresh';
  private _login_url = this._api_url + '/login';
  private _logout_url = this._api_url + '/logout';
  private _signup_url = this._api_url + '/signup';
  private _change_password_url = this.api_url + '/changePassword';

  private _whoami_url = this._users_url + '/whoami';
  private _get_notifications_url = this._users_url + '/getNotifications';
  private _delete_user_url = this._users_url + '/deleteUser';
  private _get_user_by_id_url = this._users_url + '/getById';
  private _search_users_by_term_url = this._users_url + '/searchByTerm';
  private _create_admin_url = this._users_url + '/createAdmin';
  private _delete_notification_url = this._users_url + '/deleteNotification';
  private _activate_owner_url = this._users_url + '/activateOwner';
  private _reg_as_owner_url = this._users_url + '/registerAsOwner';
  private _get_history_url = this._users_url + '/getHistory';
  private _update_user_url = this._users_url + '/update';
  private _get_all_users_url = this.users_url + '/all';
  private _save_message_url = this.users_url + '/sendMessage';
  private _get_all_messages_url = this.users_url + '/getAllMessages';
  private _delete_message_url = this.users_url + '/deleteMessage';

  private _closest_areas_url = this._parkings_url + '/getClosest';
  private _add_parking_url = this._parkings_url + '/add';
  private _get_by_owner_url = this._parkings_url + '/getByOwner';
  private _get_parking_by_id_url = this._parkings_url + '/getById';
  private _make_reservation_url = this._parkings_url + '/addReservation';
  private _get_parking_by_employee_id_url = this._parkings_url + '/getByEmployee';
  private _edit_parking_url = this._parkings_url + '/update';
  private _delete_parking_url = this._parkings_url + '/deleteParking';
  private _add_lots_url = this._parkings_url + '/addLots';
  private _remove_lots_url = this._parkings_url + '/removeLots';
  private _add_employee_to_parking_url = this._parkings_url + '/addEmployee';
  private _remove_employee_from_parking_url = this._parkings_url + '/removeEmployee';
  private _search_parkings_by_term = this._parkings_url + '/searchByTerm';
  private _get_all_parkings_url = this._parkings_url + '/all';
  private _get_parkings_by_term_owner_url = this._parkings_url + '/searchByTermAndOwner';
  private _check_available_lots_url = this.parkings_url + '/checkAvailable';
  private _get_available_lots_url = this._parkings_url + '/getAvailableLots';
  private _get_lots_per_parking_url = this._parkings_url + '/getLots';

  private _save_employee_url = this._employees_url + '/create';
  private _get_employees_by_owner_url = this._employees_url + '/getByOwner';
  private _get_employee_by_id_url = this._employees_url + '/getById';
  private _search_employee_by_term_url = this._employees_url + '/getByTerm';
  private _update_employee_url = this._employees_url + '/update';
  private _delete_employee_url = this._employees_url + '/delete';

  private _get_user_reservations_url = this._reservations_url + '/getUserReservations';
  private _cancel_reservation_url = this._reservations_url + '/cancel';
  private _get_reservation_by_name_url = this._reservations_url + '/findByUserNames';
  private _get_today_reservations_emp_url = this._reservations_url + '/getForParking';
  private _get_reservations_by_parking_and_lot_url = this.reservations_url + '/getByLotAndParking';

  private _set_lot_vacant_url = this._lots_url + '/setVacant';
  private _set_lot_occupied_url = this._lots_url + '/setOccupied';
  private _get_lot_by_parking_and_number_url = this.lots_url + '/findByParkingAndNumber';

  get api_url(): string {
    return this._api_url;
  }

  get change_password_url(): string {
    return this._change_password_url;
  }

  get users_url(): string {
    return this._users_url;
  }

  get parkings_url(): string {
    return this._parkings_url;
  }

  get employees_url(): string {
    return this._employees_url;
  }

  get reservations_url(): string {
    return this._reservations_url;
  }

  get lots_url(): string {
    return this._lots_url;
  }

  get refresh_token_url(): string {
    return this._refresh_token_url;
  }

  get login_url(): string {
    return this._login_url;
  }

  get logout_url(): string {
    return this._logout_url;
  }

  get signup_url(): string {
    return this._signup_url;
  }

  get whoami_url(): string {
    return this._whoami_url;
  }

  get get_notifications_url(): string {
    return this._get_notifications_url;
  }

  get delete_user_url(): string {
    return this._delete_user_url;
  }

  get get_user_by_id_url(): string {
    return this._get_user_by_id_url;
  }

  get search_users_by_term_url(): string {
    return this._search_users_by_term_url;
  }

  get create_admin_url(): string {
    return this._create_admin_url;
  }

  get delete_notification_url(): string {
    return this._delete_notification_url;
  }

  get get_all_users_url(): string {
    return this._get_all_users_url;
  }

  get activate_owner_url(): string {
    return this._activate_owner_url;
  }

  get reg_as_owner_url(): string {
    return this._reg_as_owner_url;
  }

  get get_history_url(): string {
    return this._get_history_url;
  }

  get update_user_url(): string {
    return this._update_user_url;
  }

  get closest_areas_url(): string {
    return this._closest_areas_url;
  }

  get add_parking_url(): string {
    return this._add_parking_url;
  }

  get get_by_owner_url(): string {
    return this._get_by_owner_url;
  }

  get get_parking_by_id_url(): string {
    return this._get_parking_by_id_url;
  }

  get make_reservation_url(): string {
    return this._make_reservation_url;
  }

  get get_parking_by_employee_id_url(): string {
    return this._get_parking_by_employee_id_url;
  }

  get edit_parking_url(): string {
    return this._edit_parking_url;
  }

  get delete_parking_url(): string {
    return this._delete_parking_url;
  }

  get add_lots_url(): string {
    return this._add_lots_url;
  }

  get remove_lots_url(): string {
    return this._remove_lots_url;
  }

  get add_employee_to_parking_url(): string {
    return this._add_employee_to_parking_url;
  }

  get remove_employee_from_parking_url(): string {
    return this._remove_employee_from_parking_url;
  }

  get search_parkings_by_term(): string {
    return this._search_parkings_by_term;
  }

  get get_all_parkings_url(): string {
    return this._get_all_parkings_url;
  }

  get get_parkings_by_term_owner_url(): string {
    return this._get_parkings_by_term_owner_url;
  }

  get save_employee_url(): string {
    return this._save_employee_url;
  }

  get get_employees_by_owner_url(): string {
    return this._get_employees_by_owner_url;
  }

  get get_employee_by_id_url(): string {
    return this._get_employee_by_id_url;
  }

  get search_employee_by_term_url(): string {
    return this._search_employee_by_term_url;
  }

  get update_employee_url(): string {
    return this._update_employee_url;
  }

  get delete_employee_url(): string {
    return this._delete_employee_url;
  }

  get get_user_reservations_url(): string {
    return this._get_user_reservations_url;
  }

  get cancel_reservation_url(): string {
    return this._cancel_reservation_url;
  }

  get get_reservation_by_name_url(): string {
    return this._get_reservation_by_name_url;
  }

  get get_today_reservations_emp_url(): string {
    return this._get_today_reservations_emp_url;
  }

  get set_lot_vacant_url(): string {
    return this._set_lot_vacant_url;
  }

  get set_lot_occupied_url(): string {
    return this._set_lot_occupied_url;
  }

  get get_lot_by_parking_and_number_url(): string {
    return this._get_lot_by_parking_and_number_url;
  }

  get get_reservations_by_parking_and_lot_url(): string {
    return this._get_reservations_by_parking_and_lot_url;
  }

  get save_message_url(): string {
    return this._save_message_url;
  }

  get get_all_messages_url(): string {
    return this._get_all_messages_url;
  }

  get delete_message_url(): string {
    return this._delete_message_url;
  }

  get check_available_lots_url(): string {
    return this._check_available_lots_url;
  }

  get get_available_lots_url(): string {
    return this._get_available_lots_url;
  }

  get get_lots_per_parking_url(): string {
    return this._get_lots_per_parking_url;
  }
}
