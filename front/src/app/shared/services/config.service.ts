import {Injectable} from "@angular/core";
@Injectable()
export class ConfigService {

  private _api_url = '/api';
  private _refresh_token_url = this._api_url + '/refresh';
  private _login_url = this._api_url + '/login';
  private _logout_url = this._api_url + '/logout';
  private _change_password_url = this._api_url + '/changePassword';
  private _user_url = this._api_url + '/users';
  private _users_url = this._user_url + '/all';
  private _reset_credentials_url = this._user_url + '/reset-credentials';
  private _foo_url = this._api_url + '/foo';
  private _signup_url = this._api_url + '/signup';
  private _whoami_url = this._api_url + '/whoami';
  private _closest_areas_url = this.api_url + '/parkings/getClosest';
  private _reg_as_owner_url = this.api_url + '/registerAsOwner';
  private _add_parking_url = this.api_url + '/parkings/add';
  private _get_by_owner_url = this.api_url + '/parkings/getByOwner';
  private _get_parking_by_id_url = this.api_url + '/parkings/getById';
  private _make_reservation_url = this.api_url + '/parkings/addReservation';
  private _save_employee_url = this.api_url + '/employees/create';
  private _get_employees_by_owner_url = this.api_url + '/employees/getByOwner';
  private _get_employee_by_id_url = this.api_url + '/employees/getById';
  private _get_parking_by_employee_id_url = this.api_url + '/parkings/getByEmployee';
  private _edit_parking_url = this.api_url + '/parkings/update';
  private _delete_parking_url = this.api_url + '/parkings/deleteParking';
  private _add_lots_url = this.api_url + '/parkings/addLots';
  private _remove_lots_url = this.api_url + '/parkings/removeLots';
  private _search_employee_by_term_url = this.api_url + '/employees/getByTerm';
  private _add_employee_to_parking_url = this.api_url + '/parkings/addEmployee';
  private _remove_employee_from_parking_url = this.api_url + '/parkings/removeEmployee';
  private _update_employee_url = this.api_url + '/employees/update';
  private _delete_employee_url = this.api_url + '/employees/delete';
  private _get_user_reservations_url = this.api_url + '/reservations/getUserReservations';
  private _cancel_reservation_url = this.api_url + '/reservations/cancel';
  private _set_lot_vacant_url = this.api_url + '/lots/setVacant';
  private _set_lot_occupied_url = this.api_url + '/lots/setOccupied';
  private _get_reservation_by_name_url = this.api_url + '/reservations/findByUserNames';
  private _get_today_reservations_emp_url = this.api_url + '/reservations/getForParking';
  private _get_notifications_url = this.api_url + '/getNotifications';
  private _delete_user_url = this.api_url + '/users/deleteUser';
  private _get_user_by_id_url = this.api_url + '/users/getById';
  private _search_users_by_term_url = this.api_url + '/users/searchByTerm';
  private _create_admin_url = this.api_url + '/createAdmin';
  private _delete_notification_url = this.api_url + '/deleteNotification';
  private _activate_owner_url = this.api_url + '/activateOwner';
  private _search_parkings_by_term = this.api_url + '/parkings/searchByTerm';
  private _get_all_parkings_url = this.api_url + '/parkings/all';
  private _get_history_url = this.api_url + '/users/getHistory';
  private _get_parkings_by_term_owner_url = this.api_url + '/parkings/searchByTermAndOwner';
  private _update_user_url = this.api_url + '/users/update';

  get api_url(): string {
    return this._api_url;
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

  get change_password_url(): string {
    return this._change_password_url;
  }

  get user_url(): string {
    return this._user_url;
  }

  get users_url(): string {
    return this._users_url;
  }

  get reset_credentials_url(): string {
    return this._reset_credentials_url;
  }

  get foo_url(): string {
    return this._foo_url;
  }

  get signup_url(): string {
    return this._signup_url;
  }

  get whoami_url(): string {
    return this._whoami_url;
  }

  get closest_areas_url(): string {
    return this._closest_areas_url;
  }

  get reg_as_owner_url(): string {
    return this._reg_as_owner_url;
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

  get save_employee_url(): string {
    return this._save_employee_url;
  }

  get get_employees_by_owner_url(): string {
    return this._get_employees_by_owner_url;
  }

  get get_employee_by_id_url(): string {
    return this._get_employee_by_id_url;
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

  get search_employee_by_term_url(): string {
    return this._search_employee_by_term_url;
  }

  get add_employee_to_parking_url(): string {
    return this._add_employee_to_parking_url;
  }

  get remove_employee_from_parking_url(): string {
    return this._remove_employee_from_parking_url;
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

  get set_lot_vacant_url(): string {
    return this._set_lot_vacant_url;
  }

  get set_lot_occupied_url(): string {
    return this._set_lot_occupied_url;
  }

  get get_reservation_by_name_url(): string {
    return this._get_reservation_by_name_url;
  }

  get get_today_reservations_emp_url(): string {
    return this._get_today_reservations_emp_url;
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

  get activate_owner_url(): string {
    return this._activate_owner_url;
  }

  get search_parkings_by_term(): string {
    return this._search_parkings_by_term;
  }

  get get_all_parkings_url(): string {
    return this._get_all_parkings_url;
  }

  get get_history_url(): string {
    return this._get_history_url;
  }

  get get_parkings_by_term_owner_url(): string {
    return this._get_parkings_by_term_owner_url;
  }

  get update_user_url(): string {
    return this._update_user_url;
  }
}
