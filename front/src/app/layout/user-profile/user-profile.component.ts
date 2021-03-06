import {Component} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {OnInit} from "@angular/core";
import {OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../shared/services/user.service";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {FormBuilder} from "@angular/forms";
import {UploadService} from "../../shared/services/upload.service";
import {HttpEventType} from "@angular/common/http";
import {HttpResponse} from "@angular/common/http";
import {AppConstants} from "../../shared/constants";
import {Validators} from "@angular/forms";
import {DisplayMessage} from "../../shared/models/display-message";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [routerTransition()]
})
export class UserProfileComponent implements OnInit, OnDestroy {

   sub: any;
   id: number;
   user: any;
   role: string;
   ownedParkingAreas: any = [];
   assignedParkingAreas: any = [];
   currentUser: any;
   isAdmin: boolean = false;
   isOwner: boolean = false;
   returnTrigger: boolean = false;
   deletedTrigger: boolean = false;
   title: string;
   text: string;
   editEmployeeTrigger: boolean = false;
   editEmployeeForm: FormGroup;
   reloadTrigger: boolean = false;
   isMyProfile: boolean = true;
   loginTrigger: boolean = true;
   editMyProfileTrigger: boolean = false;
   editMyProfileForm: FormGroup;
   selectedFile: FileList;
   currentFileUpload: File;
   progress: {percentage: number} = {percentage: 0};
   photo: any;
   addPhotoTrigger: boolean = false;
   notification: DisplayMessage;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private modalService: NgbModal,
              private router: Router,
              private formBuilder: FormBuilder,
              private uploadService: UploadService,
              private parkingService: ParkingService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));

    //noinspection TypeScriptUnresolvedFunction
    this.userService.getById(this.id).subscribe(user => {
      this.user = user;
      if (this.user.authorities) {
        this.user.authorities.forEach(auth => {
          if (auth.authority == AppConstants.OWNER_ROLE) {
            this.role = AppConstants.OWNER;
            //noinspection TypeScriptUnresolvedFunction
            this.parkingService.getByOwner(this.user.username).subscribe(response => {
              this.ownedParkingAreas = response;
            });
          } else if (auth.authority == AppConstants.EMPLOYEE_ROLE) {
            this.role = AppConstants.EMPLOYEE;
            //noinspection TypeScriptUnresolvedFunction
            this.parkingService.getByEmployee(this.user.id).subscribe(response => {
              this.assignedParkingAreas = response;
            });

            if (this.currentUser.authorities[0].authority == AppConstants.OWNER_ROLE) {
              if (this.user.owner.id == this.currentUser.id) {
                this.isOwner = true;
                console.log("IS OWNER");
              }
            }
          } else if (auth.authority == AppConstants.ADMIN_ROLE) {
            this.role = AppConstants.ADMIN;
          } else {
            this.role = AppConstants.USER;
          }
        });
      }
    });

    if (localStorage.getItem(AppConstants.CURRENT_USER)) {
      if (this.currentUser.authorities[0].authority == AppConstants.ADMIN_ROLE) {
        this.isAdmin = true;
        console.log("IS ADMIN");
      }
      this.isMyProfile = this.currentUser.id == this.id;
    }

    this.uploadService.getPhoto(this.id.toString())
      .subscribe(result => {
        //noinspection TypeScriptUnresolvedVariable
        this.photo = result.response;
      });

    this.editEmployeeForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64)])],
      lastName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64)])],
      email: ['', Validators.compose([Validators.minLength(3), Validators.email, Validators.maxLength(64)])],
      username: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64)])]
    });

    this.editMyProfileForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64)])],
      lastName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64)])],
      email: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64), Validators.email])],
      username: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(64)])]
    });
  }

  onEditMyProfile() {
    this.editMyProfileTrigger = !this.editMyProfileTrigger;
  }

  onSubmitEditMyProfileForm() {
    this.notification = undefined;
    if(this.editMyProfileForm.pristine) {
      this.notification = {msgType: 'error', msgBody: AppConstants.PRISTINE_FORM};
      return;
    }
    if(this.editMyProfileForm.get('firstName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_FIRST_NAME};
      return;
    }
    if(this.editMyProfileForm.get('lastName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_LAST_NAME};
      return;
    }
    if(this.editMyProfileForm.get('email').value && this.editMyProfileForm.get('email').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_EMAIL};
      return;
    }
    if(this.editMyProfileForm.get('username').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_USERNAME};
      return;
    }
    //noinspection TypeScriptUnresolvedFunction
    this.userService.updateUser(this.editMyProfileForm.value, this.id)
      .subscribe(response => {
        if (response) {
          this.title = AppConstants.SUCCESS_TITLE;
          this.text = AppConstants.EDIT_PROFILE_TEXT;
          this.deletedTrigger = false;
          this.reloadTrigger = true;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        }
      }, error => {
        console.log(error);
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.deletedTrigger = false;
        this.reloadTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      });
  }

  onSubmitEditEmployeeForm() {
    this.notification = undefined;
    if(this.editEmployeeForm.pristine) {
      this.notification = {msgType: 'error', msgBody: AppConstants.PRISTINE_FORM};
      return;
    }
    if(this.editEmployeeForm.get('firstName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_FIRST_NAME};
      return;
    }
    if(this.editEmployeeForm.get('lastName').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_LAST_NAME};
      return;
    }
    if(this.editEmployeeForm.get('email').value && this.editMyProfileForm.get('email').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_EMAIL};
      return;
    }
    if(this.editEmployeeForm.get('username').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_USERNAME};
      return;
    }
    if(this.editEmployeeForm.get('password').invalid) {
      this.notification = {msgType: 'error', msgBody: AppConstants.INVALID_PASSWORD};
      return;
    }
    //noinspection TypeScriptUnresolvedFunction
    this.userService.updateEmployee(this.editEmployeeForm.value, this.id)
      .subscribe(response => {
        if (response) {
          this.title = AppConstants.SUCCESS_TITLE;
          this.text = AppConstants.EDIT_EMPLOYEE_PROFILE_TEXT;
          this.deletedTrigger = false;
          this.reloadTrigger = true;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        }
      }, error => {
        console.log(error);
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.deletedTrigger = false;
        this.reloadTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      });
  }

  onEditEmployee() {
    this.editEmployeeTrigger = !this.editEmployeeTrigger;
  }

  onDeleteUser() {
    if (this.isMyProfile) {
      this.title = AppConstants.CONFIRM_TITLE;
      this.text = AppConstants.DELETE_MY_ACCOUNT_CONFIRM_TEXT;
    } else {
      this.title = AppConstants.CONFIRM_TITLE;
      this.text = AppConstants.DELETE_USER_ACCOUNT_CONFIRM_TEXT;
    }
    document.getElementById(AppConstants.MODAL_CONTENT_DEL).click();
  }

  onApproveDeleteUser() {
    //noinspection TypeScriptUnresolvedFunction
    this.userService.deleteUser(this.id).subscribe(res => {
      if (res) {
        if (this.isMyProfile) {
          this.title = AppConstants.SUCCESS_TITLE;
          this.text = AppConstants.DELETE_MY_ACCOUNT_TEXT;
          this.returnTrigger = false;
          this.deletedTrigger = false;
          this.loginTrigger = true;
        } else {
          this.title = AppConstants.SUCCESS_TITLE;
          this.text = AppConstants.DELETE_USER_ACCOUNT_TEXT;
          this.returnTrigger = false;
          this.deletedTrigger = true;
          this.loginTrigger = false;
        }

        document.getElementById(AppConstants.MODAL_CONTENT).click();
      }
    }, error => {
      this.title = AppConstants.ERROR_TITLE;
      this.text = AppConstants.ERROR_TEXT;
      this.returnTrigger = true;
      this.deletedTrigger = false;
      document.getElementById(AppConstants.MODAL_CONTENT).click();
    });
  }

  selectFile(event) {
    const file = event.target.files.item(0);
    if (file.type.match('image.*')) {
      this.selectedFile = event.target.files;
    } else {
      this.title = AppConstants.INVALID_PHOTO_TITLE;
      this.text = AppConstants.INVALID_PHOTO_TEXT;
      this.returnTrigger = true;
      this.deletedTrigger = false;
      this.reloadTrigger = false;
      this.loginTrigger = false;
      document.getElementById(AppConstants.MODAL_CONTENT).click();
    }
  }

  onAddPhoto() {
    this.addPhotoTrigger = !this.addPhotoTrigger;
  }

  upload() {
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFile.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.id).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        //noinspection TypeScriptUnresolvedVariable
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this.title = AppConstants.SUCCESS_TITLE;
        this.text = AppConstants.PHOTO_UPLOAD_TEXT;
        this.reloadTrigger = true;
        this.returnTrigger = false;
        this.deletedTrigger = false;
        this.loginTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      }
    });
    this.selectedFile = undefined;
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if (result == AppConstants.OK) {
        if (this.deletedTrigger == true) {
          this.router.navigate(['/admin-users-page']);
        } else if (this.reloadTrigger == true) {
          window.location.reload();
        } else if (this.loginTrigger == true) {
          this.router.navigate(['/login']);
        } else if(this.returnTrigger == true) {
          return;
        } else {
          return;
        }
      }
      return;
    }, (reason) => {
      if (this.loginTrigger == true) {
        this.router.navigate(['/login']);
      }
      return;
    });
  }


  open2(contentDel) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(contentDel).result.then((result) => {
      if (result == AppConstants.YES) {
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
