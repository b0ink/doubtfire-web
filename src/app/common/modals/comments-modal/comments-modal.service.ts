import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CommentsModalComponent} from './comments-modal.component';

@Injectable({
  providedIn: 'root',
})
export class CommentsModalService {
  constructor(public dialog: MatDialog) {}

  public show(commentResourceUrl: string, commentType: string) {
    this.dialog.open(CommentsModalComponent, {
      data: {commentResourceUrl, commentType},
      width: '100%',
      maxWidth: '800px',
    });
  }
}
