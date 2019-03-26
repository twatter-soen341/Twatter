import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-display-user-list',
  templateUrl: './display-user-list.component.html',
  styleUrls: ['./display-user-list.component.scss']
})
export class DisplayUserListComponent implements OnChanges {
  @Input() list: Observable<any>;
  @Input() label: String;

constructor() {}
ngOnChanges(changes: SimpleChanges) {}
}
