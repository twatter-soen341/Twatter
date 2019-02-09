import { Post } from '../models/post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const BASE_URL = `${environment.baseUrl}/twat`;

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}

    getPosts() {
      this.http
      .get<{message: string, posts: any}>( `${BASE_URL}/`)
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            id: post._id,
            userId: post.userId,
            userName: post.userName,
            firstName: post.firstName,
            lastName: post.lastName,
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
        console.log(aPost);
        const post: Post = {
            id: null,
            userId: aPost.userId,
            userName: aPost.userName,
            firstName: aPost.firstName,
            lastName: aPost.lastName,
            timeStamp: aPost.timeStamp,
            content: aPost.content
        };
        this.http
        .post<{message: string, postId: string}>(`${BASE_URL}/`, post)
        .subscribe((responseData) => {
          const id = responseData.postId;
          post.id = id;
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: string) {
      this.http.delete(`${BASE_URL}/` + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
    }
}
