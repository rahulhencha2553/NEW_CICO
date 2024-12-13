import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexStroke,
  ApexLegend,
  ChartComponent,
} from 'ng-apexcharts';
import { AssignmentChart } from 'src/app/charts/assignment-chart';
import { NormalExamBar, ScheduleExamBar } from 'src/app/charts/normal-exam-bar';
import { ExamServiceService } from 'src/app/service/exam-service.service';
import { StudentService } from 'src/app/service/student.service';
import jsPDF from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { Profile } from 'src/app/entity/profile';
import { profile } from 'console';
import { LoginService } from 'src/app/service/login.service';


// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs

export type AssignmentOption = {
  series: any;
  chart: any;
  dataLabels: any;
  plotOptions: any;
  yaxis: any;
  xaxis: any;
  fill: any;
  tooltip: any;
  stroke: any;
  legend: any;
};

export type NormalExamResult = {
  series: any;
  chart: any;
  responsive: any;
  labels: any;
  colors: any;
  legend: any;
  stroke: any;
};
export type ScheduleTestResult = {
  series: any;
  chart: any;
  responsive: any;
  labels: any;
  colors: any;
  legend: any;
  stroke: any;
};

@Component({
  selector: 'app-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.scss'],
})
export class StaticsComponent {
  @ViewChild('pdfTable') pdfTable!: ElementRef;

  @ViewChild('assignmentChart') assignmentChart!: ChartComponent;
  public assignmentOption: any;

  @ViewChild('normalTestChart') normalTestChart!: ChartComponent | undefined;
  public normalExamOption: Partial<NormalExamResult>;

  @ViewChild('scheduleTestChart') scheduleTestChart!:
    | ChartComponent
    | undefined;
  public scheduleExamOption: Partial<ScheduleTestResult>;

  student: Profile = new Profile();
  assignmentBar: AssignmentChart = new AssignmentChart();
  normalExamBar: NormalExamBar = new NormalExamBar();
  scheduleExamBar: ScheduleExamBar = new ScheduleExamBar();

  constructor(
    private examService: ExamServiceService,
    private studentService: StudentService
  ) {
    this.assignmentOption = this.assignmentBar.assignmentOption;
    this.normalExamOption = this.normalExamBar.normalTestResult;
    this.scheduleExamOption = this.scheduleExamBar.scheduleTestResult;
  }

  ngOnInit() {
    this.getExamResult();
    this.getTaskStatics()
  }

  public getExamResult() {
    this.studentService.student.subscribe((value) => {
      this.student.studentId = value.id;
      this.student.name = value.studentName;
      this.student.course = value.course;
      this.student.profilePic = value.profilePic;
      this.examService.fetchExamCounting(value.id).subscribe((result: any) => {
        this.normalExamOption.series = [
          result.totalNormalCount,
          result.normalExamCount,
        ];
        this.scheduleExamOption.series = [
          result.totalScheduleExamCount,
          result.scheduleExamCount,
        ];
      });
    });
  }

  public downloadAsPDF() {
    const keyValuePairs: any = {
      Student_Id: this.student.studentId,
      Name: this.student.name,
      Course: this.student.course,
    };
    // Calculate the current date and time
    const today = new Date();
    const formattedDate = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = today.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    // Create an array to hold content elements
    const contentArray: Content[] = [];

    document.getElementById('pdf')!.hidden = true;
    const pdfContent = this.pdfTable.nativeElement;
    const originalHeight = pdfContent.style.height;
    const originalOverflow = pdfContent.style.overflow;

    // Expand the element to its full height
    pdfContent.style.height = `${pdfContent.scrollHeight}px`;
    pdfContent.style.overflow = 'visible';

    // Capture HTML content as image using html2canvas
    html2canvas(pdfContent, { scale: 2 }).then((canvas: any) => {
      const imgData = canvas.toDataURL('image/png');

      // Restore the original style
      pdfContent.style.height = originalHeight;
      pdfContent.style.overflow = originalOverflow;

      // Define document definition with the captured image
      for (const key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
          contentArray.push({
            text: `${key}: ${keyValuePairs[key]}`,
            fontSize: 14,
            margin: [5, 10, 0, 2],
            alignment: 'left',
            color: 'black',
          });
        }
      }

      // Add a horizontal line
      const horizontalLine: any = {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 520,
            y2: 0,
            lineWidth: 2,
            color: '#000',
          },
        ],
        margin: [0, 10],
      };

      const documentDefinition: TDocumentDefinitions = {
        header: {
          columns: [
            { text: '' },
            { text: `${formattedDate} ${formattedTime}`, alignment: 'right', margin: [0, 10, 10, 0] }
          ]
        },
        content: [
          contentArray,
          horizontalLine,
          { image: imgData, width: 500, marginTop: 50 }, // Image
        ],
      };

      // Create and download the PDF with the specified file name
      const pdfFileName = `Result & Statistics.pdf`;
      pdfMake.createPdf(documentDefinition).open();
      document.getElementById('pdf')!.hidden = false;
    });
  }


  getTaskStatics() {
    this.studentService.getTaskStatics().subscribe({
      next: (data: any) => {

        this.assignmentOption.series = [
          {
            name: "Total Assignment",
            data: data.totalSubmitted,
            color: '#4d4dff'
          },
          {
            name: "Accepted",
            data: data.totalAccepted,
            color: '#66cc66'
          },
          {
            name: "Rejected",
            data: data.totalRejected,
            color: '#ff4d4d'
          }
        ],
          this.assignmentOption.xaxis = {
            categories: data.categories

          }
      },
      error: (er: any) => {

      }
    })
  }
}
