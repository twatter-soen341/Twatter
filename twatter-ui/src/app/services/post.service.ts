import { Post } from '../models/post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    getPosts() {
        return [...this.posts]; /// creates a new array and returns that copied array.
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    setUser(userID) {

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
        .post<{message: string, postId: string}>(`${BASE_URL}`, post)
        .subscribe((responseData) => {
          const id = responseData.postId;
          post.id = id;
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
        });
    }
}
