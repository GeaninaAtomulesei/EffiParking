import {Component} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {OnInit} from "@angular/core";
import {OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../shared/services/user.service";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

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
  private returnTrigger: boolean = false;
  private deletedTrigger: boolean = false;
  private title: string;
  private text: string;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private modalService: NgbModal,
              private router: Router,
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
            })
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
  }

  onDeleteUser() {
    this.title = "User Account Removal";
    this.text = "Are you sure you want to permanently delete this user's account?";
    document.getElementById('modalContDel').click();
  }

  onApproveDeleteUser() {
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
