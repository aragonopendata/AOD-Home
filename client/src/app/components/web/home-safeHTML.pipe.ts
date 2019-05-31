import {DomSanitizer} from '@angular/platform-browser';
import {PipeTransform, Pipe} from "@angular/core";

@Pipe({ name: 'safeHtml'})
export class HomeSafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(url) {
    return this.sanitized.bypassSecurityTrustResourceUrl(url);
  }
}