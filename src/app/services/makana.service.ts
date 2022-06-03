// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { MakanaEndpoint } from './makana-endpoint.service';
import { AuthService } from './auth.service';
import { PipelineShape } from "../models/pipeline-shape.model";
import { PipelineShapeConnection } from "../models/pipeline-shape-connection.model";

@Injectable()
export class MakanaService {
    

    constructor(
        private authService: AuthService,
      private makanaEndpoint: MakanaEndpoint) {

    }

    
    getDiagram() {

      return this.makanaEndpoint.getDiagramEndpoint<any[]>();
    }
    
  getPipelineShapesAndConnections(pipelineId: number) {

    return forkJoin(
      this.makanaEndpoint.getPipelineShapesEndpoint<PipelineShape[]>(pipelineId),
      this.makanaEndpoint.getPipelineShapeConnectionsEndpoint<PipelineShapeConnection[]>(pipelineId));
  }
}
