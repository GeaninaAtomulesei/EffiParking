import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import {OnDestroy} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {DisplayMessage} from "../shared/models/display-message";
import {Subject} from "rxjs";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/delay';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppConstants} from "../shared/constants";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignUpComponent implements OnInit, OnDestroy {

  private signUpForm: FormGroup;
  private submitted = false;
  private notification: DisplayMessage;
  private returnUrl: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private success: boolean = false;
  private title: string;
  private text: string;

  constructor(private authService: AuthService,
              public router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {}

  ngOnInit() {
    //noinspection TypeScriptUnresolvedFunction
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: DisplayMessage) => {
        this.notification = params;
      });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.signUpForm = this.formBuilder.group({
      username:  ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      password:  ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      lastName:  ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      email:     ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.notification = undefined;
    if(this.signUpForm.get('firstName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_FIRST_NAME};
      return;
    }
    if(this.signUpForm.get('lastName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_LAST_NAME};
      return;
    }
    if(this.signUpForm.get('username').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_USERNAME};
      return;
    }
    if(this.signUpForm.get('password').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PASSWORD};
      return;
    }
    if(this.signUpForm.get('email').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_EMAIL};
      return;
    }

    this.submitted = true;
    //noinspection TypeScriptUnresolvedFunction
    this.authService.signUp(this.signUpForm.value)
      .delay(1000)
      .subscribe(data => {
        this.success = true;
        this.title = AppConstants.SUCCESS_TITLE;
        this.text = AppConstants.SIGNUP_TEXT;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
        this.router.navigate(['/login']);
      },
      error => {
        this.submitted = false;
        this.notification = {msgType: 'error', msgBody: error['error'].errorMessage};
      });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }
}
