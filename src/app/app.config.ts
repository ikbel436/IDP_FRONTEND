import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { provideFuse } from '@fuse';
import { provideTransloco, TranslocoService } from '@ngneat/transloco';
import { firstValueFrom } from 'rxjs';
import { appRoutes } from 'app/app.routes';
import { provideAuth } from 'app/core/auth/auth.provider';
import { provideIcons } from 'app/core/icons/icons.provider';
import { mockApiServices } from 'app/mock-api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslocoHttpLoader } from './core/transloco/transloco.http-loader';
import {
    RECAPTCHA_V3_SITE_KEY,
    RECAPTCHA_SETTINGS,
    RecaptchaSettings,
    RECAPTCHA_LOADER_OPTIONS,
    RecaptchaLoaderOptions,
} from 'ng-recaptcha';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

const RECAPTCHA_V3_STACKBLITZ_KEY = '6Lc4yOQpAAAAAEz55qmvhdLt2XdR6MA98qr2LDCG';
const RECAPTCHA_V2_DUMMY_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes),provideAnimationsAsync(),
        provideHotToastConfig(),
        provideAnimations(),
        provideHttpClient(),
        provideRouter(appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
        ),

        // Material Date Adapter
        {
            provide: DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'D',
                },
                display: {
                    dateInput: 'DDD',
                    monthYearLabel: 'LLL yyyy',
                    dateA11yLabel: 'DD',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },

        // Transloco Config
        provideTransloco({
            config: {
                availableLangs: [
                    {
                        id: 'en',
                        label: 'English',
                    },

                ],
                defaultLang: 'en',
                fallbackLang: 'en',
                reRenderOnLangChange: true,
                prodMode: true,
            },
            loader: TranslocoHttpLoader,
        }),
        {
            // Preload the default language before the app starts to prevent empty/jumping content
            provide: APP_INITIALIZER,
            useFactory: () => {
                const translocoService = inject(TranslocoService);
                const defaultLang = translocoService.getDefaultLang();
                translocoService.setActiveLang(defaultLang);

                return () => firstValueFrom(translocoService.load(defaultLang));
            },
            multi: true,
        },

        // Fuse
        provideAuth(),
        provideIcons(),
        provideFuse({
            mockApi: {
                delay: 0,
                services: mockApiServices,
            },
            fuse: {
                layout: 'centered',
                scheme: 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme: 'theme-default',
                themes: [
                    {
                        id: 'theme-purple',
                        name: 'Purple',
                    },

                ],
            },
        }),
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: RECAPTCHA_V3_STACKBLITZ_KEY,
        },
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
                siteKey: RECAPTCHA_V2_DUMMY_KEY,
            } as RecaptchaSettings,
        },
        {
            provide: RECAPTCHA_LOADER_OPTIONS,
            useValue: {
                onBeforeLoad(url) {
                    const langOverride = localStorage.getItem('activeLang') === 'fr' ? 'fr' : null;
                    if (langOverride) url.searchParams.set('hl', langOverride);
                    return { url };
                },
            } as RecaptchaLoaderOptions,
        },
    ],
};
