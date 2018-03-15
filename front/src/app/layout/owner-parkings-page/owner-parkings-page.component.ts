import {Component, OnInit} from '@angular/core';
import {routerTransition} from "../../router.animations";
import {ParkingService} from "../../shared/services/parking.service";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import {DisplayMessage} from "../../shared/models/display-message";
import {ModalDismissReasons} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-owner-parkings-page',
  templateUrl: './owner-parkings-page.component.html',
  styleUrls: ['./owner-parkings-page.component.scss'],
  animations: [routerTransition()]
})
export class OwnerParkingsPageComponent implements OnInit {

  private ownedParkingAreas: any[];
  private addNewTrigger: boolean = false;
  addParkingAreaForm: FormGroup;
  submitted = false;
  notification: DisplayMessage;
  private currentUser;
  title: string;
  text: string;
  error: any;
  private foundParkingsTrigger: boolean = false;
  private searchTerm: string;
  private foundParkings: any = [];
  private returnTrigger: boolean = false;

  constructor(private parkingService: ParkingService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    this.addParkingAreaForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      totalLots: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      locationName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      city: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      street: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      number: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      latitude: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      longitude: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])]
    });

    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getByOwner(this.currentUser.username)
      .subscribe(parkings => {
          this.ownedParkingAreas = parkings;
          console.log("p areas: " + this.ownedParkingAreas);
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
        this.title = "Search Parking Error";
        this.text = "An unexpected error occurred. Please try again!";
        this.returnTrigger = true;
        document.getElementById('modalCont').click();
      })
  }

  onSubmit() {
    this.notification = undefined;
    this.submitted = true;
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.addNewParkingArea(this.addParkingAreaForm.value, this.currentUser.username)
      .delay(1000)
      .subscribe(res => {
          console.log(res);
          if (res) {
            this.title = "Parking Area Add Success";
            this.text = "You have successfully added a new parking area!";
            this.addParkingAreaForm.reset();
            document.getElementById('modalCont').click();
          }
        },
        error => {
          this.title = "Search Parking Error";
          this.text = "An unexpected error occurred. Please try again!";
          this.returnTrigger = true;
          document.getElementById('modalCont').click();
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
