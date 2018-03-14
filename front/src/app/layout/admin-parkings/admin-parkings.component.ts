import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {OnInit} from "@angular/core";
import {ParkingService} from "../../shared/services/parking.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-admin-parkings',
  templateUrl: './admin-parkings.component.html',
  styleUrls: ['./admin-parkings.component.scss'],
  animations: [routerTransition()]
})
export class AdminParkingsComponent implements OnInit {

  private searchParkingTrigger: boolean = false;
  private showAllTrigger: boolean = false;
  private searchTerm: string;
  private foundParkings: any = [];
  private allParkings: any = [];
  private title: string;
  private text: string;

  constructor(private parkingService: ParkingService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  onSearchParkingAreas() {
    this.searchParkingTrigger = true;
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.searchByTerm(this.searchTerm).subscribe(response => {
      if (response) {
        this.foundParkings = response;
      }
    }, error => {
      console.log(error);
      this.title = "Search Error";
      this.text = "An unexpected error occurred. Please try again!";
      document.getElementById('modalCont').click();
    });
  }

  onShowAll() {
    this.showAllTrigger = true;
    //noinspection TypeScriptUnresolvedFunction
    this.parkingService.getAll().subscribe(response => {
      if(response) {
        this.allParkings = response;
      }
    }, error => {
      console.log(error);
      this.title = "Search Error";
      this.text = "An unexpected error occurred. Please try again!";
      document.getElementById('modalCont').click();
    });
  }

  open(content) {
    //noinspection TypeScriptUnresolvedFunction
    this.modalService.open(content).result.then((result) => {
      if(result == "OK") {
        return;
      }
    }, (reason) => {
      return;
    });
  }

}
