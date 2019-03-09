import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Course } from '../model/course';
import { CoursesService } from './courses.service';

@Injectable()
export class CourseResolver implements Resolve<Course> {

  constructor(private coursesService: CoursesService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {

    const courseId = route.params.id;

    return this.coursesService.findCourseById(courseId)
      .pipe(
        first()
      );

  }

}
