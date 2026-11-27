import {TestBed} from '@angular/core/testing';
import {format} from 'date-fns';
import {LanguageService} from './language.service';

describe('LanguageService', () => {
  afterEach(() => {
    localStorage.removeItem('gym_bro_language');
    document.documentElement.lang = 'en';
  });

  it('restores the saved language and updates the document language', () => {
    localStorage.setItem('gym_bro_language', 'es');
    const language = TestBed.inject(LanguageService);

    expect(language.language()).toBe('es');
    expect(document.documentElement.lang).toBe('es');
    expect(language.t('scheduleTab')).toBe('Horario de clases');
    expect(language.sessionCount(1)).toBe('1 SESIÓN');
    expect(language.sessionCount(2)).toBe('2 SESIONES');
    expect(language.spots(0)).toBe('SIN PLAZAS');
    expect(language.spots(3)).toBe('3 PLAZAS LIBRES');
    expect(language.error('Invalid credentials')).toBe('Credenciales incorrectas');
  });

  it('switches language immediately, persists it and formats dates in Spanish', () => {
    const language = TestBed.inject(LanguageService);
    language.setLanguage('es');

    expect(localStorage.getItem('gym_bro_language')).toBe('es');
    expect(document.documentElement.lang).toBe('es');
    expect(format(new Date(2026, 10, 27), 'EEEE, d MMMM', {locale: language.dateLocale()}))
      .toBe('viernes, 27 noviembre');

    language.setLanguage('en');
    expect(language.t('scheduleTab')).toBe('Class schedule');
    expect(language.spots(1)).toBe('1 SPOT LEFT');
    expect(document.documentElement.lang).toBe('en');
  });
});
