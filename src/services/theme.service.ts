import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    darkMode = signal<boolean>(false);
    compactMode = signal<boolean>(false);

    constructor() {
        // Load from local storage
        const savedDark = localStorage.getItem('darkMode') === 'true';
        const savedCompact = localStorage.getItem('compactMode') === 'true';

        this.darkMode.set(savedDark);
        this.compactMode.set(savedCompact);

        // Effect to apply classes
        effect(() => {
            document.documentElement.classList.toggle('dark', this.darkMode());
            document.body.classList.toggle('compact-mode', this.compactMode());

            localStorage.setItem('darkMode', String(this.darkMode()));
            localStorage.setItem('compactMode', String(this.compactMode()));
        });
    }

    toggleDarkMode() {
        this.darkMode.update(v => !v);
    }

    toggleCompactMode() {
        this.compactMode.update(v => !v);
    }
}
