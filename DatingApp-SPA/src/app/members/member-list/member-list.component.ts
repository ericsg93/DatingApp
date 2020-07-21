import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((res) => {
      this.users = res['users'];
    });
  }
  /* 
  loadUsers() {
    this.userService.getUsers().subscribe(
      (res: User[]) => {
        // users es el response de tipo User arreglo
        this.users = res;
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  } */
}
