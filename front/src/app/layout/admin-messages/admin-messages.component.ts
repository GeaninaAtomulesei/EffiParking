import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppConstants} from "../../shared/constants";

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.scss'],
  animations: [routerTransition()]
})
export class AdminMessagesComponent implements OnInit {

  private currentUser: any;
  private requests: any = [];
  private newMessages: any = [];
  private pastMessages: any = [];
  private title: string;
  private text: string;
  private messageId: number;
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
      this.userService.getAllMessages().subscribe(res => {
        if (res) {
          this.requests = res;
          this.requests.forEach(message => {
            let reqDate: string = message.date;
            let currentDate: Date = new Date;
            let requestDate: Date = new Date(reqDate.replace("T", " "));
            if (requestDate.getDay() == currentDate.getDay()
              && requestDate.getMonth() == currentDate.getMonth()
              && requestDate.getFullYear() == currentDate.getFullYear()) {
              this.newMessages.push(message);
            } else {
              this.pastMessages.push(message);
            }
          });
        }
      }, error => {
        console.log(error);
      });
    }
  }

  onDeleteMessage(messageId) {
    this.messageId = messageId;
    this.title = AppConstants.CONFIRM_TITLE;
    this.text = AppConstants.DELETE_MSG_CONFIRM_TEXT;
    document.getElementById(AppConstants.MODAL_CONTENT_DEL).click();
  }

  onDeleteMessageApproval() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.deleteMessage(this.messageId)
      .subscribe(response => {
        if(response) {
          this.title = AppConstants.CONFIRM_TITLE;
          this.text = AppConstants.DELETE_MSG_TEXT;
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

  open2(contentDel) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(contentDel).result.then((result) => {
      if (result == AppConstants.YES) {
        this.onDeleteMessageApproval();
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }
}
