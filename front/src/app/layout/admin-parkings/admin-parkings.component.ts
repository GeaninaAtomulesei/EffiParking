import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppConstants} from "../../shared/constants";

@Component({
  selector: 'app-admin-parkings',
  templateUrl: './admin-parkings.component.html',
  styleUrls: ['./admin-parkings.component.scss'],
  animations: [routerTransition()]
})
export class AdminParkingsComponent implements OnInit {

   searchParkingTrigger: boolean = false;
   showAllTrigger: boolean = false;
   searchTerm: string;
   foundParkings: any = [];
   allParkings: any = [];
   title: string;
   text: string;

  constructor(private parkingService: ParkingService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  onSearchParkingAreas() {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.searchByTerm(this.searchTerm).subscribe(response => {
      if (response) {
        this.foundParkings = response;
        this.searchParkingTrigger = true;
      }
    }, error => {
      console.log(error);
      this.title = AppConstants.ERROR_TITLE;
      this.text = AppConstants.ERROR_TEXT;
      document.getElementById(AppConstants.MODAL_CONTENT).click();
    });
  }

  onShowAll() {
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getAll().subscribe(response => {
      if(response) {
        this.allParkings = response;
        this.showAllTrigger = true;
      }
    }, error => {
      console.log(error);
      this.title = AppConstants.ERROR_TITLE;
      this.text = AppConstants.ERROR_TEXT;
      document.getElementById(AppConstants.MODAL_CONTENT).click();
    });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if(result == AppConstants.OK) {
        return;
      }
    }, (reason) => {
      return;
    });
  }

}
