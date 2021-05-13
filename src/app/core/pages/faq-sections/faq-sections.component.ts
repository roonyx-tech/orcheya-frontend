import { Component } from '@angular/core';
import { FaqService } from '@core-services';
import { Section } from '@models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-faq-sections',
  templateUrl: './faq-sections.component.html',
  styleUrls: ['./faq-sections.component.scss']
})
export class FaqSectionsComponent {
  public sections$: Observable<Section[]>;

  constructor(private faqService: FaqService) {
    this.sections$ = this.faqService.getSections();
  }
}
