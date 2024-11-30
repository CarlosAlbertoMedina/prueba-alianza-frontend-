import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../client.service';  // Asegúrate de que el servicio está implementado

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  searchForm: FormGroup;
  advancedSearchForm: FormGroup;
  clientForm: FormGroup;
  isAdvancedSearchVisible = false;
  isClientFormVisible = false;
  isSharedKeyDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.advancedSearchForm = this.fb.group({
      sharedKey: [''],
      businessId: [''],
      email: [''],
      phone: ['']
    });

    this.clientForm = this.fb.group({
      businessId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getClients();
  }

  getClients(searchQuery: string = '', advancedParams: any = {}): void {

    let url = `/api/clients?page=0&size=10`;

    if (searchQuery) {
      url += `&searchQuery=${searchQuery}`;
    }

    if (advancedParams.sharedKey || advancedParams.businessId || advancedParams.email || advancedParams.phone) {
      url += `&sharedKey=${advancedParams.sharedKey || ''}`;
      url += `&businessId=${advancedParams.businessId || ''}`;
      url += `&email=${advancedParams.email || ''}`;
      url += `&phone=${advancedParams.phone || ''}`;
    }

    this.clientService.getClients(url).subscribe((data: any) => {
      this.clients = data.content;
    });
  }

  toggleAdvancedSearch(): void {
    this.isAdvancedSearchVisible = !this.isAdvancedSearchVisible;
  }

  onAdvancedSearchSubmit(): void {
    if (this.advancedSearchForm.valid) {
      const searchParams = this.advancedSearchForm.value;
      this.getClients('', searchParams);
    }
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const searchQuery = this.searchForm.value.searchQuery;
      this.getClients(searchQuery);
    }
  }

  onNewClick(): void {
    this.isClientFormVisible = !this.isClientFormVisible;
  }

  onCreateClient(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      this.clientService.createClient(clientData).subscribe(response => {
        this.getClients();
        this.isClientFormVisible = false;
      });
    }
  }

  onExportCsvClick(): void {
    this.clientService.exportCsv().subscribe(response => {
      const blob = response;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clients.csv';
      a.click();
    });
  }
}
