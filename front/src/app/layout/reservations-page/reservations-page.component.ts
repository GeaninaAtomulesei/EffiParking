import {Component} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {OnInit} from "@angular/core";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-reservations-page',
  templateUrl: './reservations-page.component.html',
  styleUrls: ['./reservations-page.component.scss'],
  animations: [routerTransition()]
})
export class ReservationsPageComponent implements OnInit {

  currentUser: any;
  reservations: any;
  todaysReservations: any = [];
  upcomingReservations: any = [];
  reservationId: number;
  error: any;
  title: string;
  text: string;
  cancelResTrigger = false;

  constructor(private parkingService: ParkingService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

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
    this.title = "Cancel Reservation Confirmation";
    this.text = "Are you sure you want to cancel this reservation?";
    this.reservationId = reservationId;
    document.getElementById("modalContDel").click();
  }

  onConfirmCancelReservation(reservationId) {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.cancelReservation(reservationId)
      .subscribe(res => {
        if(res) {
          this.reservationId = null;
          this.title = "Cancel Reservation Success";
          this.text = "You have successfully cancelled the reservation!";
          this.cancelResTrigger = true;
          document.getElementById("modalCont").click();
        }
      }, error => {
        console.log(error);
        this.title = "Cancel Reservation Error";
        this.text = "An unexpected error occurred. Please try again!";
        this.cancelResTrigger = false;
        document.getElementById("modalCont").click();
      });
  }


  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if(result == "OK") {
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
      if (result == "Y") {
        this.onConfirmCancelReservation(this.reservationId);
      } else {
        return;
      }
    }, (reason) => {
      return;
    });
  }

}
