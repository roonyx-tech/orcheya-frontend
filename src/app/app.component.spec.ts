import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackService } from './shared/services/track.service';
import { MetrikaModule } from 'ng-yandex-metrika';
import { environment } from '../environments/environment';
import { Angulartics2Module } from 'angulartics2';


describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        Angulartics2Module.forRoot(),
        MetrikaModule.forRoot({
          id: environment.YANDEX_METRIKA,
          webvisor: true,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
        }),
      ],
      declarations: [
        AppComponent
      ],
      providers: [TrackService]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
