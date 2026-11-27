import {Injectable, PLATFORM_ID, inject, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ca, enUS, es} from 'date-fns/locale';

export type Language = 'en' | 'es' | 'ca';

const messages = {
  en: {
    language: 'Language',
    mainNavigation: 'Main navigation',
    scheduleTab: 'Class schedule',
    bookingsTab: 'My bookings',
    signOut: 'Sign out',
    loadingClasses: 'Loading classes…',
    scrollToTop: 'Scroll to top',
    noClassesEyebrow: 'Nothing on the calendar',
    noClassesTitle: 'No upcoming classes',
    noClassesDescription: 'Check back later for new sessions.',
    jumpToDay: 'Jump to',
    pickDay: 'Pick a day',
    session: 'SESSION',
    sessions: 'SESSIONS',
    with: 'WITH',
    minutes: 'MIN',
    noSpots: 'NO SPOTS LEFT',
    oneSpotLeft: 'SPOT LEFT',
    spotsLeft: 'SPOTS LEFT',
    booked: '✓ BOOKED',
    scheduled: '◷ SCHEDULED',
    confirmed: '✓ CONFIRMED',
    bookingFailed: 'BOOKING FAILED',
    manageBooking: 'Manage booking',
    full: 'FULL',
    bookNow: 'BOOK NOW',
    schedule: 'SCHEDULE',
    noBookingsEyebrow: 'Your calendar is clear',
    noBookingsTitle: 'No bookings yet',
    noBookingsDescription: 'Find a session you like and make it yours.',
    viewSchedule: 'VIEW SCHEDULE',
    comingUp: 'Coming up',
    cancelBooking: 'Cancel booking',
    footer: 'GOOD SESSIONS. GOOD PEOPLE. SEE YOU IN CLASS. ↗',
    loginEyebrow: 'Your training, on your time',
    loginHeadline: 'Make your',
    loginHeadlineAccent: 'move.',
    loginDescription: 'Find your next session. Show up strong.',
    loginFooter: 'GOOD SESSIONS. GOOD PEOPLE. ↗',
    welcomeBack: 'Welcome back',
    getInTheGame: 'Get in the game.',
    loginInstructions: 'Sign in to explore classes and manage your bookings.',
    email: 'EMAIL ADDRESS',
    emailPlaceholder: 'you@example.com',
    password: 'PASSWORD',
    passwordPlaceholder: 'Enter your password',
    signingIn: 'SIGNING IN…',
    signIn: 'SIGN IN',
    loginFailed: 'Login failed',
    invalidCredentials: 'Invalid credentials',
    bookFailed: 'Failed to book class',
    scheduleFailed: 'Failed to schedule class',
    cancelScheduleFailed: 'Failed to cancel scheduled class',
    cancelFailed: 'Failed to cancel booking',
  },
  es: {
    language: 'Idioma',
    mainNavigation: 'Navegación principal',
    scheduleTab: 'Horario de clases',
    bookingsTab: 'Mis reservas',
    signOut: 'Cerrar sesión',
    loadingClasses: 'Cargando clases…',
    scrollToTop: 'Volver arriba',
    noClassesEyebrow: 'Nada en el calendario',
    noClassesTitle: 'No hay próximas clases',
    noClassesDescription: 'Vuelve más tarde para ver nuevas sesiones.',
    jumpToDay: 'Ir a',
    pickDay: 'Elige un día',
    session: 'SESIÓN',
    sessions: 'SESIONES',
    with: 'CON',
    minutes: 'MIN',
    noSpots: 'SIN PLAZAS',
    oneSpotLeft: 'PLAZA LIBRE',
    spotsLeft: 'PLAZAS LIBRES',
    booked: '✓ RESERVADA',
    scheduled: '◷ PROGRAMADA',
    confirmed: '✓ CONFIRMADA',
    bookingFailed: 'RESERVA FALLIDA',
    manageBooking: 'Gestionar reserva',
    full: 'COMPLETA',
    bookNow: 'RESERVAR',
    schedule: 'PROGRAMAR',
    noBookingsEyebrow: 'Tu calendario está libre',
    noBookingsTitle: 'Aún no tienes reservas',
    noBookingsDescription: 'Encuentra una sesión que te guste y reserva tu plaza.',
    viewSchedule: 'VER HORARIO',
    comingUp: 'Próximas clases',
    cancelBooking: 'Cancelar reserva',
    footer: 'BUENAS SESIONES. BUENA COMPAÑÍA. NOS VEMOS EN CLASE. ↗',
    loginEyebrow: 'Entrena a tu ritmo',
    loginHeadline: 'Da el',
    loginHeadlineAccent: 'paso.',
    loginDescription: 'Encuentra tu próxima sesión. Entrena con ganas.',
    loginFooter: 'BUENAS SESIONES. BUENA COMPAÑÍA. ↗',
    welcomeBack: 'Te damos la bienvenida',
    getInTheGame: 'Ponte en marcha.',
    loginInstructions: 'Inicia sesión para explorar clases y gestionar tus reservas.',
    email: 'CORREO ELECTRÓNICO',
    emailPlaceholder: 'tu@ejemplo.com',
    password: 'CONTRASEÑA',
    passwordPlaceholder: 'Introduce tu contraseña',
    signingIn: 'INICIANDO SESIÓN…',
    signIn: 'INICIAR SESIÓN',
    loginFailed: 'No se pudo iniciar sesión',
    invalidCredentials: 'Credenciales incorrectas',
    bookFailed: 'No se pudo reservar la clase',
    scheduleFailed: 'No se pudo programar la clase',
    cancelScheduleFailed: 'No se pudo cancelar la clase programada',
    cancelFailed: 'No se pudo cancelar la reserva',
  },
  ca: {
    language: 'Idioma',
    mainNavigation: 'Navegació principal',
    scheduleTab: 'Horari de classes',
    bookingsTab: 'Les meves reserves',
    signOut: 'Tanca la sessió',
    loadingClasses: 'S’estan carregant les classes…',
    scrollToTop: 'Torna a dalt',
    noClassesEyebrow: 'No hi ha res al calendari',
    noClassesTitle: 'No hi ha classes pròximes',
    noClassesDescription: 'Torna més tard per veure noves sessions.',
    jumpToDay: 'Ves a',
    pickDay: 'Tria un dia',
    session: 'SESSIÓ',
    sessions: 'SESSIONS',
    with: 'AMB',
    minutes: 'MIN',
    noSpots: 'SENSE PLACES',
    oneSpotLeft: 'PLAÇA LLIURE',
    spotsLeft: 'PLACES LLIURES',
    booked: '✓ RESERVADA',
    scheduled: '◷ PROGRAMADA',
    confirmed: '✓ CONFIRMADA',
    bookingFailed: 'RESERVA FALLIDA',
    manageBooking: 'Gestiona la reserva',
    full: 'COMPLETA',
    bookNow: 'RESERVA',
    schedule: 'PROGRAMA',
    noBookingsEyebrow: 'Tens el calendari lliure',
    noBookingsTitle: 'Encara no tens reserves',
    noBookingsDescription: 'Troba una sessió que t’agradi i reserva-hi una plaça.',
    viewSchedule: 'VEURE L’HORARI',
    comingUp: 'Properes classes',
    cancelBooking: 'Cancel·la la reserva',
    footer: 'BONES SESSIONS. BONA GENT. ENS VEIEM A CLASSE. ↗',
    loginEyebrow: 'Entrena al teu ritme',
    loginHeadline: 'Fes el',
    loginHeadlineAccent: 'pas.',
    loginDescription: 'Troba la teva propera sessió. Entrena amb ganes.',
    loginFooter: 'BONES SESSIONS. BONA GENT. ↗',
    welcomeBack: 'Et donem la benvinguda',
    getInTheGame: 'Posa’t en marxa.',
    loginInstructions: 'Inicia sessió per explorar les classes i gestionar les teves reserves.',
    email: 'CORREU ELECTRÒNIC',
    emailPlaceholder: 'tu@exemple.cat',
    password: 'CONTRASENYA',
    passwordPlaceholder: 'Introdueix la contrasenya',
    signingIn: 'S’ESTÀ INICIANT LA SESSIÓ…',
    signIn: 'INICIA LA SESSIÓ',
    loginFailed: 'No s’ha pogut iniciar la sessió',
    invalidCredentials: 'Credencials incorrectes',
    bookFailed: 'No s’ha pogut reservar la classe',
    scheduleFailed: 'No s’ha pogut programar la classe',
    cancelScheduleFailed: 'No s’ha pogut cancel·lar la classe programada',
    cancelFailed: 'No s’ha pogut cancel·lar la reserva',
  },
} as const;

