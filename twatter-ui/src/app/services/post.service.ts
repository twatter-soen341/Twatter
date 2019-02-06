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

    addPost(aPost: Post) {
        const post: Post = {
            user: aPost.user,
            timeStamp: aPost.timeStamp,
            content: aPost.content
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}
