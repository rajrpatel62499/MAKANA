// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { EndpointBase } from './endpoint-base.service';
import { ConfigurationService } from './configuration.service';


@Injectable()
export class MakanaEndpoint extends EndpointBase {

    
    
  private readonly _diagramUrl: string = '/api/makana/retrieveMachineLearningShapes';
  private readonly _pipelineShapesUrl: string = '/api/makana/pipelines/pipelineShapes';
  private readonly _pipelineShapeConnectionsUrl: string = '/api/makana/pipeline/pipelineShapeConnections';

  get pipelineShapesUrl() { return this.configurations.baseUrl + this._pipelineShapesUrl; }
  get pipelineShapeConnectionsUrl() { return this.configurations.baseUrl + this._pipelineShapeConnectionsUrl; }  
  get diagramUrl() { return this.configurations.baseUrl + this._diagramUrl; }


    constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
        super(http, authService);
    }



    getDiagramEndpoint<T>(): Observable<T> {

      return this.http.get<T>(this.diagramUrl, this.requestHeaders).pipe<T>(
            catchError(error => {
              return this.handleError(error, () => this.getDiagramEndpoint());
            }));
    }
    getPipelineShapesEndpoint<T>(pipelineId?: number): Observable<T> {
      const endpointUrl =  `${this.pipelineShapesUrl}/${pipelineId}`;

      return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
        catchError(error => {
          return this.handleError(error, () => this.getPipelineShapesEndpoint(pipelineId));
        }));
    }
    getPipelineShapeConnectionsEndpoint<T>(pipelineId?: number): Observable<T> {
      const endpointUrl = `${this.pipelineShapeConnectionsUrl}/${pipelineId}`;

      return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
        catchError(error => {
          return this.handleError(error, () => this.getPipelineShapeConnectionsEndpoint(pipelineId));
        }));
      }
}
