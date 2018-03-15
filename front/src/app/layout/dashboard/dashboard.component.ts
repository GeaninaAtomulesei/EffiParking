import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ParkingService} from "../../shared/services/parking.service";
import {DisplayMessage} from "../../shared/models/display-message";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import 'rxjs/add/operator/delay';
import {ModalDismissReasons} from "@ng-bootstrap/ng-bootstrap";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
  public sliders: Array<any> = [];
  private currentUser;
  private currentLatitude;
  private currentLongitude;
  private closestParkingAreas = [];
  private foundParkingAreas = [];
  private error: string;
  submitted = false;
  notification: DisplayMessage;
  ownerForm: FormGroup;
  searchForm: FormGroup;
  title: string = "Owner Registration Success";
  text: string = "You have successfully sent your owner registration request!";
  searchTrigger = false;
  searchByTermTrigger = false;

  constructor(private parkingService: ParkingService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private modalService: NgbModal) {

    this.sliders.push(
      {
        imagePath: 'assets/images/slider1.jpg',
        label: 'First slide label',
        text: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
      },
      {
        imagePath: 'assets/images/slider2.jpg',
        label: 'Second slide label',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      {
        imagePath: 'assets/images/slider3.jpg',
        label: 'Third slide label',
        text: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
      }
    );

  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if(localStorage.getItem("closestParkingAreas")) {
      this.closestParkingAreas = JSON.parse(localStorage.getItem("closestParkingAreas"));
    }

    if(localStorage.getItem("dashFoundParkingAreas")) {
      this.foundParkingAreas = JSON.parse(localStorage.getItem("dashFoundParkingAreas"));
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
        console.log("lat: " + latitude + " lng: " + longitude);
        localStorage.setItem("currentLatitude", latitude.toString());
        localStorage.setItem("currentLongitude", longitude.toString());
      });
    }

    //noinspection TypeScriptUnresolvedFunction
    this.currentLatitude = parseFloat(localStorage.getItem("currentLatitude"));
    this.currentLongitude = parseFloat(localStorage.getItem("currentLongitude"));
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getClosest(this.currentLatitude, this.currentLongitude)
      .subscribe(parkings => {
          this.closestParkingAreas = parkings;
          localStorage.setItem("closestParkingAreas", JSON.stringify(this.closestParkingAreas));
          console.log("p areas: " + this.closestParkingAreas);
        },
        error => {
          console.log(error);
          this.error = error.error;
        });
    this.searchTrigger = true;
  }

  searchByTerm() {
    this.searchByTermTrigger = true;
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.searchByTerm(this.searchForm.value.term)
      .delay(1000)
      .subscribe(response => {
        if(response) {
          this.foundParkingAreas = response;
          localStorage.setItem("dashFoundParkingAreas", JSON.stringify(this.foundParkingAreas));
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
            document.getElementById('modalCont').click();
          }
        },
        error => {
          this.submitted = false;
          console.log("Registration error " + JSON.stringify(error));
          this.notification = {msgType: 'error', msgBody: error['error'].errorMessage};
        });
  }

  closeAlert() {
    this.error = null;
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {

    }, (reason) => {

    });
  }

}
