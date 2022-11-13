import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class SEOService {
  constructor(
    @Inject(DOCUMENT) private doc: any,
    private titleSrv: Title,
    private metaSrv: Meta,
    private router: Router
  ) {}

  setTitle(title: string) {
    this.titleSrv.setTitle(title);
    this.metaSrv.updateTag({ property: 'og:title', content: title });
  }

  setDescription(content: string) {
    this.metaSrv.updateTag({ name: 'description', content });
    this.metaSrv.updateTag({ property: 'og:description', content });
  }

  setURL(url?: string) {
    let newUrl = url
      ? url
      : `${environment.appUrl}${this.router.url.split('?')[0]}`;

    this.metaSrv.updateTag({ property: 'og:url', content: newUrl });
  }

  setCanonicalLink(url?: string) {
    this.destroyCanonicalLink();

    let link: HTMLLinkElement = this.doc.createElement('link');

    link.setAttribute('rel', 'canonical');
    link.setAttribute(
      'href',
      url ? url : `${environment.appUrl}${this.router.url.split('?')[0]}`
    );
    this.doc.head.appendChild(link);
  }

  destroyCanonicalLink() {
    const els = this.doc.querySelectorAll("link[rel='canonical']");
    for (let i = 0, l = els.length; i < l; i++) {
      const el = els[i];
      el.remove();
    }
  }

  set(options: {
    title?: string;
    description?: string;
    url?: string;
    isCanonical?: boolean;
  }) {
    // seteamos el título
    if (options.title) {
      this.setTitle(options.title);
    }

    // seteamos la descripción
    if (options.description) {
      this.setDescription(options.description);
    }

    // seteamos la URL canónica
    if (options.url !== undefined) {
      this.setURL(options.url);
    } else {
      this.setURL();
    }

    // creamos la definición para la url canónica
    if (options.isCanonical) {
      this.setCanonicalLink(
        options.url !== undefined ? options.url : undefined
      );
    }
  }

  cleanSEO() {
    let title =
      'Sistema para intercambiar láminas (stickers, figuritas, pegatinas, cromos)';
    let description =
      'Completa tu álbum! Encuentra fácilmente con quien cambiar las láminas / stickers / figuritas / pegatinas / cromos / estampas que te faltan!';
    let url = environment.appUrl;

    this.titleSrv.setTitle(title);
    this.metaSrv.updateTag({ property: 'og:title', content: title });

    this.metaSrv.updateTag({ name: 'description', content: description });
    this.metaSrv.updateTag({
      property: 'og:description',
      content: description,
    });

    this.metaSrv.updateTag({ property: 'og:url', content: url });

    this.destroyCanonicalLink();
  }
}
