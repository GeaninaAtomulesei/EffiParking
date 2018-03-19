import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppConstants} from "../../shared/constants";

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
    if (localStorage.getItem(AppConstants.CURRENT_USER)) {
      this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));
      console.log(JSON.stringify(this.currentUser));
    }

    if (this.currentUser && this.currentUser.authorities[0].authority == AppConstants.ADMIN_ROLE) {
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
        }
      }, error => {
        console.log(error);
      });
    }
  }

  onDeleteRequest(notificationId) {
    this.notificationId = notificationId;
    this.title = AppConstants.CONFIRM_TITLE
    this.text = AppConstants.DELETE_REQ_CONFIRM_TEXT;
    document.getElementById(AppConstants.MODAL_CONTENT_DEL).click();
  }

  onDeleteRequestApproval() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.deleteNotification(this.notificationId)
      .subscribe(response => {
        if(response) {
          this.title = AppConstants.CONFIRM_TITLE;
          this.text = AppConstants.DELETE_REQ_TEXT;
          this.reloadTrigger = true;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        }
      }, error => {
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.reloadTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      });
  }

  onApproveRequest(userId, organisation, requestId) {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.activateOwner(userId, organisation)
      .subscribe(response => {
        if(response) {
          this.title = AppConstants.SUCCESS_TITLE;
          this.text = AppConstants.OWNER_ACTIV_TEXT;
          this.reloadTrigger = false;
          this.approvalTrigger = true;
          this.notificationId = requestId;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        }
      }, error => {
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.reloadTrigger = false;
        this.approvalTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if(result == AppConstants.OK) {
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
      if (result == AppConstants.YES) {
        this.onDeleteRequestApproval();
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }
}
