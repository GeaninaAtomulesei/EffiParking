import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-admin-requests',
  templateUrl: './admin-requests.component.html',
  styleUrls: ['./admin-requests.component.scss'],
  animations: [routerTransition()]
})
export class AdminRequestsComponent implements OnInit {

  private currentUser: any;
  private requests: any = [];
  private newRequests: any = [];
  private pastRequests: any = [];
  private title: string;
  private text: string;
  private notificationId: number;
  private reloadTrigger: boolean = false;
  private approvalTrigger: boolean = false;

  constructor(private userService: UserService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    if (localStorage.getItem("currentUser")) {
      this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
      console.log(JSON.stringify(this.currentUser));
    }

    if (this.currentUser && this.currentUser.authorities[0].authority == "ROLE_ADMIN") {
      //noinspection TypeScriptUnresolvedFunction
      this.userService.getNotifications(this.currentUser.id).subscribe(res => {
        if (res) {
          this.requests = res;

          this.requests.forEach(request => {
            let reqDate: string = request.date;
            let currentDate: Date = new Date;
            let requestDate: Date = new Date(reqDate.replace("T", " "));
            if (requestDate.getDay() == currentDate.getDay()
              && requestDate.getMonth() == currentDate.getMonth()
              && requestDate.getFullYear() == currentDate.getFullYear()) {
              this.newRequests.push(request);
            } else {
              this.pastRequests.push(request);
            }
          });
          console.log(" requests" + JSON.stringify(this.requests));
        }
      }, error => {
        console.log(error);
      });
    }
  }

  onDeleteRequest(notificationId) {
    this.notificationId = notificationId;
    this.title = "Delete Request Confirmation";
    this.text = "Are you sure you want to delete this owner request?";
    document.getElementById('modalContDel').click();
  }

  onDeleteRequestApproval() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.deleteNotification(this.notificationId)
      .subscribe(response => {
        if(response) {
          this.title = "Delete Request Success";
          this.text = "You have successfully deleted this owner request!";
          this.reloadTrigger = true;
          document.getElementById('modalCont').click();
        }
      }, error => {
        this.title = "Delete Request Error";
        this.text = "An unexpected error occurred. Please try again!";
        this.reloadTrigger = false;
        document.getElementById('modalCont').click();
      });
  }

  onApproveRequest(userId, organisation, requestId) {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.activateOwner(userId, organisation)
      .subscribe(response => {
        if(response) {
          this.title = "Owner Activation Success";
          this.text = "You have successfully approved this owner request!";
          this.reloadTrigger = false;
          this.approvalTrigger = true;
          this.notificationId = requestId;
          document.getElementById('modalCont').click();
        }
      }, error => {
        this.title = "Owner Activation Error";
        this.text = "An unexpected error occurred. Please try again!";
        this.reloadTrigger = false;
        this.approvalTrigger = false;
        document.getElementById('modalCont').click();
      });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if(result == "OK") {
        if(this.reloadTrigger) {
          window.location.reload();
        } else if(this.approvalTrigger) {
          //noinspection TypeScriptUnresolvedFunction
          this.userService.deleteNotification(this.notificationId).subscribe(response => {
            console.log(response);
          });
          window.location.reload();
        } else {
          return;
        }
      }
    }, (reason) => {
      return;
    });
  }

  open2(contentDel) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(contentDel).result.then((result) => {
      if (result == "Y") {
        this.onDeleteRequestApproval();
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }
}
