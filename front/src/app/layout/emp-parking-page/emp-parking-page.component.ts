import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppConstants} from "../../shared/constants";

@Component({
  selector: 'app-emp-parking-page',
  templateUrl: './emp-parking-page.component.html',
  styleUrls: ['./emp-parking-page.component.scss'],
  animations: [routerTransition()]
})
export class EmployeeParkingPageComponent implements OnInit, OnDestroy {

  private sub: any;
  private id: any;
  private parking: any;
  private reloadTrigger = false;
  private title: string;
  private text: string;
  private username: string;
  private lotNumber: number;
  private foundReservations: any = [];
  private foundReservationsTrigger: boolean;
  private todayReservations = [];
  private todayResTrigger: boolean;
  private foundLot: any;
  private searchLotTrigger: boolean;
  private foundLotReservations: any = [];

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
  }

  showTodayReservations() {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.findReservationsByParking(this.id).subscribe(reservations => {
      this.todayReservations = reservations;
      this.foundReservationsTrigger = false;
      this.todayResTrigger = !this.todayResTrigger;
    }, error => {
      console.log(error);
    });
  }

  setLotVacant(lotId) {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.setLotVacant(lotId).subscribe(res => {
      if(res) {
        this.title = AppConstants.SUCCESS_TITLE;
        this.text = AppConstants.UPDATE_LOT_VACANT_TEXT;
        this.reloadTrigger = true;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      }
    }, error => {
      this.title = AppConstants.ERROR_TITLE;
      this.text = AppConstants.ERROR_TEXT;
      this.reloadTrigger = false;
      document.getElementById(AppConstants.MODAL_CONTENT).click();
    })
  }

  setLotOccupied(lotId) {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.setLotOccupied(lotId).subscribe(res => {
      if(res) {
        this.title = AppConstants.SUCCESS_TITLE;
        this.text = AppConstants.UPDATE_LOT_OCCUPIED_TEXT;
        this.reloadTrigger = true;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      }
    }, error => {
      this.title = AppConstants.ERROR_TITLE;
      this.text = AppConstants.ERROR_TEXT;
      this.reloadTrigger = false;
      document.getElementById(AppConstants.MODAL_CONTENT).click();
    })
  }

  searchReservation() {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.findReservationByName(this.parking.id, this.username)
      .subscribe(reservations => {
        if(reservations) {
          this.foundReservations = reservations;
          this.todayResTrigger = false;
          this.foundReservationsTrigger = true;
        }
      }, error => {
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.reloadTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      });
  }

  searchLot() {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getLotByParkingAndNumber(this.parking.id, this.lotNumber)
      .subscribe(response => {
        if(response) {
          this.foundLot = response;
          //noinspection TypeScriptUnresolvedFunction
          this.parkingService.getReservationsByParkingAndLot(this.parking.id, this.foundLot.number).subscribe(response => {
            if(response) {
              this.foundLotReservations = response;
            }
          }, error => {
            console.log(error);
          })
        } else {
          this.foundLot = null;
        }
        this.todayResTrigger = false;
        this.foundReservationsTrigger = false;
        this.searchLotTrigger = true;
      }, error => {
        this.title = AppConstants.ERROR_TITLE;
        this.text = AppConstants.ERROR_TEXT;
        this.reloadTrigger = false;
        document.getElementById(AppConstants.MODAL_CONTENT).click();
      });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if (result == AppConstants.OK) {
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
