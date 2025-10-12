import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardgameCardComponent } from './boardgame-card.component';

describe('BoardgameCardComponent', () => {
  let component: BoardgameCardComponent;
  let fixture: ComponentFixture<BoardgameCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardgameCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardgameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
