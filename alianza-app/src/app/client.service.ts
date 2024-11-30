import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Client {
  businessId: string;
  email: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
}

interface ClientResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Client[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  baseUrl = '/api/clients';

  constructor(private http: HttpClient) {}

  getClients(url: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(url);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client);
  }

  exportCsv(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/report.csv`, { responseType: 'blob' });
  }
}
