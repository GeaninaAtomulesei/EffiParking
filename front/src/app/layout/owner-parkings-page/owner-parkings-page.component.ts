import {Component, OnInit} from '@angular/core';
import {routerTransition} from "../../router.animations";
import {ParkingService} from "../../shared/services/parking.service";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import {DisplayMessage} from "../../shared/models/display-message";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppConstants} from "../../shared/constants";

@Component({
  selector: 'app-owner-parkings-page',
  templateUrl: './owner-parkings-page.component.html',
  styleUrls: ['./owner-parkings-page.component.scss'],
  animations: [routerTransition()]
})
export class OwnerParkingsPageComponent implements OnInit {

   ownedParkingAreas: any[];
   addNewTrigger: boolean = false;
   addParkingAreaForm: FormGroup;
   submitted = false;
   notification: DisplayMessage;
   currentUser;
   title: string;
   text: string;
   error: any;
   foundParkingsTrigger: boolean = false;
   searchTerm: string;
   foundParkings: any = [];
   returnTrigger: boolean = false;

  constructor(private parkingService: ParkingService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));

    this.addParkingAreaForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      totalLots: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      locationName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      city: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      street: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      number: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      latitude: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])],
      longitude: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])]
    });

    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getByOwner(this.currentUser.username)
      .subscribe(parkings => {
          this.ownedParkingAreas = parkings;
        },
        error => {
          console.log(error);
          this.error = error.error;
        });
  }

  onSetCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.addParkingAreaForm.get("latitude").setValue(position.coords.latitude);
        this.addParkingAreaForm.get("longitude").setValue(position.coords.longitude);
      });
    }
  }

  onAddNew() {
    this.addNewTrigger = !this.addNewTrigger;
  }

  onSearchParking() {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.searchByTermAndOwner(this.searchTerm, this.currentUser.id)
      .subscribe(response => {
        if(response) {
          this.foundParkings = response;
          this.foundParkingsTrigger = true;
        }
      }, error => {
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.returnTrigger = true;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      })
  }

  onSubmit() {
    this.notification = undefined;
    if(this.addParkingAreaForm.pristine) {
      this.notification = {msgType: 'error', msgBody: AppConstants.PRISTINE_FORM};
      return;
    }
    if(this.addParkingAreaForm.get('name').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PARKING_NAME};
      return;
    }
    if(this.addParkingAreaForm.get('totalLots').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PARKING_LOTS};
      return;
    }
    if(this.addParkingAreaForm.get('locationName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PARKING_LOCATION};
      return;
    }
    if(this.addParkingAreaForm.get('city').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PARKING_CITY};
      return;
    }
    if(this.addParkingAreaForm.get('street').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PARKING_STREET};
      return;
    }
    if(this.addParkingAreaForm.get('number').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PARKING_NUMBER};
      return;
    }
    if(this.addParkingAreaForm.get('latitude').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_LATITUDE};
      return;
    }
    if(this.addParkingAreaForm.get('longitude').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_LONGITUDE};
      return;
    }
    this.submitted = true;
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.addNewParkingArea(this.addParkingAreaForm.value, this.currentUser.username)
      .delay(1000)
      .subscribe(res => {
          if (res) {
            this.title = AppConstants.SUCCESS_TITLE;
            this.text = AppConstants.ADD_PARKING_TEXT;
            this.addParkingAreaForm.reset();
            document.getElementById(AppConstants.MODAL_CONTENT).click();
          }
        },
        error => {
          this.title = AppConstants.ERROR_TITLE;
          this.text = AppConstants.ERROR_TEXT;
          this.returnTrigger = true;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if(this.returnTrigger) {
        return;
      } else {
        window.location.reload();
      }
    }, (reason) => {
      return;
    });
  }
}
