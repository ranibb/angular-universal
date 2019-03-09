import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { Lesson } from '../model/lesson';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {


  course: Course;

  dataSource: MatTableDataSource<Lesson>;

  displayedColumns = ['seqNo', 'description', 'duration'];


  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService) {

  }



  ngOnInit() {

    this.course = this.route.snapshot.data.course;

    this.dataSource = new MatTableDataSource([]);

    this.coursesService.findAllCourseLessons(this.course.id)
      .subscribe(lessons => this.dataSource.data = lessons);

  }


}
