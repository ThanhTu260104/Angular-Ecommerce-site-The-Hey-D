import { TestBed } from '@angular/core/testing';

import { LoaiService } from './loai.service';

describe('LoaiService', () => {
  let service: LoaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
