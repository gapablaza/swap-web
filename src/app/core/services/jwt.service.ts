import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
  getToken(): String {
    return typeof navigator !== 'undefined'
      ? window.localStorage['jwtToken']
      : '';
  }

  saveToken(token: String) {
    if (typeof navigator !== 'undefined') {
      window.localStorage['jwtToken'] = token;
    }
  }

  destroyToken() {
    if (typeof navigator !== 'undefined') {
      window.localStorage.removeItem('jwtToken');
    }
  }
}
