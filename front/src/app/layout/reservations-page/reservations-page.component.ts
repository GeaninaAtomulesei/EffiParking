import {Component} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {OnInit} from "@angular/core";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppConstants} from "../../shared/constants";

@Component({
  selector: 'app-reservations-page',
  templateUrl: './reservations-page.component.html',
  styleUrls: ['./reservations-page.component.scss'],
  animations: [routerTransition()]
})
export class ReservationsPageComponent implements OnInit {

  private currentUser: any;
  private reservations: any;
  private todaysReservations: any = [];
  private upcomingReservations: any = [];
  private reservationId: number;
  private error: any;
  private title: string;
  private text: string;
  private cancelResTrigger = false;

  constructor(private parkingService: ParkingService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));

    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getUserReservations(this.currentUser.id)
      .subscribe(reservations => {
        this.reservations = reservations;

        this.reservations.forEach(reservation => {
          let resDate: string = reservation.startDate;
          let currentDate: Date = new Date();
          let resDateConverted: Date = new Date(resDate.replace("T", " "));
          if (resDateConverted.getDay() == currentDate.getDay()
            && resDateConverted.getMonth() == currentDate.getMonth()
            && resDateConverted.getFullYear() == currentDate.getFullYear()) {
            this.todaysReservations.push(reservation);
          } else {
            this.upcomingReservations.push(reservation);
          }
        });

      }, error => {
        console.log(error);
        this.error = error;
      });
  }

  onCancelReservation(reservationId) {
    this.title = AppConstants.CONFIRM_TITLE;
    this.text = AppConstants.CANCEL_RESERVATION_CONFIRM_TEXT;
    this.reservationId = reservationId;
    document.getElementById(AppConstants.MODAL_CONTENT_DEL).click();
  }

  onConfirmCancelReservation(reservationId) {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.cancelReservation(reservationId)
      .subscribe(res => {
        if(res) {
          this.reservationId = null;
          this.title = AppConstants.SUCCESS_TITLE;
          this.text = AppConstants.CANCEL_RESERVATION_TEXT;
          this.cancelResTrigger = true;
          document.getElementById(AppConstants.MODAL_CONTENT).click();
        }
      }, error => {
        console.log(error);
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.cancelResTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      });
  }


  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if(result == AppConstants.OK) {
        if(this.cancelResTrigger == true) {
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
        this.onConfirmCancelReservation(this.reservationId);
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }

}
