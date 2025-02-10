// src/app/core/auth/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          this.router.navigate(['/admin/login']);
          return of(false);
        }

        return this.firestore.doc(`admins/${user.uid}`).get().pipe(
          map(snapshot => {
            const isAdmin = snapshot.exists;
            if (!isAdmin) this.router.navigate(['/acesso-negado']);
            return isAdmin;
          })
        );
      })
    );
  }
}
