import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {OnDestroy} from "@angular/core";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {DisplayMessage} from "../../shared/models/display-message";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-parking-page',
  templateUrl: './parking-page.component.html',
  styleUrls: ['./parking-page.component.scss'],
  animations: [routerTransition()]
})
export class ParkingPageComponent implements OnInit, OnDestroy {
  private sub: any;
  id: number;
  parking: any;
  currentUser: any;
  isOwner: boolean = false;
  isAdmin: boolean = false;
  currentLat: number;
  currentLng: number;
  startDate: any;
  startTime: any;
  endDate: any;
  endTime: any;
  reservation: any;
  showReservationForm: boolean = false;
  reservedLotId: number;
  notification: DisplayMessage;
  title: string;
  text: string;
  minDate: NgbDateStruct;
  editTrigger: boolean = false;
  editParkingAreaForm: FormGroup;
  addLotsForm: FormGroup;
  removeLotsForm: FormGroup;
  searchEmployeeForm: FormGroup;
  submitted = false;
  closeButton = false;
  okButton = false;
  addLotsTrigger = false;
  removeLotsTrigger = false;
  addEmployeeTrigger = false;
  searchEmployeesResult = [];
  searchTrigger = false;
  returnTrigger = false;
  resSuccessTrigger = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private parkingService: ParkingService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private ngbDateFormatter: NgbDateParserFormatter,
              private modalService: NgbModal) {
    let date = new Date();
    this.minDate = {year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate()};
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      console.log(this.id);
    });
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getById(this.id).subscribe(parking => {
      this.parking = parking;
      if (this.currentUser.id == this.parking.owner.id) {
        this.isOwner = true;
      }
      if(this.currentUser.authorities[0].authority == "ROLE_ADMIN") {
        this.isAdmin = true;
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.longitude;
      });
    }

    this.editParkingAreaForm = this.formBuilder.group({
      name: [''],
      locationName: [''],
      city: [''],
      street: [''],
      number: [''],
      latitude: [''],
      longitude: ['']
    });

    this.addLotsForm = this.formBuilder.group({
      numberOfAddedLots: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])]
    });

    this.removeLotsForm = this.formBuilder.group({
      numberOfRemovedLots: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])]
    });

    this.searchEmployeeForm = this.formBuilder.group({
      term: ['', Validators.compose([Validators.required])]
    });
  }

  showForm() {
    if(localStorage.getItem("isLoggedIn")) {
      this.showReservationForm = !this.showReservationForm;
    } else {
      this.title = "Not Permitted";
      this.text = "You have to be logged in to make a reservation!";
      this.okButton = true;
      this.closeButton = false;
      this.returnTrigger = true;
      document.getElementById('modalCont').click();
    }

  }

  submitReservation() {
    this.notification = undefined;
    let sd = this.ngbDateFormatter.format(this.startDate);
    let ed = this.ngbDateFormatter.format(this.endDate);
    let sth, stm, eth, etm;

    let currentTime = new Date();
    if (this.startDate.year == this.minDate.year && this.startDate.month == this.minDate.month && this.startDate.day == this.minDate.day) {
      if (currentTime.getHours() > this.startTime.hour) {
        this.title = "Incorrect Time Value";
        this.text = "You cannot set a time in the past for your reservation!";
        this.returnTrigger = true;
        this.closeButton = false;
        this.okButton = true;
        document.getElementById('modalCont').click();
        return;
      } else if (currentTime.getHours() == this.startTime.hour) {
        if (currentTime.getMinutes() > this.startTime.minute) {
          this.title = "Incorrect Time Value";
          this.text = "You cannot set a time in the past for your reservation!";
          this.returnTrigger = true;
          document.getElementById('modalCont').click();
          return;
        }
      }
    }

    if (this.startTime.hour > this.endTime.hour) {
      this.title = "Incorrect Time Value";
      this.text = "Your leaving time is before your start time!";
      this.returnTrigger = true;
      document.getElementById('modalCont').click();
      return;
    } else if (this.startTime.hour == this.endTime.hour) {
      if (this.startTime.minute > this.endTime.minute) {
        this.title = "Incorrect Time Value";
        this.text = "Your leaving time is before your start time!";
        this.returnTrigger = true;
        document.getElementById('modalCont').click();
        return;
      }
    }

    if (this.startTime.hour.toString().length == 1) {
      sth = "0" + this.startTime.hour.toString();
    } else {
      sth = this.startTime.hour.toString();
    }

    if (this.startTime.minute.toString().length == 1) {
      stm = "0" + this.startTime.minute.toString();
    } else {
      stm = this.startTime.minute.toString();
    }

    if (this.endTime.hour.toString().length == 1) {
      eth = "0" + this.endTime.hour.toString();
    } else {
      eth = this.endTime.hour.toString();
    }

    if (this.endTime.minute.toString().length == 1) {
      etm = "0" + this.endTime.minute.toString();
    } else {
      etm = this.endTime.minute.toString();
    }

    let resStartTime = sd + "T" + sth + ":" + stm;
    let resEndTime = ed + "T" + eth + ":" + etm;

    let reservation = {
      "startDate": resStartTime,
      "endDate": resEndTime
    };

    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.makeReservation(reservation, this.id, this.currentUser.username)
      .subscribe(res => {
          if (res) {
            this.reservedLotId = res;
            this.title = "Reservation Success";
            this.text = "You have successfully reserved lot number " + this.reservedLotId + " !";
            this.returnTrigger = false;
            this.okButton = true;
            this.closeButton = false;
            this.resSuccessTrigger = true;
            document.getElementById('modalCont').click();
          }
        },
        error => {
          console.log("Submit error " + JSON.stringify(error));
          this.title = "Reservation Error";
          this.text = "An unexpected error occurred. Please try again!";
          this.returnTrigger = true;
          this.okButton = true;
          document.getElementById('modalCont').click();
        })
  }

  onEdit() {
    this.editTrigger = !this.editTrigger;
    this.removeLotsTrigger = false;
    this.addLotsTrigger = false;
  }

  onAddLots() {
    this.removeLotsTrigger = false;
    this.editTrigger = false;
    this.addLotsTrigger = !this.addLotsTrigger;
  }

  onRemoveLots() {
    this.addLotsTrigger = false;
    this.editTrigger = false;
    this.removeLotsTrigger = !this.removeLotsTrigger;
  }

  onAddEmployee() {
    this.addLotsTrigger = false;
    this.editTrigger = false;
    this.removeLotsTrigger = false;
    this.addEmployeeTrigger = !this.addEmployeeTrigger;
  }

  onSubmitEditForm() {
    this.submitted = true;
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.editParkingArea(this.id, this.editParkingAreaForm.value)
      .delay(1000)
      .subscribe(res => {
          console.log(res);
          if (res) {
            this.editParkingAreaForm.reset();
            this.title = "Update Success";
            this.text = "You have successfully updated the parking area!";
            this.closeButton = true;
            this.returnTrigger = false;
            document.getElementById('modalCont').click();
          }
        },
        error => {
          this.submitted = false;
          console.log("Update error " + JSON.stringify(error));
          this.title = "Update Error";
          this.text = "An unexpected error occurred. Please try again!";
          this.okButton = true;
          this.returnTrigger = true;
          document.getElementById('modalCont').click();
        });
  }

  onSearchEmployeeSubmit() {
    this.submitted = true;
    //noinspection TypeScriptUnresolvedFunction
    this.userService.getEmployeeByTerm(this.currentUser.id, this.searchEmployeeForm.value.term)
      .subscribe(res => {
        if(res) {
          this.searchEmployeeForm.reset();
          this.searchEmployeesResult = res;
          this.searchTrigger = true;
          localStorage.setItem("foundEmployees", JSON.stringify(this.searchEmployeesResult));
        }
      },
      error => {
        this.submitted = false;
        console.log("Search by term Error: " + JSON.stringify(error));
        this.title = "Search Error";
        this.text = "An unexpected error occurred. Please try again!";
        this.returnTrigger = true;
        this.okButton = true;
        document.getElementById('modalCont').click();
      });
  }

  onSubmitAddLots() {
    this.submitted = true;
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.addLots(this.id, this.addLotsForm.value.numberOfAddedLots)
      .subscribe(res => {
        if (res) {
          this.title = "Add Lots Success";
          this.text = "You have successfully added " + this.addLotsForm.value.numberOfAddedLots + " lots!";
          this.okButton = false;
          this.closeButton = true;
          this.returnTrigger = false;
          document.getElementById('modalCont').click();
        }
      }, error => {
        this.submitted = false;
        console.log("Add Lots error " + JSON.stringify(error));
        this.title = "Add Lots Error";
        this.text = "An unexpected error occurred. Please try again!";
        this.returnTrigger = true;
        this.okButton = true;
        document.getElementById('modalCont').click();
      });
  }

  onSubmitRemoveLots() {
    this.submitted = true;
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.removeLots(this.id, this.removeLotsForm.value.numberOfRemovedLots)
      .subscribe(res => {
          if (res) {
            this.title = "Remove Lots Success";
            this.text = "You have successfully removed " + this.removeLotsForm.value.numberOfRemovedLots + " lots!";
            this.okButton = false;
            this.closeButton = true;
            this.returnTrigger = false;
            document.getElementById('modalCont').click();
          }
        }, error => {
          this.submitted = false;
          console.log("Remove Lots error " + JSON.stringify(error));
          this.title = "Remove Lots Error";
          this.text = "An unexpected error occurred. Please try again!";
          this.returnTrigger = true;
          this.okButton = true;
          document.getElementById('modalCont').click();
        });
  }

  onDeleteParking() {
    this.title = "Parking Area Removal";
    this.text = "Are you sure you want to permanently delete this parking area?";
    document.getElementById('modalContDel').click();
  }

  onApproveDeleteParking() {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.deleteParkingArea(this.id).subscribe(res => {
      if (res) {
        this.title = "Parking Area Removal Success";
        this.text = "You have successfully deleted the parking area!";
        this.closeButton = false;
        this.okButton = true;
        this.returnTrigger = false;
        document.getElementById('modalCont').click();
      }
    }, error => {
      this.title = "Parking Area Removal Error";
      this.text = "An unexpected error occurred. Please try again!";
      this.closeButton = false;
      this.okButton = true;
      this.returnTrigger = true;
      document.getElementById('modalCont').click();
    });
  }

  assignEmployee(employeeId) {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.addEmployee(this.id, employeeId).subscribe(res => {
      if(res) {
        this.title = "Employee Assignment Success";
        this.text = "You have successfully assigned the user to this parking area!";
        this.closeButton = true;
        this.okButton = false;
        this.returnTrigger = false;
        document.getElementById('modalCont').click();
      }
    }, error => {
      this.title = "Employee Assignment Error";
      this.text = "An unexpected error occurred. Please try again!";
      this.closeButton = false;
      this.okButton = true;
      this.returnTrigger = true;
      document.getElementById('modalCont').click();
    });
  }

  removeEmployee(employeeId) {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.removeEmployee(this.id, employeeId).subscribe(res => {
      if(res) {
        this.title = "Employee Removal Success";
        this.text = "You have successfully removed the user from this parking area!";
        this.closeButton = true;
        this.okButton = false;
        this.returnTrigger = false;
        document.getElementById('modalCont').click();
      }
    }, error => {
      this.title = "Employee Removal Error";
      this.text = "An unexpected error occurred. Please try again!";
      this.closeButton = false;
      this.okButton = true;
      this.returnTrigger = true;
      document.getElementById('modalCont').click();
    });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if (result == 'C') {
        window.location.reload();
      } else if (result == "OK") {
        if(this.returnTrigger == true) {
          return;
        } else if(this.resSuccessTrigger == true) {
          this.router.navigate(['/reservations-page']);
        } else {
          this.router.navigate(['/owner-page']);
        }
      }
      return;
    }, (reason) => {
      return;
    });
  }

  open2(contentDel) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(contentDel).result.then((result) => {
      if (result == "Y") {
        this.onApproveDeleteParking();
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
