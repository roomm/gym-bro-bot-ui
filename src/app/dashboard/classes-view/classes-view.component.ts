import {ChangeDetectionStrategy, Component, computed, inject, output, signal} from '@angular/core';
import {format, isAfter, isBefore, subMinutes} from 'date-fns';
import {Booking, ClassService, GymClass} from '../../services/class.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-classes-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './classes-view.component.html',
})
export class ClassesViewComponent {
  readonly classService = inject(ClassService);
  readonly i18n = inject(LanguageService);
  readonly viewBookings = output<void>();
  readonly activeDay = signal<string | null>(null);

  readonly groupedClasses = computed(() => {
    const classes = this.classService.classes().filter(cls => !this.isPast(cls.start_time));
    const grouped = new Map<string, GymClass[]>();
    const language = this.i18n.language();
    const locale = this.i18n.dateLocale();

    for (const cls of classes) {
      const dayKey = format(new Date(cls.start_time), 'yyyy-MM-dd');
      if (!grouped.has(dayKey)) {
        grouped.set(dayKey, []);
      }
      grouped.get(dayKey)!.push(cls);
    }

    return Array.from(grouped.entries()).map(([id, items]) => {
      const parsedDate = new Date(items[0].start_time);
      return {
        date: language === 'ca'
          ? new Intl.DateTimeFormat('ca-ES', {weekday: 'long', day: 'numeric', month: 'long'}).format(parsedDate)
          : format(parsedDate, language === 'es' ? "EEEE, d 'de' MMMM" : 'EEEE, MMM do', {locale}),
        weekday: format(parsedDate, 'EEE', {locale}).toUpperCase(),
        dayNumber: format(parsedDate, 'd'),
        id: `day-${id}`,
        classes: items,
      };
    });
  });

  scrollToDay(dayId: string) {
    this.activeDay.set(dayId);
    const element = document.getElementById(dayId);
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  formatTime(iso: string) {
    return format(new Date(iso), 'HH:mm');
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
    const windowStart = subMinutes(startTime, 24 * 60 + 15);
    const now = new Date();
    return isAfter(now, windowStart) && isBefore(now, startTime);
  }

  getBookingForClass(classId: string): Booking | undefined {
    return this.classService.myBookings().find(booking => booking.class_id === classId);
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
      return;
    }

    const gymClass = this.classService.classes().find(cls => cls.id === booking.class_id);
    if (gymClass) {
      this.classService.cancelScheduledClass(gymClass).subscribe();
    }
  }
}
