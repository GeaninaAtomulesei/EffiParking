import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ParkingService} from "../../../shared/services/parking.service";
import {AppConstants} from "../../../shared/constants";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [ParkingService]
})
export class SidebarComponent {
  isActive: boolean = false;
  showMenu: string = '';
  pushRightClass: string = 'push-right';
  currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));
  isOwner: boolean = false;
  isEmployee: boolean = false;
  assignedParkingAreas = [];
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private translate: TranslateService, public router: Router,
              private parkingService: ParkingService) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');

    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });

    if (this.currentUser) {
      if (this.currentUser.authorities) {
        this.currentUser.authorities.forEach(auth => {
          if (auth.authority == AppConstants.OWNER_ROLE) {
            this.isOwner = true;
          } else if (auth.authority == AppConstants.EMPLOYEE_ROLE) {
            this.isEmployee = true;
          } else if(auth.authority == AppConstants.ADMIN_ROLE) {
            this.isAdmin = true;
          }
        });
      }
    }

    if(this.isEmployee) {
      //noinspection TypeScriptUnresolvedFunction
      this.parkingService.getByEmployee(this.currentUser.id)
        .subscribe(pAreas => {
          if(pAreas) {
            this.assignedParkingAreas = pAreas;
          }
        }, error => {
          console.log(error);
        });
    }

    if(localStorage.getItem(AppConstants.LOGGED_IN)) {
      this.isLoggedIn = true;
    }
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
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

  changeLang(language: string) {
    this.translate.use(language);
  }

  onLoggedout() {
    localStorage.removeItem(AppConstants.LOGGED_IN);
  }
}
