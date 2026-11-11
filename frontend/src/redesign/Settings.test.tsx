import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ToastProvider } from '../design-system-2026/components';
import {
  APPEARANCE_STORAGE_KEY,
  AppearanceProvider
} from '../design-system-2026/components/Theme/AppearanceProvider';
import Settings from './Settings';

jest.mock('../components/Common/FirestoreDataProvider', () => ({ useSelf: () => null }));
jest.mock('../components/Common/UserProvider/UserProvider', () => ({ useUserEmail: () => '' }));

beforeAll(() => {
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
});
afterAll(() => {
  Reflect.deleteProperty(window, 'PointerEvent');
});

test('renders the theme groups and restores the chosen accent after leaving a Special theme', () => {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn().mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  });
  localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify({ theme: 'dark', accent: 'pink' }));

  try {
    render(
      <AppearanceProvider>
        <ToastProvider>
          <Settings />
        </ToastProvider>
      </AppearanceProvider>
    );
    const defaultThemes = screen.getByRole('radiogroup', { name: 'Default theme' });
    const specialThemes = screen.getByRole('radiogroup', { name: 'Special theme' });
    const accentGroup = screen.getByRole('radiogroup', { name: 'Accent color' });
    const accent = within(accentGroup);
    expect(within(defaultThemes).getAllByRole('radio')).toHaveLength(3);
    expect(within(specialThemes).getAllByRole('radio')).toHaveLength(6);
    expect(defaultThemes.nextElementSibling).toContainElement(accentGroup);
    expect(accent.getByRole('radio', { name: 'Pink' })).toBeChecked();

    const editProfile = screen.getByRole('link', { name: 'Edit profile' });
    expect(editProfile.querySelector('svg')).toBeInTheDocument();
    ['Pumpkin', 'Hacker', 'Fantasy', 'Spotlight', 'Blueprint', 'Electric'].forEach((name) => {
      fireEvent.click(within(specialThemes).getByRole('radio', { name }));
      expect(accentGroup).toHaveAttribute('aria-disabled', 'true');
      expect(accent.queryByRole('radio', { checked: true })).not.toBeInTheDocument();
      expect(editProfile.closest('[data-idol-theme]')).toHaveAttribute(
        'data-idol-theme',
        name.toLowerCase()
      );
    });

    fireEvent.click(within(defaultThemes).getByRole('radio', { name: 'Light' }));
    expect(accentGroup).not.toHaveAttribute('aria-disabled', 'true');
    expect(accent.getByRole('radio', { name: 'Pink' })).toBeChecked();
  } finally {
    window.matchMedia = originalMatchMedia;
    localStorage.removeItem(APPEARANCE_STORAGE_KEY);
  }
});
