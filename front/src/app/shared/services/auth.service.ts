import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {UserService} from "./user.service";
import {ConfigService} from "./config.service";
import {HttpHeaders} from "@angular/common/http";

@Injectable()
export class AuthService {

  constructor(private apiService: ApiService,
              private userService: UserService,
              private config: ConfigService) {
  }

  login(user) {
    localStorage.clear();
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = `username=${user.username}&password=${user.password}`;
    //noinspection TypeScriptUnresolvedFunction
    return this.apiService.post(this.config.login_url, body, loginHeaders)
      .map(response => {
        console.log("Login success");
        localStorage.setItem("access_token", response.access_token);
        //noinspection TypeScriptUnresolvedFunction
        this.userService.getMyInfo().subscribe();
      })
  }

  signUp(user) {
    const signUpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    return this.apiService.post(this.config.signup_url, JSON.stringify(user), signUpHeaders).map(() => {
      console.log("Sign up success");
    });
  }

  logout() {
    return this.apiService.post(this.config.logout_url, {})
      .map(() => {
        this.userService.currentUser = null;
        localStorage.clear();
      });
  }

  changePassword(passwordChanger) {
    return this.apiService.post(this.config.change_password_url, passwordChanger)
      .map(response => {
        return response;
      });
  }
}
