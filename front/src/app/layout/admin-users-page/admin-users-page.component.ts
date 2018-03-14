import {OnInit} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";

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

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.userService.getAll().subscribe(response => {
      response.forEach(user => {
        if (user.authorities) {
          user.authorities.forEach(auth => {
            if (auth.authority == "ROLE_ADMIN") {
              this.admins.push(user);
            } else if (auth.authority == "ROLE_OWNER") {
              this.owners.push(user);
            } else if (auth.authority == "ROLE_USER") {
              this.users.push(user);
            } else if (auth.authority == "ROLE_EMPLOYEE") {
              this.employees.push(user);
            }
          });
        }
      });
    });

    this.adminsTrigger = true;

    this.addAdminForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64), Validators.email])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64)])],
    });
  }

  onSubmitNewAdmin() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.createNewAdmin(this.addAdminForm.value)
      .delay(1000)
      .subscribe(res => {
        if(res) {
          this.title = "Admin Creation Success";
          this.text = "You have successfully added a new Administrator!";
          this.addAdminForm.reset();
          this.returnTrigger = false;
          document.getElementById('modalCont').click();
        }
      }, error => {
        this.title = "Admin Creation Error";
        this.text = "An unexpected error occurred. Please try again!";
        this.returnTrigger = true;
        document.getElementById('modalCont').click();
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
    this.title = "User Account Removal";
    this.text = "Are you sure you want to permanently delete this user's account?";
    document.getElementById('modalContDel').click();
  }

  onAddAdmin() {
    this.addAdminTrigger = !this.addAdminTrigger;
  }

  onApproveDeleteUser() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.deleteUser(this.deletedUserId).subscribe(res => {
      if (res) {
        this.title = "Delete Account Success";
        this.text = "You have successfully deleted the user's account!";
        this.returnTrigger = false;
        document.getElementById('modalCont').click();
      }
    }, error => {
      this.title = "Delete Account Error";
      this.text = "An unexpected error occurred. Please try again!";
      this.returnTrigger = true;
      document.getElementById('modalCont').click();
    })
  }


  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if (result == "OK") {
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
      if (result == "Y") {
        this.onApproveDeleteUser();
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }
}
