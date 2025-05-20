import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL, httpOptions } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResenyaLikeService {
  private serverURL: string = serverURL + '/likes';

  constructor(private http: HttpClient) {}

  likeResenya(usuarioId: number, resenyaId: number): Observable<{ liked: boolean }> {
    const url = `${this.serverURL}/like?usuarioId=${usuarioId}&resenyaId=${resenyaId}`;
    return this.http.post<{ liked: boolean }>(url, null, httpOptions);
  }

  unlikeResenya(usuarioId: number, resenyaId: number): Observable<{ unliked: boolean }> {
    const url = `${this.serverURL}/unlike?usuarioId=${usuarioId}&resenyaId=${resenyaId}`;
    return this.http.delete<{ unliked: boolean }>(url, httpOptions);
  }

  countLikes(resenyaId: number): Observable<{ likes: number }> {
    const url = `${this.serverURL}/count?resenyaId=${resenyaId}`;
    return this.http.get<{ likes: number }>(url, httpOptions);
  }

  hasUserLiked(usuarioId: number, resenyaId: number): Observable<{ liked: boolean }> {
    const url = `${this.serverURL}/check?usuarioId=${usuarioId}&resenyaId=${resenyaId}`;
    return this.http.get<{ liked: boolean }>(url, httpOptions);
  }
}
