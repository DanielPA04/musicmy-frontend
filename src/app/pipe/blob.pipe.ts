import { Pipe, PipeTransform  } from '@angular/core';

@Pipe({
    name: 'blobToUrl'
  })
  export class BlobToUrlPipe implements PipeTransform {
    transform(blob: Blob | undefined): string | null {
  
      if (!blob) return null;
      return URL.createObjectURL(blob);
    }
  }