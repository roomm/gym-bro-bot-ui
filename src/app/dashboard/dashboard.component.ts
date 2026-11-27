import {ChangeDetectionStrategy, Component, computed, HostListener, inject, OnInit, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ClassService} from '../services/class.service';
import {isBefore} from 'date-fns';
import {ClassesViewComponent} from './classes-view/classes-view.component';
import {BookingsViewComponent} from './bookings-view/bookings-view.component';
import {DashboardTab, HeaderComponent} from './header/header.component';
import {LanguageService} from '../services/language.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, HeaderComponent, ClassesViewComponent, BookingsViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `./dashboard.component.html`,
})
export class DashboardComponent implements OnInit {
  readonly classService = inject(ClassService);
  readonly i18n = inject(LanguageService);
  readonly activeTab = signal<DashboardTab>('schedule');
  readonly showScrollToTop = signal(false);
  readonly bookingCount = computed(() => {
    const classes = this.classService.classes();
    return this.classService.myBookings().filter(booking => {
      const gymClass = classes.find(cls => cls.id === booking.class_id);
      return gymClass && !isBefore(new Date(gymClass.start_time), new Date());
    }).length;
  });

  ngOnInit() {
    this.classService.fetchClasses();
    this.classService.fetchMyBookings();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showScrollToTop.set(window.scrollY > 400);
  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
