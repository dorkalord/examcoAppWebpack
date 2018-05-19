import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AppConfig } from './app.config';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, CourseService, ExamService, QuestionService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { ExportService } from './_services/export.service';
import { TopicService } from './_services/topic.service';
import { GradeService } from './_services/grade.service';
import { GeneralCritereaService } from './_services/criterea.service';
import { StateService } from './_services/state.service';
import { ExamDataTransferService } from './_services/exam-datatransfer.service';
import { CensorService } from './_services/censor.service';
import { ExamAttemptDataTransferService } from './_services/examAttempt-datatransfer.service';
import { ExamAttemptService } from './_services/examAttempt.service';
import { MistakeService } from './_services/mistake.service';
import { GeneralCritereaImpactService } from './_services/generalCritereaImpact.service';
import { AnwserService } from './_services/anwser.service';
import { CourseComponent, CourseCreateComponent, CourseEditComponent, TopicComponent } from './course';
import { ExamComponent } from './exam/exam.component';
import { ExamCreateComponent } from './exam/create/exam-create.component';
import { GeneralCritereaComponent } from './exam/create/generealCriterea.component';
import { CritereaFormComponent } from './criterea/criterea-form.component';
import { AdviceCritereaComponent } from './exam/create/adviceCriterea.component';
import { ExamQuestionsComponent } from './exam/create/questions/exam-questions.component';
import { QestionArgumentComponent } from './exam/create/questions/question-argument.component';
import { ExamEvaluatorComponent } from './exam/create/evaluators/exam-evaluator.component';
import { CritereaComponent } from './criterea/criterea.component';
import { HeaderComponent } from './header/header.component';
import { ExamAttemptListComponent } from './ExamAttempt/examAttempt-list';
import { ExamAttemptArgumentComponent } from './ExamAttempt/edit/examAttempt-argument.component';
import { ExamAttemptEditComponent } from './ExamAttempt/edit/examAttempt-edit.component';
import { UserListComponent } from './user/user-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ArgumentService } from './_services/argument.service';
import { ChartsModule } from 'ng2-charts';
import { ExamGradeComponent } from './exam/grade/examGrade.component';
import { ExamGradeDataTransferService } from './_services/examGrade-datatransfer.service';
import { ExamReportComponent } from './exam/report/examReport.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ChartsModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        CourseComponent,
        CourseCreateComponent,
        CourseEditComponent,
        ExamComponent,
        ExamCreateComponent,
        GeneralCritereaComponent,
        CritereaFormComponent,
        AdviceCritereaComponent,
        ExamQuestionsComponent,
        QestionArgumentComponent,
        ExamEvaluatorComponent,
        TopicComponent,
        CritereaComponent,
        HeaderComponent,
        ExamAttemptListComponent,
        ExamAttemptEditComponent,
        ExamAttemptArgumentComponent,
        UserListComponent,
        ExamGradeComponent,
        ExamReportComponent
    ],
    providers: [
        AppConfig,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        CourseService,
        TopicService,
        ExamService,
        QuestionService,
        GradeService,
        GeneralCritereaService,
        StateService,
        ExamDataTransferService,
        CensorService,
        ExamAttemptDataTransferService,
        ExamAttemptService,
        MistakeService,
        GeneralCritereaImpactService,
        AnwserService,
        ExportService,
        ArgumentService,
        ExamGradeDataTransferService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }