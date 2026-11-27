import {ChangeDetectionStrategy, Component, computed, inject, output} from '@angular/core';
import {format, isBefore} from 'date-fns';
import {Booking, ClassService, GymClass} from '../../services/class.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-bookings-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bookings-view.component.html',
})
export class BookingsViewComponent {
  readonly classService = inject(ClassService);
  readonly i18n = inject(LanguageService);
  readonly viewSchedule = output<void>();

  readonly bookings = computed(() => {
    const classes = this.classService.classes();
    return this.classService.myBookings()
      .map(booking => {
        const cls = classes.find(item => item.id === booking.class_id);
        return cls ? {booking, cls} : null;
      })
      .filter((item): item is {booking: Booking; cls: GymClass} =>
        item !== null && !isBefore(new Date(item.cls.start_time), new Date()))
      .sort((a, b) => new Date(a.cls.start_time).getTime() - new Date(b.cls.start_time).getTime());
  });

  formatDate(iso: string) {
    return format(new Date(iso), this.i18n.language() === 'es' ? "d 'de' MMM 'de' yyyy" : 'MMM do, yyyy', {locale: this.i18n.dateLocale()});
  }

  formatTime(iso: string) {
    return format(new Date(iso), 'HH:mm');
  }

  getDuration(startIso: string, endIso: string) {
    return Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
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