type MessageKey = keyof typeof messages.en;

@Injectable({providedIn: 'root'})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly language = signal<Language>(this.initialLanguage());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = this.language();
    }
  }

  t(key: MessageKey): string {
    return messages[this.language()][key];
  }

  sessionCount(count: number): string {
    return `${count} ${this.t(count === 1 ? 'session' : 'sessions')}`;
  }

  spots(count: number): string {
    return count === 0 ? this.t('noSpots') : `${count} ${this.t(count === 1 ? 'oneSpotLeft' : 'spotsLeft')}`;
  }

  dateLocale() {
    switch (this.language()) {
      case 'ca': return ca;
      case 'es': return es;
      default: return enUS;
    }
  }

  error(message: string | null): string {
    const fallback: Record<string, MessageKey> = {
      'Login failed': 'loginFailed',
      'Invalid credentials': 'invalidCredentials',
      'Failed to book class': 'bookFailed',
      'Failed to schedule class': 'scheduleFailed',
      'Failed to cancel scheduled class': 'cancelScheduleFailed',
      'Failed to cancel booking': 'cancelFailed',
    };
    return message ? (fallback[message] ? this.t(fallback[message]) : message) : '';
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = language;
      try {
        localStorage.setItem('gym_bro_language', language);
      } catch {
        // The current selection still works when storage is unavailable.
      }
    }
  }

  private initialLanguage(): Language {
    if (!isPlatformBrowser(this.platformId)) return 'en';
    try {
      const saved = localStorage.getItem('gym_bro_language');
      if (saved === 'en' || saved === 'es' || saved === 'ca') return saved;
    } catch {
      // Fall back to the browser language when storage is unavailable.
    }
    const browserLanguage = navigator.language.toLowerCase().split('-')[0];
    return browserLanguage === 'es' || browserLanguage === 'ca' ? browserLanguage : 'en';
  }
}
