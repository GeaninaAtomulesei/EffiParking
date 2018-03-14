import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-emp-parking-page',
  templateUrl: './emp-parking-page.component.html',
  styleUrls: ['./emp-parking-page.component.scss'],
  animations: [routerTransition()]
})
export class EmployeeParkingPageComponent implements OnInit, OnDestroy {

  private sub: any;
  id: any;
  parking: any;
  reloadTrigger = false;
  title: string;
  text: string;
  username: string;
  foundReservations: any = [];
  foundReservationsTrigger: boolean;
  todayReservations = [];
  todayResTrigger: boolean;


  constructor(private route: ActivatedRoute,
              private modalService: NgbModal,
              private parkingService: ParkingService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      console.log(this.id);
    });

    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getById(this.id).subscribe(parking => {
      this.parking = parking;
    }, error => {
      console.log(error);
    });

    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.findReservationsByParking(this.id).subscribe(reservations => {
      this.todayReservations = reservations;
    }, error => {
      console.log(error);
    });
  }

  showTodayReservations() {
    this.todayResTrigger = !this.todayResTrigger;
  }

  setLotVacant(lotId) {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.setLotVacant(lotId).subscribe(res => {
      if(res) {
        this.title = "Success";
        this.text = "You have successfully set lot number " + lotId + " as vacant!";
        this.reloadTrigger = true;
        document.getElementById('modalCont').click();
      }
    }, error => {
      this.title = "Error";
      this.text = "An unexpected error occurred. Please try again!";
      this.reloadTrigger = false;
      document.getElementById('modalCont').click();
    })
  }

  setLotOccupied(lotId) {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.setLotOccupied(lotId).subscribe(res => {
      if(res) {
        this.title = "Success";
        this.text = "You have successfully set lot number " + lotId + " as occupied!";
        this.reloadTrigger = true;
        document.getElementById('modalCont').click();
      }
    }, error => {
      this.title = "Error";
      this.text = "An unexpected error occurred. Please try again!";
      this.reloadTrigger = false;
      document.getElementById('modalCont').click();
    })
  }

  searchReservation() {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.findReservationByName(this.parking.id, this.username)
      .subscribe(reservations => {
        if(reservations) {
          this.foundReservations = reservations;
          this.foundReservationsTrigger = true;
        }
      }, error => {
        this.title = "Error";
        this.text = "An unexpected error occurred. Please try again!";
        this.reloadTrigger = false;
        document.getElementById('modalCont').click();
      });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if (result == "OK") {
        if(this.reloadTrigger == true) {
          window.location.reload();
        } else {
          return;
        }
      }
      return;
    }, (reason) => {
      return;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
