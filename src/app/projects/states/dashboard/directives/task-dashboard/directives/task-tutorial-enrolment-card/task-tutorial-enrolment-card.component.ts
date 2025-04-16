import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Task, User, UserService} from 'src/app/api/models/doubtfire-model';
import {TutorialEnrolmentModalService} from 'src/app/common/modals/tutorial-enrolment-modal/tutorial-enrolment-modal.service';

@Component({
  selector: 'f-task-tutorial-enrolment-card',
  templateUrl: './task-tutorial-enrolment-card.component.html',
  styleUrls: ['./task-tutorial-enrolment-card.component.scss'],
})
export class TaskTutorialEnrolmentCardComponent implements OnChanges, OnInit {
  @Input() task: Task;
  user: User;
  isSubmitted: boolean; // task submitted and student enrolled in tutorial
  tutorialEnrolmentEnabled: boolean;

  constructor(
    private userService: UserService,
    private tutorialEnrolmentModalService: TutorialEnrolmentModalService,
  ) {
    this.user = this.userService.currentUser;
  }

  ngOnInit(): void {
    this.tutorialEnrolmentEnabled = true; // debug
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.task &&
      changes.task.currentValue &&
      changes.task.currentValue.definition.tutorialSelfEnrolmentEnabled
    ) {
      console.log('self enrolment feature is enabled for this task'); // debug
    }
  }

  private readonly tutorialStreamAbbreviation = 'wrkshop-2'; // debug: this should be passed from the taskDefinition model
  isStudentEnrolledInTutorialStream(): boolean {
    let isEnrolledInTutorialStream = false;

    const studentTutorialEnrolments = this.task.project.tutorials;
    for (const tutorial of studentTutorialEnrolments) {
      if (tutorial.tutorialStream.abbreviation === this.tutorialStreamAbbreviation) {
        isEnrolledInTutorialStream = true;
      }
    }
    return isEnrolledInTutorialStream;
  }

  isNotStudent(): boolean {
    return this.user !== this.task.project.student;
  }

  launchTutorialEnrolment(): void {
    this.tutorialEnrolmentModalService.show({task: this.task});
  }
}
