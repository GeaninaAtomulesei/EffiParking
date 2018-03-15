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
  selector: 'app-owner-employees-page',
  templateUrl: './owner-employees-page.component.html',
  styleUrls: ['./owner-employees-page.component.scss'],
  animations: [routerTransition()]
})
export class OwnerEmployeesPageComponent implements OnInit {

  private registeredEmployees: any[];
  private addNewEmployeeTrigger: boolean = false;
  addEmployeeForm: FormGroup;
  submitted = false;
  notification: DisplayMessage;
  private currentUser;
  title: string;
  text: string;
  error: any;
  private foundEmployeesTrigger: boolean = false;
  private searchTerm: string;
  private foundEmployees: any = [];

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    this.addEmployeeForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64), Validators.email])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
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

  onSearchEmployee() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.getEmployeeByTerm(this.currentUser.id, this.searchTerm)
      .subscribe(res => {
          if (res) {
            this.submitted = true;
            this.foundEmployees = res;
            this.foundEmployeesTrigger = true;
          }
        },
        error => {
          this.submitted = false;
          console.log("Search by term Error: " + JSON.stringify(error));
          this.title = "Search Error";
          this.text = "An unexpected error occurred. Please try again!";
          document.getElementById('modalCont').click();
        });
  }

  onAddEmployee() {
    this.addNewEmployeeTrigger = !this.addNewEmployeeTrigger;
  }

  onSubmitNewEmployee() {
    this.notification = undefined;

    //noinspection TypeScriptUnresolvedFunction
    this.userService.addNewEmployee(this.addEmployeeForm.value, this.currentUser.id)
      .delay(1000)
      .subscribe(res => {
          console.log(res);
          if (res) {
            this.submitted = true;
            this.title = "Employee Registration Success";
            this.text = "You have successfully registered a new employee!";
            this.addEmployeeForm.reset();
            document.getElementById('modalCont').click();
          }
        },
        error => {
          this.submitted = false;
          this.title = "Employee Registration Error";
          this.text = "An unexpected error occurred. Please try again!";
          document.getElementById('modalCont').click();
        });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if (this.submitted) {
        window.location.reload();
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }
}
