import { Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FileDownloaderService } from '../file-downloader/file-downloader';
import { alertService } from 'src/app/ajs-upgraded-providers';
import { HttpResponse } from '@angular/common/http';

/**
 * The file viewer downloads a file from a URL and displays it's contents.
 */
@Component({
  selector: 'f-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss'],
})
export class FileViewerComponent implements OnDestroy, OnChanges {
  /**
   * The source of the resource to download from the server.
   */
  @Input() src: string;

  /**
   * The kind of file being displayed.
   */
  @Input() fileType: string;

  /**
   * A copy of the source URL, so we can release the blob when the URL changes.
   */
  private _src: string;

  /**
   * The url of the blob downloaded - so we can render it.
   */
  private blobUrl: string;

  /**
   * Used to indicate the PDF has been loaded.
   */
  public loaded = false;

  /**
   * Create the file viewer
   *
   * @param fileDownloader is used to download the resources from the api
   * @param alerts is used to render alerts
   */
  constructor(private fileDownloader: FileDownloaderService, @Inject(alertService) private alerts: any) {}

  /**
   * When destroyed, the component must free its resources.
   */
  ngOnDestroy(): void {
    if (this.blobUrl) {
      this.fileDownloader.releaseBlob(this.blobUrl);
      this.blobUrl = null;
    }
  }

  /**
   * When the src or fileType changes, the component must update the blob url.
   * @param changes the changes that have occurred to the component
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.srcChanges(changes.src.currentValue);
  }

  /**
   * Process changes to the src url.
   *
   * @param value the new src value`
   */
  private srcChanges(value: string): void {
    if (this._src !== value) {
      // Free the memory used by the old resource blob
      if (this.blobUrl) {
        this.fileDownloader.releaseBlob(this.blobUrl);
        this.blobUrl = null;
      }

      // Get the new blob
      this._src = value;
      this.loaded = false;
      this.downloadBlob(value);
    }
  }

  /**
   * Download the resource, and store in blob to render in component.
   *
   * @param downloadUrl the url to download the blob from
   */
  private downloadBlob(downloadUrl: string): void {
    this.fileDownloader.downloadBlob(
      downloadUrl,
      (url: string, response: HttpResponse<Blob>) => {
        this.blobUrl = url;
      },
      (error: any) => {
        this.alerts.add('danger', `Error downloading resource. ${error}`, 6000);
      }
    );
  }

  /**
   * Triggered on pdf load - trigger resize and set loaded to true to render the pdf.
   */
  onLoaded() {
    this.loaded = true;
    window.dispatchEvent(new Event('resize'));
  }

}
