import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {routerTransition} from '../router.animations';
import {OnDestroy} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {DisplayMessage} from "../shared/models/display-message";
import {Subject} from "rxjs";
import {UserService} from "../shared/services/user.service";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/delay';
import {AppConstants} from "../shared/constants";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: [routerTransition()]
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
   changePasswordForm: FormGroup;
   notification: DisplayMessage;
   returnUrl: string;
   ngUnsubscribe: Subject<void> = new Subject<void>();
   title: string;
   text: string;
   changed : boolean = false;

  constructor(public router: Router,
              private userService: UserService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    //noinspection TypeScriptUnresolvedFunction
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: DisplayMessage) => {
        this.notification = params;
      });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
      confirmNewPassword: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.notification = undefined;
    //noinspection TypeScriptUnresolvedFunction
    this.authService.changePassword(this.changePasswordForm.value)
      .delay(1000)
      .subscribe(response => {
          //noinspection TypeScriptUnresolvedFunction
          if(response) {
            this.title = AppConstants.SUCCESS_TITLE;
            this.text = AppConstants.CHANGE_PASSWORD_SUCCESS_TEXT;
            this.changed = true;
            document.getElementById(AppConstants.MODAL_CONTENT).click();
          }
        },
        error => {
          this.notification = {msgType: 'error', msgBody: error.error};
        });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if(result == AppConstants.OK) {
        if(this.changed) {
          //noinspection TypeScriptUnresolvedFunction
          this.userService.getMyInfo().subscribe();
          this.router.navigate([this.returnUrl]);
        } else {
          return;
        }
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }
}
