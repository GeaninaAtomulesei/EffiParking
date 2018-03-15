import {Component} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {OnInit} from "@angular/core";
import {OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../shared/services/user.service";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [routerTransition()]
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private sub: any;
  private id: number;
  private user: any;
  private role: string;
  private ownedParkingAreas: any = [];
  private assignedParkingAreas: any = [];
  private currentUser: any;
  private isAdmin: boolean = false;
  private isOwner: boolean = false;
  private returnTrigger: boolean = false;
  private deletedTrigger: boolean = false;
  private title: string;
  private text: string;
  private editEmployeeTrigger: boolean = false;
  private editEmployeeForm: FormGroup;
  private reloadTrigger: boolean = false;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private modalService: NgbModal,
              private router: Router,
              private formBuilder: FormBuilder,
              private parkingService: ParkingService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      console.log("curr user-profile id: " + this.id);
    });

    //noinspection TypeScriptUnresolvedFunction
    this.userService.getById(this.id).subscribe(user => {
      this.user = user;
      if (this.user.authorities) {
        this.user.authorities.forEach(auth => {
          if (auth.authority == "ROLE_OWNER") {
            this.role = "Owner";
            //noinspection TypeScriptUnresolvedFunction
            this.parkingService.getByOwner(this.user.username).subscribe(response => {
              this.ownedParkingAreas = response;
            });
          } else if (auth.authority == "ROLE_EMPLOYEE") {
            this.role = "Employee";
            //noinspection TypeScriptUnresolvedFunction
            this.parkingService.getByEmployee(this.user.id).subscribe(response => {
              this.assignedParkingAreas = response;
            });
            if (localStorage.getItem("currentUser")) {
              this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
              if (this.currentUser.authorities[0].authority == "ROLE_OWNER") {
                if(this.user.owner.id == this.currentUser.id) {
                  this.isOwner = true;
                  console.log("IS OWNER");
                }
              }
            }
          } else if (auth.authority == "ROLE_ADMIN") {
            this.role = "Administrator";
          } else {
            this.role = "User";
          }
        });
      }
      console.log("curr user-profile: " + JSON.stringify(this.user));
    });

    if (localStorage.getItem("currentUser")) {
      this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (this.currentUser.authorities[0].authority == "ROLE_ADMIN") {
        this.isAdmin = true;
        console.log("IS ADMIN");
      }
    }

    this.editEmployeeForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: [''],
      password: ['']
    });
  }

  onSubmitEditEmployeeForm() {
    this.userService.updateEmployee(this.editEmployeeForm.value, this.id)
      .subscribe(response => {
        if(response) {
          this.title = "Edit Employee Success";
          this.text = "You have successfully edited this employee's information!";
          this.deletedTrigger = false;
          this.reloadTrigger = true;
          document.getElementById('modalCont').click();
        }
      }, error => {
        console.log(error);
        this.title = "Edit Employee Error";
        this.text = "An unexpected error occurred. Please try again!";
        this.deletedTrigger = false;
        this.reloadTrigger = false;
        document.getElementById('modalCont').click();
      });
  }

  onEditEmployee() {
    this.editEmployeeTrigger = !this.editEmployeeTrigger;
  }

  onDeleteUser() {
    this.title = "User Account Removal";
    this.text = "Are you sure you want to permanently delete this user's account?";
    document.getElementById('modalContDel').click();
  }

  onApproveDeleteUser() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.deleteUser(this.id).subscribe(res => {
      if (res) {
        this.title = "Delete Account Success";
        this.text = "You have successfully deleted the user's account!";
        this.returnTrigger = false;
        this.deletedTrigger = true;
        document.getElementById('modalCont').click();
      }
    }, error => {
      this.title = "Delete Account Error";
      this.text = "An unexpected error occurred. Please try again!";
      this.returnTrigger = true;
      this.deletedTrigger = false;
      document.getElementById('modalCont').click();
    })
  }


  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if (result == "OK") {
        if (this.deletedTrigger == true) {
          this.router.navigate(['/admin-users-page']);
        } else if(this.reloadTrigger == true) {
          window.location.reload();
        } else {
          return;
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
