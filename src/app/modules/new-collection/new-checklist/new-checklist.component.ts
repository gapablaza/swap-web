import { Component, computed, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as XLSX from 'xlsx';

import { ChecklistItem } from 'src/app/core';
import { LinebreaksPipe } from '../../../shared/pipes/linebreaks.pipe';
import { Store } from '@ngrx/store';
import { authFeature } from '../../auth/store/auth.state';
import { newCollectionFeature } from '../store/new-collection.state';
import { newCollectionActions } from '../store/new-collection.actions';

export interface CheckItem {
  NRO: string;
  TIPO?: number;
  TITULO?: string;
  SECCION?: string;
  __rowNum__?: number;
  typeName?: string;
}

@Component({
  selector: 'app-new-checklist',
  templateUrl: './new-checklist.component.html',
  standalone: true,
  imports: [
    RouterLink,

    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,

    LinebreaksPipe,
  ],
})
export class NewChecklistComponent implements OnInit {
  authUser = this.store.selectSignal(authFeature.selectUser);
  canAddChecklist = this.store.selectSignal(
    newCollectionFeature.selectCanAddChecklist
  );
  newCollection$$ = this.store.selectSignal(
    newCollectionFeature.selectNewCollection
  );
  votes$$ = this.store.selectSignal(
    newCollectionFeature.selectNewCollectionVotesOrdered
  );
  types = this.store.selectSignal(newCollectionFeature.selectItemTypes);
  validTypes = computed(() => {
    return this.types().map((t) => t.id);
  });

  isProcessing = this.store.selectSignal(
    newCollectionFeature.selectIsProcessing
  );
  isLoaded = this.store.selectSignal(
    newCollectionFeature.selectIsNewCollectionLoaded
  );

  errors: string[] = [];
  checklist: ChecklistItem[] = [];
  fileName = '';

  displayedColumns: string[] = [
    'name',
    'itemTypeId',
    'itemTypeDescription',
    'description',
    'section',
  ];
  dataSource = new MatTableDataSource<ChecklistItem>([]);
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(
      newCollectionActions.loadCollection({
        collectionId: Number(this.activatedRoute.snapshot.params['id']),
      })
    );
  }

  onFileChange(ev: any) {
    this.errors = [];
    this.checklist = [];

    let workBook: any = null;
    let headerData: any = null;
    let jsonData: CheckItem[] = [];
    let uniqueNro: string[] = [];

    const reader = new FileReader();
    const file = ev.target.files[0];
    this.fileName = file.name;

    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });

      // Verifica que exista la hoja "ITEMIZADO"
      if (!workBook.SheetNames.includes('ITEMIZADO')) {
        this.errors.push(
          'Recuerda utilizar el formato propuesto sin modificar su estructura, nombre de campos o de hojas.'
        );
        return;
      }

      // Verifica que la cabecera sea la predefinida
      headerData = XLSX.utils.sheet_to_json(workBook.Sheets['ITEMIZADO'], {
        header: 1,
        range: 'A1:D1',
      });
      if (
        headerData.length == 0 ||
        headerData[0][0] !== 'NRO' ||
        headerData[0][1] !== 'TIPO' ||
        headerData[0][2] !== 'TITULO' ||
        headerData[0][3] !== 'SECCION'
      ) {
        this.errors.push(
          'Recuerda utilizar el formato propuesto sin modificar su estructura, nombre de campos o de hojas.'
        );
        return;
      }

      // Obtiene la data
      jsonData = XLSX.utils.sheet_to_json(workBook.Sheets['ITEMIZADO'], {
        range: 'A1:D5001',
      });

      let rowNumber = 1;
      jsonData.forEach((row) => {
        // la nueva fila es correlativa
        if (row.__rowNum__ != rowNumber) return;
        // la nueva fila tiene ingresado un NRO
        if (row.NRO === undefined) return;

        // se valida el campo NRO
        if (!this.checkNRO(row.NRO)) {
          this.errors.push(
            `Celda A${
              rowNumber + 1
            } debe contener como máximo 15 caracteres alfanuméricos, guión o barra vertical (pipe).`
          );
        }
        // se valida que el NRO no está repetido
        if (uniqueNro.includes(String(row.NRO))) {
          this.errors.push(
            `Celda A${rowNumber + 1} está repetido y debe ser único.`
          );
        } else {
          uniqueNro.push(String(row.NRO));
        }

        // se valida el campo TIPO
        if (row.TIPO !== undefined && !this.checkTIPO(row.TIPO)) {
          this.errors.push(
            `Celda B${
              rowNumber + 1
            } debe corresponder al ID de un tipo de ítem válido.`
          );
        }
        // se valida el campo TITULO
        if (row.TITULO !== undefined && !this.checkTITULO(row.TITULO)) {
          this.errors.push(
            `Celda C${
              rowNumber + 1
            } debe contener como máximo 100 caracteres sin saltos de línea.`
          );
        }
        // se valida el campo SECCION
        if (row.SECCION !== undefined && !this.checkSECCION(row.SECCION)) {
          this.errors.push(
            `Celda D${
              rowNumber + 1
            } debe contener como máximo 100 caracteres sin saltos de línea.`
          );
        }

        this.checklist.push({
          description: row.TITULO,
          itemTypeDescription: this.getTIPOName(row.TIPO || ''),
          itemTypeId: Number(row.TIPO),
          name: row.NRO,
          position: row.__rowNum__,
          section: row.SECCION,
        });
        rowNumber++;
      });

      if (this.errors.length == 0) {
        this.dataSource.data = this.checklist;
      }
    };
    reader.readAsBinaryString(file);
  }

  checkNRO(nro: any): boolean {
    if (String(nro).length > 15) return false;
    if (!new RegExp('^[A-ZÑa-zñ0-9|-]*$').test(String(nro))) return false;
    return true;
  }

  checkTIPO(type: any): boolean {
    if (!Number.isInteger(type)) return false;
    if (!this.validTypes().includes(type)) return false;
    return true;
  }

  checkTITULO(titulo: any): boolean {
    if (String(titulo).length > 100) return false;
    if (/\r|\n/.exec(String(titulo))) return false;
    return true;
  }

  checkSECCION(seccion: any): boolean {
    if (String(seccion).length > 100) return false;
    if (/\r|\n/.exec(String(seccion))) return false;
    return true;
  }

  getTIPOName(type: any): string {
    if (!Number.isInteger(type)) return '';
    if (!this.validTypes().includes(type)) return '';
    return this.types().find((i) => i.id == Number(type))?.name || '';
  }

  cleanFileInput(file: HTMLInputElement): void {
    file.value = '';
    this.errors = [];
    this.checklist = [];
    this.fileName = '';
  }

  saveChecklist(): void {
    this.store.dispatch(
      newCollectionActions.addChecklist({ checklistItems: this.checklist })
    );
  }

  downloadTemplate(): void {
    let link = document.createElement('a');
    let excelFile = 'intercambia v20230826';
    link.setAttribute('type', 'hidden');
    link.href = `/assets/files/${excelFile}.xlsx`;
    link.download = `${excelFile}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
