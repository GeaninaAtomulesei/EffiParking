import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from "../../../shared/services/user.service";
import {AuthService} from "../../../shared/services/auth.service";
import {AppConstants} from "../../../shared/constants";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [AuthService, UserService]
})
export class HeaderComponent implements OnInit {
  pushRightClass: string = 'push-right';
  currentUser: any;
  notifications: any = [];

  constructor(private translate: TranslateService,
              public router: Router,
              private userService: UserService,
              private authService: AuthService) {

    this.translate.addLangs(['en', 'fr', 'es', 'it', 'de']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|es|it|de/) ? browserLang : 'en');

    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });

    setInterval(() => {
      this.getNotifications();
    }, 60000);

  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));
    this.getNotifications();
  }

  getNotifications() {
    if(this.currentUser) {
      //noinspection TypeScriptUnresolvedFunction
      this.userService.getNotifications(this.currentUser.id)
        .subscribe(notifications => {
          if (notifications) {
            this.notifications = notifications;
          }
        }, error => {
          console.log(error);
        });
    }
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  onLoggedOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.authService.logout();
  }

  onLogIn() {
    this.router.navigate(['/login']);
  }

  changeLang(language: string) {
    this.translate.use(language);
  }
}
