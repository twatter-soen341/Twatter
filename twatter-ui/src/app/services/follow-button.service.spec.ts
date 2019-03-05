import { TestBed } from '@angular/core/testing';

import { FollowButtonService } from './follow-button.service';

describe('FollowButtonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FollowButtonService = TestBed.get(FollowButtonService);
    expect(service).toBeTruthy();
  });
});
