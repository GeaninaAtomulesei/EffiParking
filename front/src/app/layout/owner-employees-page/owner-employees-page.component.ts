import {Component, OnInit} from '@angular/core';
import {routerTransition} from "../../router.animations";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import {DisplayMessage} from "../../shared/models/display-message";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../shared/services/user.service";
import {AppConstants} from "../../shared/constants";

@Component({
  selector: 'app-owner-employees-page',
  templateUrl: './owner-employees-page.component.html',
  styleUrls: ['./owner-employees-page.component.scss'],
  animations: [routerTransition()]
})
export class OwnerEmployeesPageComponent implements OnInit {

   registeredEmployees: any[];
   addNewEmployeeTrigger: boolean = false;
   addEmployeeForm: FormGroup;
   submitted = false;
   notification: DisplayMessage;
   currentUser;
   title: string;
   text: string;
   error: any;
   foundEmployeesTrigger: boolean = false;
   searchTerm: string;
   foundEmployees: any = [];

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));

    this.addEmployeeForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64), Validators.email])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
    });

    //noinspection TypeScriptUnresolvedFunction
    this.userService.getEmployeesByOwner(this.currentUser.id)
      .subscribe(employees => {
          this.registeredEmployees = employees;
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
          this.title = AppConstants.ERROR_TITLE;
          this.text = AppConstants.ERROR_TEXT;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        });
  }

  onAddEmployee() {
    this.addNewEmployeeTrigger = !this.addNewEmployeeTrigger;
  }

  onSubmitNewEmployee() {
    this.notification = undefined;
    if(this.addEmployeeForm.pristine) {
      this.notification = {msgType: 'error', msgBody: AppConstants.PRISTINE_FORM};
      return;
    }
    if(this.addEmployeeForm.get('firstName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_FIRST_NAME};
      return;
    }
    if(this.addEmployeeForm.get('lastName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_LAST_NAME};
      return;
    }
    if(this.addEmployeeForm.get('email').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_EMAIL};
      return;
    }
    if(this.addEmployeeForm.get('username').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_USERNAME};
      return;
    }
    if(this.addEmployeeForm.get('password').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PASSWORD};
      return;
    }
    //noinspection TypeScriptUnresolvedFunction
    this.userService.addNewEmployee(this.addEmployeeForm.value, this.currentUser.id)
      .delay(1000)
      .subscribe(res => {
          if (res) {
            this.submitted = true;
            this.title = AppConstants.SUCCESS_TITLE;
            this.text = AppConstants.ADD_EMPLOYEE_TEXT;
            this.addEmployeeForm.reset();
            document.getElementById(AppConstants.MODAL_CONTENT).click();
          }
        },
        error => {
          this.submitted = false;
          this.title = AppConstants.ERROR_TITLE;
          this.text = AppConstants.ERROR_TEXT;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
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
