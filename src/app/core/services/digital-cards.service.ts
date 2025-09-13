import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../http/api.service';
import {
  DigitalCard,
  DigitalCardApiResponse,
  DigitalCardListApiResponse,
  CreateDigitalCardRequest,
  UpdateDigitalCardRequest,
  ImageUploadResponse,
  ImageDeleteResponse,
} from '../models/digital-card.model';

@Injectable({
  providedIn: 'root',
})
export class DigitalCardsService {
  private apiService = inject(ApiService);
  private readonly endpoint = 'digital-cards';

  /**
   * Listar tarjetas con paginación y búsqueda
   * Consume: GET /api/digital-cards
   */
  getDigitalCards(params?: {
    page?: number;
    search?: string;
    user_id?: string;
    per_page?: number;
    status?: string;
    visibility?: string;
    sort_by?: string;
    sort_order?: string;
  }): Observable<DigitalCardListApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.user_id) queryParams.set('user_id', params.user_id);
    if (params?.per_page)
      queryParams.set('per_page', params.per_page.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.visibility) queryParams.set('visibility', params.visibility);
    if (params?.sort_by) queryParams.set('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.set('sort_order', params.sort_order);

    const url = queryParams.toString()
      ? `${this.endpoint}?${queryParams}`
      : this.endpoint;

    // Debug: Log URL being called
    console.log('[DEBUG] API URL being called:', url);
    console.log('[DEBUG] Query params:', queryParams.toString());

    return this.apiService.get<DigitalCardListApiResponse>(url);
  }

  /**
   * Obtener una tarjeta por ID
   * Consume: GET /api/digital-cards/{id}
   */
  getDigitalCard(id: number): Observable<DigitalCardApiResponse> {
    return this.apiService.get<DigitalCardApiResponse>(
      `${this.endpoint}/${id}`
    );
  }

  /**
   * Crear nueva tarjeta
   * Consume: POST /api/digital-cards
   */
  createDigitalCard(
    data: CreateDigitalCardRequest
  ): Observable<DigitalCardApiResponse> {
    return this.apiService.post<DigitalCardApiResponse>(this.endpoint, data);
  }

  /**
   * Actualizar tarjeta
   * Consume: POST /api/digital-cards/{id}/update
   */
  updateDigitalCard(
    id: number,
    data: UpdateDigitalCardRequest
  ): Observable<DigitalCardApiResponse> {
    return this.apiService.post<DigitalCardApiResponse>(
      `${this.endpoint}/${id}/update`,
      data
    );
  }

  /**
   * Eliminar tarjeta
   * Consume: DELETE /api/digital-cards/{id}
   */
  deleteDigitalCard(id: number): Observable<{ message: string }> {
    return this.apiService.delete<{ message: string }>(
      `${this.endpoint}/${id}`
    );
  }

  /**
   * Subir imagen
   * Consume: POST /api/digital-cards/{id}/upload-image
   */
  uploadImage(id: number, file: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.apiService.post<ImageUploadResponse>(
      `${this.endpoint}/${id}/upload-image`,
      formData
    );
  }

  /**
   * Eliminar imagen
   * Consume: DELETE /api/digital-cards/{id}/delete-image
   */
  deleteImage(id: number): Observable<ImageDeleteResponse> {
    return this.apiService.delete<ImageDeleteResponse>(
      `${this.endpoint}/${id}/delete-image`
    );
  }

  /**
   * Cambiar estado
   * Consume: POST /api/digital-cards/{id}/toggle-status
   */
  toggleStatus(
    id: number,
    status: { is_active?: boolean; is_public?: boolean }
  ): Observable<DigitalCardApiResponse> {
    return this.apiService.post<DigitalCardApiResponse>(
      `${this.endpoint}/${id}/toggle-status`,
      status
    );
  }
}