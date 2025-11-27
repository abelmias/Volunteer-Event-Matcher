import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Skill Service
 * Handles all skill-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = 'http://localhost:8081/api/skills';

  constructor(private http: HttpClient) { }

  /**
   * Get all skills
   */
  getAllSkills(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Get skills by category
   */
  getSkillsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?category=${category}`);
  }

  /**
   * Create new skill (admin only)
   */
  createSkill(skillData: any): Observable<any> {
    return this.http.post(this.apiUrl, skillData);
  }

  /**
   * Get skill by ID
   */
  getSkillById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
