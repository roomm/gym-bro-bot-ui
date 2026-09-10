import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {format, isAfter, isBefore, subHours} from 'date-fns';
import {Booking, ClassService, GymClass} from '../../services/class.service';

@Component({
  selector: 'app-classes-view',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './classes-view.component.html',
})
export class ClassesViewComponent {
  readonly classService = inject(ClassService);

  readonly groupedClasses = computed(() => {
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
        classes: items,
      };
    });
  });

  scrollToDay(dayId: string) {
    const element = document.getElementById(dayId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
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
