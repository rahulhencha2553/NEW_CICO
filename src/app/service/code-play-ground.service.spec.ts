import { TestBed } from '@angular/core/testing';

import { CodePlayGroundService } from './code-play-ground.service';

describe('CodePlayGroundService', () => {
  let service: CodePlayGroundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodePlayGroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
