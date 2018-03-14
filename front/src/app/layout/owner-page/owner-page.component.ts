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
  selector: 'app-owner-page',
  templateUrl: './owner-page.component.html',
  styleUrls: ['./owner-page.component.scss'],
  animations: [routerTransition()]
})
export class OwnerPageComponent implements OnInit {

  private ownedParkingAreas: any[];
  private registeredEmployees: any[];
  private addNewTrigger: boolean = false;
  private addNewEmployeeTrigger: boolean = false;
  addParkingAreaForm: FormGroup;
  addEmployeeForm: FormGroup;
  submitted = false;
  notification: DisplayMessage;
  closeResult: string;
  private currentUser;
  title: string = "Parking Area Add Success";
  text: string = "You have successfully added a new parking area!";
  currentLat: number;
  currentLng: number;
  error: any;

  constructor(private parkingService: ParkingService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.currentLat = parseFloat(sessionStorage.getItem("currentLatitude"));
    this.currentLng = parseFloat(sessionStorage.getItem("currentLongitude"));

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

    this.addEmployeeForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64), Validators.email])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
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

    //noinspection TypeScriptUnresolvedFunction
    this.userService.getEmployeesByOwner(this.currentUser.id)
      .subscribe(employees => {
        this.registeredEmployees = employees;
        console.log("employees: " + this.registeredEmployees);
      },
      error => {
        console.log(error);
        this.error = error.error;
      });
  }

  onSetCoordinates() {
    this.addParkingAreaForm.get("latitude").setValue(this.currentLat);
    this.addParkingAreaForm.get("longitude").setValue(this.currentLng);
  }

  onAddNew() {
    this.addNewEmployeeTrigger = false;
    this.addNewTrigger = !this.addNewTrigger;
  }

  onAddEmployee() {
    this.addNewTrigger = false;
    this.addNewEmployeeTrigger = !this.addNewEmployeeTrigger;
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
            this.addParkingAreaForm.reset();
            document.getElementById('modalCont').click();
          }
        },
        error => {
          this.submitted = false;
          console.log("Registration error " + JSON.stringify(error));
          this.notification = {msgType: 'error', msgBody: error['error'].errorMessage};
        });
  }

  onSubmitNewEmployee() {
    this.notification = undefined;
    this.submitted = true;

    //noinspection TypeScriptUnresolvedFunction
    this.userService.addNewEmployee(this.addEmployeeForm.value, this.currentUser.id)
      .delay(1000)
      .subscribe(res => {
        console.log(res);
        if(res) {
          this.title = "Employee Registration Success";
          this.text = "You have successfully added a new user!";
          this.addEmployeeForm.reset();
          document.getElementById('modalCont').click();
        }
      },
      error => {
        this.submitted = false;
        console.log("Add Employee Error " + JSON.stringify(error));
        this.notification = {msgType: 'error', msgBody: error['error'].errorMessage};
      });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      window.location.reload();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      window.location.reload();
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
