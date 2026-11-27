import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {ClassService, GymClass} from '../../services/class.service';
import {LanguageService} from '../../services/language.service';
import {ClassesViewComponent} from './classes-view.component';

describe('ClassesViewComponent localization', () => {
  it('updates day labels without changing their scroll targets', () => {
    const gymClass = {
      id: 'class-1',
      start_time: new Date(2030, 11, 1, 10).toISOString(),
      end_time: new Date(2030, 11, 1, 11).toISOString(),
      free_slots: 2,
      total_slots: 10,
      activity: {name: 'Strength'},
      room: {name: 'Studio A'},
      instructor: {name: 'Alex'},
    } as GymClass;

    TestBed.configureTestingModule({
      imports: [ClassesViewComponent],
      providers: [{provide: ClassService, useValue: {classes: signal([gymClass]), myBookings: signal([])}}],
    });

    const component = TestBed.createComponent(ClassesViewComponent).componentInstance;
    const language = TestBed.inject(LanguageService);
    language.setLanguage('en');
    const englishDay = component.groupedClasses()[0];

    language.setLanguage('es');
    const spanishDay = component.groupedClasses()[0];

    expect(englishDay.id).toBe('day-2030-12-01');
    expect(spanishDay.id).toBe(englishDay.id);
    expect(englishDay.date).toContain('Sunday');
    expect(spanishDay.date).toContain('domingo');
    expect(spanishDay.weekday).toBe('DOM');
  });
});
