import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Section, Question } from '@models';
import { FaqService } from '@core-services';
import { Observable } from 'rxjs';

const urlRegex = /(https?:\/\/[^\s]+)/g;

@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss']
})
export class FaqSectionComponent {
  public section$: Observable<Section>;
  public questions: Observable<Question[]>;

  constructor(
    private route: ActivatedRoute,
    private faqService: FaqService,
  ) {
    this.route.params.subscribe(({sectionId}) => {
      this.section$ = this.faqService.getSection(sectionId);
    });
  }

  public transformContent(content: string): string {
    return content.replace(urlRegex, url => {
      return `<a href="${url}" target="_blank">${url}</a>`;
    }).replace(/\n/g, '<br>');
  }
}
