import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {LanguageService} from '../../services/language.service';
import {MatIconModule} from '@angular/material/icon';

export type DashboardTab = 'schedule' | 'bookings';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  readonly i18n = inject(LanguageService);
  readonly activeTab = input.required<DashboardTab>();
  readonly bookingCount = input.required<number>();
  readonly tabChange = output<DashboardTab>();
}
