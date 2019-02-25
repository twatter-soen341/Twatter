import {Post, ReturnedPost} from '../models/post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

const BASE_URL = `${environment.baseUrl}/twat`;

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {
  }

  getPost(id: string) {
    return this.http.get<{
      message: string,
      post: ReturnedPost,
    }>(`${BASE_URL}/${id}`);
  }

  getUserPosts(userId: string) {
    this.http
      .get<{ message: string, posts: any }>(`${BASE_URL}/user/${userId}`)
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            id: post._id,
            userId: post.user ? post.user._id : -1,
            firstName: post.user ? post.user.firstName : -1,
            lastName: post.user ? post.user.lastName : -1,
            timeStamp: this.formatDate(new Date(post.timeStamp)),
            content: post.content,
            likedBy: post.likedBy,
            comments: post.comments
          };
        });
      }))
      .subscribe((transformedPosts) => {
          this.posts = transformedPosts;
          this.postsUpdated.next([...this.posts]);
        }
      );
  }

  getPosts() {
    this.http
      .get<{ message: string, posts: any }>(`${BASE_URL}`)
      .pipe(map((postData) => {
        return postData.posts.map(post => {

          return {
            id: post._id,
            userId: post.user ? post.user._id : -1,
            firstName: post.user ? post.user.firstName : -1,
            lastName: post.user ? post.user.lastName : -1,
            timeStamp: this.formatDate(new Date(post.timeStamp)),
            content: post.content,
            likedBy: post.likedBy,
            comments: post.comments
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

  addPost(aPost) {
    const post: Post = {
      id: null,
      userId: aPost.userId,
      firstName: aPost.firstName,
      lastName: aPost.lastName,
      timeStamp: this.formatDate(new Date(aPost.timeStamp)),
      content: aPost.content,
      likedBy: aPost.likedBy,
      comments: []
    };
    this.http
      .post<{ message: string, postId: string }>(`${BASE_URL}`, post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.unshift(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(aPost) {
    const post: Post = {
      id: aPost.id,
      userId: aPost.userId,
      firstName: aPost.firstName,
      lastName: aPost.lastName,
      timeStamp: this.formatDate(new Date(aPost.timeStamp)),
      content: aPost.content,
      likedBy: aPost.likedBy,
      comments: aPost.comments
    };
    console.log(aPost.likedBy);
    this.http
      .put(`${BASE_URL}/${aPost.id}`, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(aPost => aPost.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete(`${BASE_URL}/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  formatDate(date) {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${monthNames[monthIndex]} ${day}, ${year}`;
  }

  searchPost(words: string) {
    const query = { search: words };
    console.log(`searchPost calling api with %c${words}`, 'font-weight:bold');
    return this.http.post<any>(`${BASE_URL}/search`, query);
  }
}
