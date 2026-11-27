import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {AuthService} from '../../services/auth.service';

export type DashboardTab = 'schedule' | 'bookings';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  readonly activeTab = input.required<DashboardTab>();
  readonly bookingCount = input.required<number>();
  readonly tabChange = output<DashboardTab>();
}
