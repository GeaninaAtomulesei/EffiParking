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
import {Validators} from "@angular/forms";
import {UploadService} from "../../shared/services/upload.service";
import {HttpEventType} from "@angular/common/http";
import {HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppConstants} from "../../shared/constants";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [routerTransition()]
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private sub: any;
  private id: number;
  private user: any;
  private role: string;
  private ownedParkingAreas: any = [];
  private assignedParkingAreas: any = [];
  private currentUser: any;
  private isAdmin: boolean = false;
  private isOwner: boolean = false;
  private returnTrigger: boolean = false;
  private deletedTrigger: boolean = false;
  private title: string;
  private text: string;
  private editEmployeeTrigger: boolean = false;
  private editEmployeeForm: FormGroup;
  private reloadTrigger: boolean = false;
  private isMyProfile: boolean = true;
  private loginTrigger: boolean = true;
  private editMyProfileTrigger: boolean = false;
  private editMyProfileForm: FormGroup;
  private selectedFile: FileList;
  private currentFileUpload: File;
  private progress: {percentage: number} = {percentage: 0};
  private photo: any;
  private addPhotoTrigger: boolean = false;

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
      if (this.currentUser.id == this.id) {
        this.isMyProfile = true;
      }
    }

    this.uploadService.getPhoto(this.id.toString())
      .subscribe(result => {
        //noinspection TypeScriptUnresolvedVariable
        this.photo = result.response;
      });

    this.editEmployeeForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: [''],
      password: ['']
    });

    this.editMyProfileForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: [''],
      password: ['']
    });
  }

  onEditMyProfile() {
    this.editMyProfileTrigger = !this.editMyProfileTrigger;
  }

  onSubmitEditMyProfileForm() {
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
