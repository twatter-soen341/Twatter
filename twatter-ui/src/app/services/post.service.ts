import { Post } from '../models/post.model';
import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/auth.model';
import { mergeMap } from 'rxjs/operators';

const BASE_URL = `${environment.baseUrl}/twat`;

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}

    getPost(id: string) {
      return this.http.get<{
        _id: string,
        userId: string,
        firstName: string,
        lastName: string,
        timeStamp: number,
        content: string
      }>(`${BASE_URL}/${id}`);
    }

    getPosts() {
      this.http
      .get<{message: string, posts: any}>( `${BASE_URL}`)
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
        .post<{message: string, postId: string}>(`${BASE_URL}`, post)
        .subscribe((responseData) => {
          const id = responseData.postId;
          post.id = id;
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
        });
    }

    updatePost(postId: string, firstName: string, lastName: string, timeStamp: number, content: string) {
      const post: Post = {id: postId, userId: null, firstName: firstName, lastName: lastName, timeStamp: timeStamp, content: content};
      this.http
        .put(`${BASE_URL}/${postId}`, post)
        .subscribe(response => {
          const updatedPosts = [...this.posts];
          const oldPostIndex = updatedPosts.findIndex(aPost => aPost.id === post.id);
          updatedPosts[oldPostIndex] = post;
          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: string) {
      console.log(postId);
      this.http.delete(`${BASE_URL}/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
    }
}
