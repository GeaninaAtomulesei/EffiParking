import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {AppConstants} from "../../shared/constants";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DisplayMessage} from "../../shared/models/display-message";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [routerTransition()]
})
export class ContactComponent implements OnInit {

   currentUser: any;
   contactForm: FormGroup;
   title: string;
   text: string;
   notification: DisplayMessage;

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));

    this.contactForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(64), Validators.email])],
      reason: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      message: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(5000000)])],
    });

    if(this.currentUser) {
      this.contactForm.get('name').setValue(this.currentUser.firstName + " " + this.currentUser.lastName);
      this.contactForm.get('email').setValue(this.currentUser.email);
    }
  }

  onSubmit() {
    this.notification = undefined;
    if(this.contactForm.get('name').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_NAME};
      return;
    }
    if(this.contactForm.get('email').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_EMAIL};
      return;
    }
    if(this.contactForm.get('reason').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_REASON};
      return;
    }
    if(this.contactForm.get('message').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_MESSAGE};
      return;
    }

    //noinspection TypeScriptUnresolvedFunction
    this.userService.sendMessage(this.contactForm.value)
      .delay(1000)
      .subscribe(response => {
        if(response) {
          this.title = AppConstants.SUCCESS_TITLE;
          this.text = AppConstants.SEND_MESSAGE_SUCCESS_TEXT;
          this.contactForm.reset();
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        }
      }, error => {
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      return;
    }, (reason) => {
      return;
    });
  }
}
