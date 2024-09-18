import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { User } from '../models';
import { authFeature } from 'src/app/modules/auth/store/auth.state';

/**
 * Persists user details to localStorage
 */
@Injectable()
export class UserPersistenceService implements OnDestroy {
  private static userKey = 'swap-user-profile';
  private static encryptionKey = 'texto-clave-raro'; // Usar una clave secreta derivada
  private stateSub: Subscription;
  private inBrowser;

  /**
   * Creates a new instance that observes the given auth state service
   * @param store auth state whose user observable is watched
   * @param platformId Platform ID to determine whether running in browser or on server
   */
  constructor(private store: Store, @Inject(PLATFORM_ID) platformId: object) {
    this.stateSub = this.store
      .select(authFeature.selectUser)
      .subscribe((user) => {
        if (user.id) {
          this.saveUser(user);
        } else {
          this.forgetUser();
        }
      });
    this.inBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Encripta los datos antes de guardarlos en el localStorage
   * @param text Texto que se encriptará
   */
  private async encrypt(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text);

    const key = await this.generateKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Vector de inicialización (IV) de 12 bytes para AES-GCM

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encodedText
    );

    const buffer = new Uint8Array(encrypted);
    const ivHex = Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const cipherHex = Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return `${ivHex}:${cipherHex}`;
  }

  /**
   * Desencripta los datos guardados en el localStorage
   * @param encryptedText Texto cifrado
   */
  private async decrypt(encryptedText: string): Promise<string> {
    const [ivHex, cipherHex] = encryptedText.split(':');
    const iv = new Uint8Array(
      ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    const buffer = new Uint8Array(
      cipherHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    const key = await this.generateKey();

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      buffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  /**
   * Genera una clave simétrica a partir de una clave secreta estática
   */
  private async generateKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const encodedKey = encoder.encode(UserPersistenceService.encryptionKey); // Convierte la clave secreta a un ArrayBuffer

    return await window.crypto.subtle.importKey(
      'raw',
      encodedKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Saves user details to localStorage encriptados
   * @param user User to save
   */
  async saveUser(user: User | undefined): Promise<void> {
    if (user && this.inBrowser) {
      const userString = JSON.stringify(user);
      const encryptedUser = await this.encrypt(userString);
      localStorage?.setItem(UserPersistenceService.userKey, encryptedUser);
    }
  }

  /**
   * Deletes user from localStorage
   */
  forgetUser(): void {
    if (this.inBrowser) {
      localStorage?.removeItem(UserPersistenceService.userKey);
    }
  }

  /**
   * Loads user details from localStorage desencriptados
   * @returns User instance, or undefined if none is found
   */
  async loadUser(): Promise<User | undefined> {
    if (this.inBrowser) {
      const encryptedUser = localStorage?.getItem(
        UserPersistenceService.userKey
      );
      if (encryptedUser) {
        try {
          const decryptedUser = await this.decrypt(encryptedUser);
          return JSON.parse(decryptedUser);
        } catch (error) {
          console.error('Error decrypting user data:', error);
          return undefined;
        }
      }
    }
    return undefined;
  }

  ngOnDestroy(): void {
    this.stateSub?.unsubscribe();
  }
}
