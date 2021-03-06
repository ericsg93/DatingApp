import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { pagination, PaginatedResult } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {


  users: User[];
  pagination: pagination;
  likesParam: string;


  constructor(private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService) { }

  ngOnInit(): void {
    this.route.data.subscribe(res => {
      this.users = res['users'].result;
      this.pagination = res['users'].pagination;
    });

    this.likesParam = 'Likers';

  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        null,
        this.likesParam
      )
      .subscribe(
        (res: PaginatedResult<User[]>) => {
          // users es el response de tipo User arreglo
          this.users = res.result;
          this.pagination = res.pagination;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }



}
