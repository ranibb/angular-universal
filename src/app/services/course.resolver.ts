import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

import { Course } from '../model/course';
import { CoursesService } from './courses.service';

@Injectable()
export class CourseResolver implements Resolve<Course> {

  constructor(
    private coursesService: CoursesService,
    @Inject(PLATFORM_ID) private platformId,
    private transferState: TransferState
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {

    const courseId = route.params.id;

    const COURSE_KEY = makeStateKey<Course>('course-' + courseId);

    if (this.transferState.hasKey(COURSE_KEY)) {
      const course = this.transferState.get<Course>(COURSE_KEY, null);
      this.transferState.remove(COURSE_KEY); // Optionally clear the transfer state service
      return of(course); // create an observable that is going to emit one value and then complete
    } else {
      return this.coursesService.findCourseById(courseId)
        .pipe(
          first(),
          tap(course => {
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(COURSE_KEY, course);
            }
          })
        );
    }

  }

}
