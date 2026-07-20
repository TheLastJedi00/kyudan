import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

/**
 * Encapsula a inicialização do Firebase/Firestore.
 * Nenhum outro lugar do app importa `firebase/*` a não ser os `Firebase*Service`.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  private _app: FirebaseApp | null = null;
  private _db: Firestore | null = null;

  private get app(): FirebaseApp {
    if (!this._app) {
      this._app = getApps().length ? getApp() : initializeApp(environment.firebase);
    }
    return this._app;
  }

  /** Instância do Firestore (inicialização preguiçosa). */
  get db(): Firestore {
    if (!this._db) {
      this._db = getFirestore(this.app);
    }
    return this._db;
  }
}
