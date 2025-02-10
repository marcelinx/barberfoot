// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of, firstValueFrom } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    // Observável do usuário autenticado combinado com dados do Firestore
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => user ? this.firestore.doc(`admins/${user.uid}`).valueChanges() : of(null))
    );
  }

  // Login de administrador
  async loginAdmin(email: string, password: string): Promise<void> {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (!credential.user) {
        throw new Error('Erro ao autenticar usuário.');
      }

      const userDoc = await firstValueFrom(this.firestore.doc(`admins/${credential.user.uid}`).get());

      if (!userDoc.exists) {
        await this.logout();
        throw new Error('Acesso permitido apenas para administradores.');
      }

      this.router.navigate(['/admin/dashboard']);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/admin/login']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  // Verifica se o usuário é admin
  isAdmin(uid: string): Observable<boolean> {
    return this.firestore.doc(`admins/${uid}`).get().pipe(
      map(snapshot => snapshot.exists)
    );
  }

  // Retorna o usuário atual (agora como um método assíncrono)
  async currentUser(): Promise<any> {
    return this.afAuth.currentUser;
  }
}
