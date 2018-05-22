import {OnInit} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {Component} from "@angular/core";
import {UserService} from "../../shared/services/user.service";
import {AppConstants} from "../../shared/constants";

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
  animations: [routerTransition()]
})
export class HistoryPageComponent implements OnInit {

  currentUser: any;
  history: any = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem(AppConstants.CURRENT_USER));

    //noinspection TypeScriptUnresolvedFunction
    this.userService.getHistory(this.currentUser.id)
      .subscribe(response => {
        this.history = response;
      });
  }
}
