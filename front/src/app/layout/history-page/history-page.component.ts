import {OnInit} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
  animations: [routerTransition()]
})
export class HistoryPageComponent implements OnInit {

  private currentUser: any;
  private history: any = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    this.userService.getHistory(this.currentUser.id)
      .subscribe(response => {
        this.history = response;
      });
  }
}
