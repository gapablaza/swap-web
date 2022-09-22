import { NgModule } from '@angular/core';

import { AdsenseModule } from 'ng2-adsense';

@NgModule({
  declarations: [],
  imports: [
    AdsenseModule.forRoot({
        adClient: 'ca-pub-6782496264167512',
      }),
  ],
  exports: [
    AdsenseModule
  ],
})
export class AdsModule {}
