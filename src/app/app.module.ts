import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';

// Importação do environment corrigida

// Componentes
import { AgendamentoComponent } from './features/agendamento/agendamento.component';

// Módulos
import { SharedModule } from './shared/shared.module';

// Serviços e Guards
import { AuthService } from './core/auth/guards/auth.service';
import { FirebaseService } from './core/auth/services/firebase.service';
import { AdminGuard } from './core/auth/guards/admin.guard';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AgendamentoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    FirebaseService,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
