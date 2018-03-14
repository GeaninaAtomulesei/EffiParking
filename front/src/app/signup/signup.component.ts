import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import {OnDestroy} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {DisplayMessage} from "../shared/models/display-message";
import {Subject} from "rxjs";
import {UserService} from "../shared/services/user.service";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {Validators} from "@angular/forms";
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/delay';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalDismissReasons} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignUpComponent implements OnInit, OnDestroy {

  title = "Sign up";
  signUpForm: FormGroup;
  submitted = false;
  notification: DisplayMessage;
  returnUrl: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  success: boolean = false;
  modalTitle: string = "Sign Up Success";
  text: string = "You have successfully signed up! You can now log in with your credentials.";
  closeResult: string;

  constructor(private userService: UserService,
              private authService: AuthService,
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
      password:  ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
      lastName:  ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])],
      email:     ['', Validators.compose([Validators.required, Validators.email])]
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
    this.authService.signUp(this.signUpForm.value)
      .delay(1000)
      .subscribe(data => {
        console.log(data);
        // //noinspection TypeScriptUnresolvedFunction
        //   this.authService.login(this.signUpForm.value).subscribe(data => {
        //   //noinspection TypeScriptUnresolvedFunction
        //   this.userService.getMyInfo().subscribe();
        // });
        this.success = true;
        document.getElementById('modalCont').click();
        this.router.navigate(['/login']);
      },
      error => {
        this.submitted = false;
        console.log("Sign up error " + JSON.stringify(error));
        this.notification = {msgType: 'error', msgBody: error['error'].errorMessage};
      });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
