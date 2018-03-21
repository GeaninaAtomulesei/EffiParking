import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppConstants} from "../../shared/constants";
import {OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.scss'],
  animations: [routerTransition()]
})
export class AllNotificationsComponent implements OnInit, OnDestroy {

  private sub: any;
  private id: any;
  private notifications: any = [];
  private currentUser: any;
  private newNotifications: any = [];
  private pastNotifications: any = [];
  private title: string;
  private text: string;
  private notificationId: number;
  private reloadTrigger: boolean = false;
  private approvalTrigger: boolean = false;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      console.log(this.id);
    });

    if (localStorage.getItem(AppConstants.CURRENT_USER)) {
      this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));
      console.log(JSON.stringify(this.currentUser));
    }

      //noinspection TypeScriptUnresolvedFunction
      this.userService.getNotifications(this.currentUser.id).subscribe(res => {
        if (res) {
          this.notifications = res;
          this.notifications.forEach(notification => {
            let reqDate: string = notification.date;
            let currentDate: Date = new Date;
            let requestDate: Date = new Date(reqDate.replace("T", " "));
            if (requestDate.getDay() == currentDate.getDay()
              && requestDate.getMonth() == currentDate.getMonth()
              && requestDate.getFullYear() == currentDate.getFullYear()) {
              this.newNotifications.push(notification);
            } else {
              this.pastNotifications.push(notification);
            }
          });
        }
      }, error => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onDeleteNotification(notificationId) {
    this.userService.deleteNotification(notificationId)
      .subscribe(response => {
        if(response) {
          this.title = AppConstants.SUCCESS_TITLE;
          this.text = AppConstants.DELETE_NOTIF_SUCCESS_TEXT;
          this.reloadTrigger = true;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        }
      }, error => {
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.reloadTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      })
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if(result == AppConstants.OK) {
        if(this.reloadTrigger) {
          window.location.reload();
        } else {
          return;
        }
      }
    }, (reason) => {
      return;
    });
  }

}
