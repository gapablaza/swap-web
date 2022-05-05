import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UIService } from '../../ui.service';

@Component({
  selector: 'app-share-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.scss']
})
export class ShareUrlComponent implements OnInit {
  url = '';
  title = '';
  twitterUrl = '';
  facebookUrl = '';
  whatsappUrl = '';
  emailUrl = '';

  constructor(
    private router: Router,
    private titleSrv: Title,
    private clipboard: Clipboard,
    private bottomSheetRef: MatBottomSheetRef<ShareUrlComponent>,
    private ui: UIService,
  ) { }

  ngOnInit(): void {
    this.url = encodeURI(window.location.href);
    this.title = encodeURI(this.titleSrv.getTitle());
    this.twitterUrl = `https://twitter.com/intent/tweet?text=${this.title}&url=${this.url}&via=cambialaminas`;
    this.facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${this.url}&quote=${this.title}`;
    this.whatsappUrl = `https://wa.me/?text=${this.title}%20-%20${this.url}`;
    this.emailUrl = `mailto:?subject=${this.title}&body=${this.title}%3A%20${this.url}`;
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    // event.preventDefault();
  }

  copyLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    this.clipboard.copy(this.url);
    this.ui.showSnackbar('Enlace copiado al portapapeles');
    // event.preventDefault();
  }

}
