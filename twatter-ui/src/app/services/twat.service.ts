import {Twat, ReturnedTwat} from '../models/twat.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

const BASE_URL = `${environment.baseUrl}/twat`;

@Injectable({providedIn: 'root'})
export class TwatsService {
  private twats: Twat[] = [];
  private twatsUpdated = new Subject<Twat[]>();

  constructor(private http: HttpClient) {
  }

  getTwat(id: string) {
    return this.http.get<{
      message: string,
      twat: ReturnedTwat,
    }>(`${BASE_URL}/${id}`);
  }

  // function which gets the twats of a user from the database
  getUserTwats(userId: string) {
    this.http
      .get<{ message: string, twats: any }>(`${BASE_URL}/user/${userId}`)
      .pipe(map((twatData) => {
        return twatData.twats.map(twat => {
          return {
            id: twat._id,
            userId: twat.user ? twat.user._id : -1,
            firstName: twat.user ? twat.user.firstName : -1,
            lastName: twat.user ? twat.user.lastName : -1,
            timeStamp: this.formatDate(new Date(twat.timeStamp)),
            content: twat.content,
            likedBy: twat.likedBy,
            comments: twat.comments
          };
        });
      }))
      .subscribe((transformedTwats) => {
          this.twats = transformedTwats;
          this.twatsUpdated.next([...this.twats]);
        }
      );
  }

  // Function which returns all the twats
  getTwats() {
    this.http
      .get<{ message: string, twats: any }>(`${BASE_URL}`)
      .pipe(map((twatData) => {
        return twatData.twats.map(twat => {

          return {
            id: twat._id,
            userId: twat.user ? twat.user._id : -1,
            firstName: twat.user ? twat.user.firstName : -1,
            lastName: twat.user ? twat.user.lastName : -1,
            timeStamp: this.formatDate(new Date(twat.timeStamp)),
            content: twat.content,
            likedBy: twat.likedBy,
            comments: twat.comments
          };
        });
      }))
      .subscribe((transformedTwats) => {
          this.twats = transformedTwats;
          this.twatsUpdated.next([...this.twats]);
        }
      );
  }

  getTwatUpdateListener() {
    return this.twatsUpdated.asObservable();
  }

  addTwat(aTwat) {
    const twat: Twat = {
      id: null,
      userId: aTwat.userId,
      firstName: aTwat.firstName,
      lastName: aTwat.lastName,
      timeStamp: this.formatDate(new Date(aTwat.timeStamp)),
      content: aTwat.content,
      likedBy: aTwat.likedBy,
      comments: []
    };
    this.http
      .post<{ message: string, twatId: string }>(`${BASE_URL}`, twat)
      .subscribe((responseData) => {
        const id = responseData.twatId;
        twat.id = id;
        this.twats.unshift(twat);
        this.twatsUpdated.next([...this.twats]);
      });
  }

  updateTwat(aTwat) {
    const twat: Twat = {
      id: aTwat.id,
      userId: aTwat.userId,
      firstName: aTwat.firstName,
      lastName: aTwat.lastName,
      timeStamp: this.formatDate(new Date(aTwat.timeStamp)),
      content: aTwat.content,
      likedBy: aTwat.likedBy,
      comments: aTwat.comments
    };
    console.log(aTwat.likedBy);
    this.http
      .put(`${BASE_URL}/${aTwat.id}`, twat)
      .subscribe(response => {
        const updatedTwats = [...this.twats];
        const oldTwatIndex = updatedTwats.findIndex(t => t.id === twat.id);
        updatedTwats[oldTwatIndex] = twat;
        this.twats = updatedTwats;
        this.twatsUpdated.next([...this.twats]);
      });
  }

  deleteTwat(twatId: string) {
    this.http.delete(`${BASE_URL}/${twatId}`)
      .subscribe(() => {
        const updatedTwats = this.twats.filter(twat => twat.id !== twatId);
        this.twats = updatedTwats;
        this.twatsUpdated.next([...this.twats]);
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

  searchTwat(words: string) {
    const query = { search: words };
    return this.http.post<any>(`${BASE_URL}/search`, query)
    .pipe(map((twatData) => {
      try {
        return twatData.map(twat => {
          return {
            id: twat._id,
            userId: twat.user ? twat.user._id : -1,
            firstName: twat.user ? twat.user.firstName : -1,
            lastName: twat.user ? twat.user.lastName : -1,
            timeStamp: this.formatDate(new Date(twat.timeStamp)),
            content: twat.content,
            likedBy: twat.likedBy,
            comments: twat.comments
          };
        });
      } catch (error) {
        throw new Error('No results found.');
      }
    }));
  }
}
