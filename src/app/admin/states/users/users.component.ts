import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {User} from 'src/app/api/models/doubtfire-model';
import {UserService} from 'src/app/api/models/doubtfire-model';
import {FileDownloaderService} from 'src/app/common/file-downloader/file-downloader.service';
import {EditProfileDialogService} from 'src/app/common/modals/edit-profile-dialog/edit-profile-dialog.service';
import {AlertService} from 'src/app/common/services/alert.service';
import {DoubtfireConstants} from 'src/app/config/constants/doubtfire-constants';

@Component({
  selector: 'f-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FUsersComponent implements OnInit, AfterViewInit, OnDestroy {
  public users: User[] = [];
  public filter = '';
  dataload: boolean;

  private subscriptions: Subscription[] = [];
  externalName: string;
  uploadEndpoint: string;

  constructor(
    private userService: UserService,
    private editProfileDialogService: EditProfileDialogService,
    private constants: DoubtfireConstants,
    private fileDownloaderService: FileDownloaderService,
    private alerts: AlertService,
  ) {
    this.dataload = false;
  }

  ngOnInit(): void {
    this.userService.query().subscribe();
    this.constants.ExternalName.subscribe((externalName) => {
      this.externalName = externalName;
    });

    this.uploadEndpoint = this.userService.csvURL;
  }

  ngAfterViewInit(): void {
    this.users = this.userService.cache.currentValuesClone();

    this.subscriptions.push(
      this.userService.cache.values.subscribe((users) => {
        this.users = [...users];
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  protected downloadUsers() {
    this.fileDownloaderService.downloadFile(this.userService.csvURL, 'Users.csv');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // TODO: This needs to be brought out into a service which replaces the old csv-result-modal
  protected onUserUploadSuccess(event) {
    const max_full_errors = 5;
    const num_errors = event.body.errors?.length;
    const num_success = event.body.success?.length;
    const num_ignored = event.body.ignored?.length;

    // build error string
    let error_string = `${num_success} users successfully updated, `;
    error_string += `${num_ignored} users ignored, `;
    error_string += `${num_errors} users contained an error in the CSV...`;

    event.body.errors?.slice(0, max_full_errors).forEach((error) => {
      error_string += error.message + '\n';
    });

    if (num_errors > max_full_errors) {
      error_string += `... and ${num_errors - max_full_errors} more`;
    }
    this.alerts.error(error_string);

    this.userService.query();
  }

  public showUserModal(user?: User) {
    const userToShow = user ? user : this.userService.createInstanceFrom({});
    this.editProfileDialogService.openDialog(userToShow, 'edit');
  }

  public get filteredUsers(): User[] {
    const filter = this.filter.trim().toLowerCase();
    return filter ? this.users.filter((user) => user.matches(filter)) : this.users;
  }

  readonly compareFirstName = (a: User, b: User) => a.firstName.localeCompare(b.firstName);
  readonly compareLastName = (a: User, b: User) => a.lastName.localeCompare(b.lastName);
  readonly compareUsername = (a: User, b: User) => a.username.localeCompare(b.username);
  readonly compareEmail = (a: User, b: User) => a.email.localeCompare(b.email);
  readonly compareSystemRole = (a: User, b: User) => a.systemRole.localeCompare(b.systemRole);
}
