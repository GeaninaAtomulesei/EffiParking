import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ParkingService} from "../../shared/services/parking.service";
import {DisplayMessage} from "../../shared/models/display-message";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import 'rxjs/add/operator/delay';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppConstants} from "../../shared/constants";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
  public sliders: Array<any> = [];
   currentUser;
   currentLatitude;
   currentLongitude;
   closestParkingAreas = [];
   foundParkingAreas = [];
   error: string;
   submitted = false;
   notification: DisplayMessage;
   ownerForm: FormGroup;
   searchForm: FormGroup;
   title: string;
   text: string;
   searchTrigger = false;
   searchByTermTrigger = false;

  constructor(private parkingService: ParkingService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private translate: TranslateService,
              private modalService: NgbModal) {

    this.translate.addLangs(['en', 'fr', 'es', 'it', 'de']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|es|it|de/) ? browserLang : 'en');

    this.sliders.push(
      {
        imagePath: 'assets/images/slider1.jpg',
        label: 'Reduce parking search time',
        text: 'Receive broadcasted real-time parking information based on parking availability in areas nearby.'
      },
      {
        imagePath: 'assets/images/slider2.jpg',
        label: 'Make a reservation',
        text: 'Reserve your desired parking space for and in between any period of time.'
      },
      {
        imagePath: 'assets/images/slider3.jpg',
        label: 'Get guided',
        text: 'Use the GMaps guidance system in order to reach your parking area.'
      }
    );
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));

    if (localStorage.getItem(AppConstants.CLOSEST_PARKINGS)) {
      this.closestParkingAreas = JSON.parse(localStorage.getItem(AppConstants.CLOSEST_PARKINGS));
    }

    if (localStorage.getItem(AppConstants.FOUND_PARKINGS)) {
      this.foundParkingAreas = JSON.parse(localStorage.getItem(AppConstants.FOUND_PARKINGS));
    }

    this.ownerForm = this.formBuilder.group({
      organisation: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])]
    });

    this.searchForm = this.formBuilder.group({
      term: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])]
    });
  }

  search() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        localStorage.setItem(AppConstants.CURRENT_LAT, latitude.toString());
        localStorage.setItem(AppConstants.CURRENT_LNG, longitude.toString());
      });
    }

    //noinspection TypeScriptUnresolvedFunction
    this.currentLatitude = parseFloat(localStorage.getItem(AppConstants.CURRENT_LAT));
    this.currentLongitude = parseFloat(localStorage.getItem(AppConstants.CURRENT_LNG));
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getClosest(this.currentLatitude, this.currentLongitude)
      .subscribe(parkings => {
          this.closestParkingAreas = parkings;
          this.searchTrigger = true;
          localStorage.setItem(AppConstants.CLOSEST_PARKINGS, JSON.stringify(this.closestParkingAreas));
        },
        error => {
          console.log(error);
          this.error = error.error;
        });
  }

  searchByTerm() {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.searchByTerm(this.searchForm.value.term)
      .delay(1000)
      .subscribe(response => {
        if (response) {
          this.foundParkingAreas = response;
          this.searchByTermTrigger = true;
          localStorage.setItem(AppConstants.FOUND_PARKINGS, JSON.stringify(this.foundParkingAreas));
        }
      }, error => {
        console.log(error);
        this.error = error;
      });
  }

  ownerReqSubmit() {
    this.notification = undefined;
    this.submitted = true;
    //noinspection TypeScriptUnresolvedFunction
    this.userService.registerAsOwner(this.currentUser.id, this.ownerForm.value.organisation)
      .delay(1000)
      .subscribe(res => {
          console.log(JSON.parse(res));
          if (res) {
            this.title = AppConstants.SUCCESS_TITLE;
            this.text = AppConstants.OWNER_REQUEST_TEXT;
            document.getElementById(AppConstants.MODAL_CONTENT).click();
          }
        },
        error => {
          this.submitted = false;
          this.notification = {msgType: 'error', msgBody: error['error'].errorMessage};
        });
  }

  closeAlert() {
    this.error = null;
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      return;
    }, (reason) => {
      return;
    });
  }

}
