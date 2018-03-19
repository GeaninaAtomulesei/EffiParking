import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {ConfigService} from "./config.service";
import {HttpHeaders} from "@angular/common/http";
import {Response} from "@angular/http";
import {HttpResponse} from "@angular/common/http";

@Injectable()
export class UserService {

  currentUser;

  constructor(private apiService: ApiService,
              private config: ConfigService) {
  }

  initUser() {
    //noinspection TypeScriptUnresolvedFunction
    const promise = this.apiService.get(this.config.refresh_token_url).toPromise()
      .then(res => {
        if (res.access_token !== null) {
          localStorage.setItem("access_token", res.access_token);
          //noinspection TypeScriptUnresolvedFunction
          return this.getMyInfo().toPromise()
            .then(user => {
              this.currentUser = user;
            });
        }
      })
      .catch(() => null);
    return promise;
  }

  resetCredentials() {
    return this.apiService.get(this.config.reset_credentials_url);
  }

  getMyInfo() {
    return this.apiService.get(this.config.whoami_url).map(user => {
      this.currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
    });
  }

  getAll() {
    return this.apiService.get(this.config.users_url);
  }

  registerAsOwner(id, organisation) {
    return this.apiService.post(this.config.reg_as_owner_url + "?id=" + id, organisation)
      .map(res => {
        return res;
      })
  }

  addNewEmployee(employee, ownerId) {
    return this.apiService.post(this.config.save_employee_url + "?ownerId=" + ownerId, JSON.stringify(employee)).map(res => {
      console.log("Add Employee Success");
      return res;
    });
  }

  createNewAdmin(admin) {
    return this.apiService.post(this.config.create_admin_url, JSON.stringify(admin))
      .map(res => {
        console.log("Create Admin Success");
        return res;
      });
  }

  getEmployeesByOwner(ownerId) {
    return this.apiService.get(this.config.get_employees_by_owner_url + "?ownerId=" + ownerId)
      .map(res => {
        return res;
      });
  }

  getEmployeeById(employeeId) {
    return this.apiService.get(this.config.get_employee_by_id_url + "?employeeId=" + employeeId)
      .map(res => {
        return res;
      });
  }

  getEmployeeByTerm(ownerId, term) {
    return this.apiService.get(this.config.search_employee_by_term_url + "?ownerId=" + ownerId + "&term=" + term)
      .map(res => {
        return res;
      });
  }

  updateEmployee(employee, employeeId) {
    return this.apiService.put(this.config.update_employee_url + "?employeeId=" + employeeId, employee)
      .map(res => {
        return res;
      });
  }

  deleteEmployee(employeeId) {
    return this.apiService.delete(this.config.delete_employee_url + "?employeeId=" + employeeId)
      .map(res => {
        return res;
      });
  }

  getNotifications(userId) {
    return this.apiService.get(this.config.get_notifications_url + "?userId=" + userId)
      .map(res => {
        return res;
      });
  }

  deleteUser(userId) {
    return this.apiService.delete(this.config.delete_user_url + "?userId=" + userId)
      .map(res => {
        return res;
      })
  }

  getById(userId) {
    return this.apiService.get(this.config.get_user_by_id_url + "?userId=" + userId)
      .map(res => {
        return res;
      });
  }

  searchByTerm(term) {
    return this.apiService.get(this.config.search_users_by_term_url + "?term=" + term)
      .map(res => {
        return res;
      });
  }

  deleteNotification(notificationId) {
    return this.apiService.delete(this.config.delete_notification_url + "?notificationId=" + notificationId)
      .map(res => {
        return res;
      });
  }

  activateOwner(userId, organisation) {
    return this.apiService.put(this.config.activate_owner_url + "?userId=" + userId + "&organisation=" + organisation)
      .map(res => {
        return res;
      })
  }

  getHistory(userId) {
    return this.apiService.get(this.config.get_history_url + "?userId=" + userId)
      .map(res => {
        return res;
      });
  }

  updateUser(user, userId) {
    return this.apiService.put(this.config.update_user_url + "?userId=" + userId, user)
      .map(res => {
        return res;
      });
  }
}
