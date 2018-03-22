import {OnInit} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import {AppConstants} from "../../shared/constants";
import {DisplayMessage} from "../../shared/models/display-message";

@Component({
  selector: 'app-admin-users-page',
  templateUrl: './admin-users-page.component.html',
  styleUrls: ['./admin-users-page.component.scss'],
  animations: [routerTransition()]
})
export class AdminUsersPageComponent implements OnInit {
  private admins: any = [];
  private owners: any = [];
  private users: any = [];
  private employees: any = [];
  private adminsTrigger: boolean = false;
  private ownersTrigger: boolean = false;
  private usersTrigger: boolean = false;
  private employeesTrigger: boolean = false;
  private returnTrigger: boolean = false;
  private title: string;
  private text: string;
  private deletedUserId: number;
  private searchTerm: string;
  private foundUsers: any = [];
  private searchUsersTrigger: boolean = false;
  private addAdminTrigger: boolean = false;
  private addAdminForm: FormGroup;
  private notification: DisplayMessage;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.getAll().subscribe(response => {
      response.forEach(user => {
        if (user.authorities) {
          user.authorities.forEach(auth => {
            if (auth.authority == AppConstants.ADMIN_ROLE) {
              this.admins.push(user);
            } else if (auth.authority == AppConstants.OWNER_ROLE) {
              this.owners.push(user);
            } else if (auth.authority == AppConstants.USER_ROLE) {
              this.users.push(user);
            } else if (auth.authority == AppConstants.EMPLOYEE_ROLE) {
              this.employees.push(user);
            }
          });
        }
      });
    });

    this.adminsTrigger = true;

    this.addAdminForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64), Validators.email])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
    });
  }

  onSubmitNewAdmin() {
    this.notification = undefined;
    if(this.addAdminForm.pristine) {
      this.notification = {msgType: 'error', msgBody: AppConstants.PRISTINE_FORM};
      return;
    }
    if(this.addAdminForm.get('firstName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_FIRST_NAME};
      return;
    }
    if(this.addAdminForm.get('lastName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_LAST_NAME};
      return;
    }
    if(this.addAdminForm.get('email').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_EMAIL};
      return;
    }
    if(this.addAdminForm.get('username').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_USERNAME};
      return;
    }
    if(this.addAdminForm.get('password').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PASSWORD};
      return;
    }
    //noinspection TypeScriptUnresolvedFunction
    this.userService.createNewAdmin(this.addAdminForm.value)
      .delay(1000)
      .subscribe(res => {
        if(res) {
          this.title = AppConstants.SUCCESS_TITLE;
          this.text = AppConstants.ADMIN_CREATE_TEXT;
          this.addAdminForm.reset();
          this.returnTrigger = false;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        }
      }, error => {
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.returnTrigger = true;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      });
  }

  onSearchUsers() {
    this.searchUsersTrigger = true;
    //noinspection TypeScriptUnresolvedFunction
    this.userService.searchByTerm(this.searchTerm).subscribe(response => {
      if(response) {
        this.foundUsers = response;
      }
    }, error => {
      console.log(error);
    });
  }

  onShowAdmins() {
    this.employeesTrigger = false;
    this.ownersTrigger = false;
    this.usersTrigger = false;
    this.adminsTrigger = true;
  }

  onShowEmployees() {
    this.employeesTrigger = true;
    this.ownersTrigger = false;
    this.usersTrigger = false;
    this.adminsTrigger = false;
  }

  onShowOwners() {
    this.employeesTrigger = false;
    this.ownersTrigger = true;
    this.usersTrigger = false;
    this.adminsTrigger = false;
  }

  onShowUsers() {
    this.employeesTrigger = false;
    this.ownersTrigger = false;
    this.usersTrigger = true;
    this.adminsTrigger = false;
  }

  onDeleteUser(userId) {
    this.deletedUserId = userId;
    this.title = AppConstants.CONFIRM_TITLE;
    this.text = AppConstants.DELETE_USER_CONFIRM_TEXT;
    document.getElementById(AppConstants.MODAL_CONTENT_DEL).click();
  }

  onAddAdmin() {
    this.addAdminTrigger = !this.addAdminTrigger;
  }

  onApproveDeleteUser() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.deleteUser(this.deletedUserId).subscribe(res => {
      if (res) {
        this.title = AppConstants.SUCCESS_TITLE;
        this.text = AppConstants.DELETE_USER_TEXT;
        this.returnTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      }
    }, error => {
      this.title = AppConstants.ERROR_TITLE;
      this.text = AppConstants.ERROR_TEXT;
      this.returnTrigger = true;
      document.getElementById(AppConstants.MODAL_CONTENT).click();
    })
  }


  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if (result == AppConstants.OK) {
        if (this.returnTrigger == true) {
          return;
        } else {
          window.location.reload();
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
      if (result == AppConstants.YES) {
        this.onApproveDeleteUser();
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }
}
