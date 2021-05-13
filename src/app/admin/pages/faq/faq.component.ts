import { Component, OnInit } from '@angular/core';
import { Section } from '@models';
import { FaqService } from '@admin-services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SectionEditComponent } from '../../components/section-edit/section-edit.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public sections: Section[];
  public tag: Section = new Section();
  private destroy$ = new Subject();

  constructor(private faqService: FaqService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.faqService
        .getSections()
        .subscribe(
          (data) => {
            this.sections = data;
          }
        );
  }

  public addSection(): void {
    const initialState = {
      section: new Section(),
      type: 'new'
    };
    const modal = this.modalService.show(SectionEditComponent, { initialState });
    modal.content
         .onSectionUpdate
         .subscribe(
           (data) => {
              this.sections.unshift(data);
              modal.hide();
         });
  }

  public editSection(section: Section): void {
    const initialState = { section, type: 'edit' };
    const modal = this.modalService.show(SectionEditComponent, { initialState });

    modal.content
         .onSectionUpdate
         .subscribe(
           (data) => {
              section._fromJSON(data._toJSON());
              this.sections.splice(this.sections.indexOf(section), 1, data);
              modal.hide();
          });
  }

  public deleteSection(section: Section): void {
    if (confirm(`Do you really want to delete the section (${section.title})?`)) {
      this.faqService.deleteSection(section)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.sections.splice(this.sections.findIndex((t) => t === section), 1);
        });
    }
  }

}
