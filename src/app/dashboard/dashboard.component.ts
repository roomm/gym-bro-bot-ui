import {ChangeDetectionStrategy, Component, inject, OnInit, computed, signal, HostListener} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../services/auth.service';
import {ClassService, GymClass, Booking} from '../services/class.service';
import {isBefore, isAfter, subHours, format} from 'date-fns';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `./dashboard.component.html`,
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  classService = inject(ClassService);

  activeTab = signal<'schedule' | 'bookings'>('schedule');
  showScrollToTop = signal(false);

  groupedClasses = computed(() => {
    const classes = this.classService.classes().filter(cls => !this.isPast(cls.start_time));
    const grouped = new Map<string, GymClass[]>();

    for (const cls of classes) {
      const dateStr = format(new Date(cls.start_time), 'EEEE, MMM do');
      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, []);
      }
      grouped.get(dateStr)!.push(cls);
    }

    return Array.from(grouped.entries()).map(([date, items]) => {
      const parsedDate = new Date(items[0].start_time);
      return {
        date,
        shortDate: format(parsedDate, 'EEE, MMM d'),
        id: date.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        classes: items
      };
    });
  });

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showScrollToTop.set(window.scrollY > 400);
  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  scrollToDay(dayId: string) {
    const element = document.getElementById(dayId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }

  myBookingsDetailed = computed(() => {
    const bookings = this.classService.myBookings();
    const classes = this.classService.classes();
    return bookings
      .map(b => {
        const cls = classes.find(c => c.id === b.class_id);
        return cls ? {booking: b, cls} : null;
      })
      .filter((x): x is { booking: Booking, cls: GymClass } => x !== null && !this.isPast(x.cls.start_time))
      .sort((a, b) => new Date(a.cls.start_time).getTime() - new Date(b.cls.start_time).getTime());
  });

  ngOnInit() {
    this.classService.fetchClasses();
    this.classService.fetchMyBookings();
  }

  formatDate(iso: string) {
    return format(new Date(iso), 'MMM do, yyyy');
  }

  formatTime(iso: string) {
    return format(new Date(iso), 'h:mm a');
  }

  getDuration(startIso: string, endIso: string) {
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    return Math.round((end - start) / 60000);
  }

  isPast(iso: string) {
    return isBefore(new Date(iso), new Date());
  }

  isWithinWindow(iso: string) {
    const startTime = new Date(iso);
    const windowStart = subHours(startTime, 24);
    const now = new Date();
    return isAfter(now, windowStart) && isBefore(now, startTime);
  }

  getBookingForClass(classId: string): Booking | undefined {
    return this.classService.myBookings().find(b => b.class_id === classId);
  }

  bookClass(classId: string) {
    this.classService.bookClass(classId).subscribe();
  }

  scheduleClass(gymClass: GymClass) {
    this.classService.scheduleClass(gymClass).subscribe();
  }

  cancelBooking(booking: Booking) {
    if (booking.status === 'CONFIRMED') {
      this.classService.cancelBooking(booking.class_id).subscribe();
    } else {
      const classes = this.classService.classes();
      const gymClass = classes.find(c => c.id === booking.class_id)
      if (gymClass) {
        this.classService.cancelScheduledClass(gymClass).subscribe();
      }
    }
  }

}
