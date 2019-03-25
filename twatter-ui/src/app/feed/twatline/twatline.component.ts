import {
  Component,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Twat } from '../../models/twat.model';
import { TwatsService } from '../../services/twat.service';

@Component({
  selector: 'app-twatline',
  templateUrl: './twatline.component.html',
  styleUrls: ['./twatline.component.scss']
})
export class TwatlineComponent implements OnInit {

  twats: Twat[] = [];
  private twatsSub: Subscription;
  constructor(public aTwatsService: TwatsService) {}

  ngOnInit() {
    this.aTwatsService.getTwats();
      this.twatsSub = this.aTwatsService.getTwatUpdateListener().subscribe(
        (twats: Twat[]) => {
          this.twats = twats;
        }
      );
  }
}
