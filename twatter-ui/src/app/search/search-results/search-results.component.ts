import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/auth.model';
import { Post } from 'src/app/models/post.model';
import { UserService } from 'src/app/services/user.service';
import { PostsService } from 'src/app/services/post.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  private searchValue: string[];
  users: { user: User; error: string; firstName: string, lastName: string }[];
  posts: { post: Post; error: string}[];
  userError = false;
  postError = false;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private postsService: PostsService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params.search);
      this.searchValue = params.search.split(' ');

      /* Users */
      this.userService.searchUser(this.searchValue[0]).subscribe(result => {
        if (result.message) {
          this.users = null;
          this.userError = true;
        } else {
          this.users = result;
          this.userError = false;
        }
      });
      /* TODO Posts */
      /* TODO Comments */
    });
  }
}
