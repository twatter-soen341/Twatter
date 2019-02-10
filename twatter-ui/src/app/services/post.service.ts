import { Post } from '../models/post.model';
import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/auth.model';
import { mergeMap } from 'rxjs/operators';

const BASE_URL = `${environment.baseUrl}`;

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}

    getPosts() {
      this.http
      .get<{message: string, posts: any}>( `${BASE_URL}/twat`)
      .pipe(map((postData) => {
        return postData.posts.map(post => {

        return {
          id: post._id,
          userId: post.user._id,
          firstName: post.user.firstName,
          lastName: post.user.lastName,
          timeStamp: post.timeStamp,
          content: post.content
        };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
        }
      );
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(aPost: Post) {
        const post: Post = {
            id: null,
            userId: aPost.userId,
            firstName: aPost.firstName,
            lastName: aPost.lastName,
            timeStamp: aPost.timeStamp,
            content: aPost.content
        };
        this.http
        .post<{message: string, postId: string}>(`${BASE_URL}/twat`, post)
        .subscribe((responseData) => {
          const id = responseData.postId;
          post.id = id;
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: string) {
      console.log(postId);
      this.http.delete(`${BASE_URL}/twat/` + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
    }
}
