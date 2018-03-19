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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit, OnDestroy {
  private title = 'Login';
  private loginForm: FormGroup;
  private submitted = false;
  private notification: DisplayMessage;
  private returnUrl: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public router: Router,
              private userService: UserService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    //noinspection TypeScriptUnresolvedFunction
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params: DisplayMessage) => {
        this.notification = params;
      });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])]
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.notification = undefined;
    this.submitted = true;
    //noinspection TypeScriptUnresolvedFunction
    this.authService.login(this.loginForm.value)
      .delay(1000)
      .subscribe(data => {
          //noinspection TypeScriptUnresolvedFunction
          this.userService.getMyInfo().subscribe();
          localStorage.setItem(AppConstants.LOGGED_IN, 'true');
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.submitted = false;
          this.notification = {msgType: 'error', msgBody: AppConstants.LOGIN_FAIL};
        });
  }
}
