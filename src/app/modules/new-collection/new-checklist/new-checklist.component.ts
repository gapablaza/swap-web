import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, take } from 'rxjs';

import * as XLSX from 'xlsx';
import {
  AuthService,
  NewCollection,
  NewCollectionService,
  Publisher,
  User,
} from 'src/app/core';
import { UIService } from 'src/app/shared';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface CheckItem {
  NRO: string;
  TIPO?: number;
  TITULO?: string;
  SECCION?: string;
  __rowNum__?: number;
}

@Component({
  selector: 'app-new-checklist',
  templateUrl: './new-checklist.component.html',
  styleUrls: ['./new-checklist.component.scss'],
})
export class NewChecklistComponent implements OnInit, OnDestroy {
  authUser: User = {} as User;
  publishers: Publisher[] = [];
  newCollection: NewCollection = {} as NewCollection;
  validTypes = [1, 2, 3, 4, 6];

  errors: string[] = [];
  checklist: CheckItem[] = [];

  displayedColumns: string[] = [
    'NRO',
    'TIPO',
    'TITULO',
    'SECCION',
    // 'position',
  ];
  dataSource = new MatTableDataSource<CheckItem>([]);
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  fileName = '';
  isSaving = false;
  isLoaded = false;
  subs: Subscription = new Subscription();

  constructor(
    private newColSrv: NewCollectionService,
    private authSrv: AuthService,
    private uiSrv: UIService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authUser = this.authSrv.getCurrentUser();

    // let pubsSub = this.newColSrv
    //   .getPublishers()
    //   .pipe(take(1))
    //   .subscribe((pubs) => {
    //     this.publishers = pubs.sort((a, b) => {
    //       return (a.name || '').toLocaleLowerCase() >
    //         (b.name || '').toLocaleLowerCase()
    //         ? 1
    //         : -1;
    //     });
    //   });
    // this.subs.add(pubsSub);

    let newColSub = this.newColSrv
      .get(Number(this.activatedRoute.snapshot.params['id']))
      // .pipe(
      //   tap((resp) => {
      //     this.hasVoted =
      //       resp.votes.findIndex((vote) => vote.id == this.authUser.id) >= 0
      //         ? true
      //         : false;
      //   })
      // )
      .pipe(take(1))
      .subscribe((resp) => {
        this.newCollection = resp.newCollection;

        this.isLoaded = true;
      });
    this.subs.add(newColSub);
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
        range: 'A1:D2001',
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
            `Celda A${
              rowNumber + 1
            } está repetido y debe ser único.`
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

        this.checklist.push(row);
        rowNumber++;
      });

      console.log(this.checklist);
      if (this.errors.length == 0) {
        this.dataSource.data = this.checklist;
      }

      // const dataString = JSON.stringify(jsonData);
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
    if (!this.validTypes.includes(type)) return false;
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

  cleanFileInput(file: HTMLInputElement): void {
    file.value = '';
    this.errors = [];
    this.checklist = [];
    this.fileName = '';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
