// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, ViewEncapsulation, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { fadeInOut } from '../../services/animations';
import { MakanaService } from '../../services/makana.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ShapeInfoComponent } from "../controls/shape-info.component";
import { PipelineShape } from "../../models/pipeline-shape.model";
import { Utilities } from "../../services/utilities";
import { PipelineShapeConnection } from "../../models/pipeline-shape-connection.model";
declare var kendo: any;

@Component({
    selector: 'experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [fadeInOut]
})
export class ExperimentsComponent implements AfterViewInit, OnDestroy {
  private pipelineShapes: PipelineShape[] = [];
  private pipelineShapeConnections: PipelineShapeConnection[] = [];
  private diagram: any;
  iconComplete = require('../../assets/images/icon-complete.png');
  svgSprite = require('../../assets/images/ee_svg_sprite.svg');
  svgNotStarted = require('../../assets/images/icon-notstarted.png');
  svgInvalid = require('../../assets/images/exclamation-circle-solid.svg');
  svgNone = require('../../assets/images/icon-none.svg');
  editedShape: PipelineShape;
  sourceShape: PipelineShape;
  editingShapeName: { name: string };
  
  @ViewChild('shapePropertiesModal', { static: false })
  public shapePropertiesModal: ModalDirective;

  @ViewChild('shapePropertiesEditor', { static: false })
  public shapePropertiesEditor: ShapeInfoComponent;

  @ViewChild('diagram', { static: true }) diagramEl: ElementRef;

  constructor(private alertService: AlertService, private hostEl: ElementRef, private makanaService: MakanaService) {
    
  }

  onShapePropertiesEditorModalHidden() {
    this.editingShapeName = null;
    this.shapePropertiesEditor.resetForm(true);
  }
  editShape() {
    var editShape = new PipelineShape();
    editShape.shapeDisplayName = "Test";
    this.editingShapeName = { name: editShape.shapeDisplayName };
    this.sourceShape = editShape;
    this.editedShape = this.shapePropertiesEditor.editShape(editShape);

    this.shapePropertiesModal.show();
  }

  ///////////////// Events //////////////////

  ngAfterViewInit() {

    this.shapePropertiesEditor.changesSavedCallback = () => {
      //this.addNewUserToList();
      //this.loadAllData();
      this.shapePropertiesModal.hide();
    };

    this.shapePropertiesEditor.changesCancelledCallback = () => {
      this.editedShape = null;
      this.sourceShape = null;
      this.shapePropertiesModal.hide();
    };

    this.makanaService.getPipelineShapesAndConnections(1).subscribe(results =>
      this.onDataLoadSuccessful(results[0], results[1])
      , error => this.onDataLoadFailed(error));
    
  }

  ngOnDestroy(): void {
    kendo.destroy(this.hostEl.nativeElement);
  }

  //////////////////////////////////////////

  /////////////// Diagram //////////////////
  onDataLoadSuccessful(pipelineShapes: PipelineShape[], pipelineShapeConnections: PipelineShapeConnection[]) {
    this.pipelineShapes = pipelineShapes;
    this.pipelineShapeConnections = pipelineShapeConnections;
    var self = this;
    console.log(pipelineShapes);
    console.log(pipelineShapeConnections);
    kendo.jQuery(this.diagramEl.nativeElement).kendoDiagram({
      zoom: 1.0,
      mouseEnter: function (e) {
        if (e.item instanceof kendo.dataviz.diagram.Shape) {
          e.item.shapeVisual.children[0].redraw({
            //fill: "black",
            stroke: {
              color: "#808080",
              width: 2
            }
          });
        }
      },
      mouseLeave: function (e) {
        if (e.item instanceof kendo.dataviz.diagram.Shape) {
          e.item.shapeVisual.children[0].redraw({
            stroke: {
              color: "#b3B3B3",
              width: 2
            }
            //fill: "#e8eff7",
          });
        }
      },
      dataSource: new kendo.data.HierarchicalDataSource({
        data: this.pipelineShapes,
        schema: {
          model: {
            fields: {
              id: { from: "id", type: "string", editable: false },
              name: { from: "name", type: "string" },
              imageUrl: { from: "imageUrl", type: "string" },
              statusImageUrl: { from: "statusImageUrl", type: "string" },
              //Name: { from: "dataItem.Name", type: "string" },
              //ImageUrl: { from: "dataItem.ImageUrl", type: "string" },
              //RightImageUrl: { from: "dataItem.RightImageUrl", type: "string" },
              // connectors: { from: "connectors"}
            }
          }
        }
      }),
      connectionsDataSource: new kendo.data.HierarchicalDataSource({
        data: this.pipelineShapeConnections,
        schema: {
          model: {
            fields: {
              id: { from: "id", type: "string", editable: false },
              //from: { from: "FromShapeId", type: "string" },
              //to: { from: "ToShapeId", type: "string" },
              from: { from: "from", type: "string" },
              to: { from: "to", type: "string" },
              fromConnector: { from: "fromConnector" },
              toConnector: { from: "toConnector" }
            }
          }
        }
      }),
      selectable: {
        stroke: {
          dashType: "solid",
          color: "blue",
          width: 1
        }
      },
      shapeDefaults: {
        visual: self.visualTemplate,
        editable: {
          
          tools: [
            {
              type: "button",
              //id: "saveButton",
              spriteCssClass: "fas fa-edit",
              text: "Edit",
              click: () => {
                var selected = kendo.jQuery(this.diagramEl.nativeElement).getKendoDiagram().select();
                if (selected.length == 1) {
                  this.editShape();
                }
                // if (e.item instanceof kendo.dataviz.diagram.Shape) {
                console.log('Edit button clicked!');
                //}
                 
              }
            },
            
            {
              type: "button",
              spriteCssClass: "fa fa-eye",
              text: "View",
              click: () => {
                var selected = kendo.jQuery(this.diagramEl.nativeElement).getKendoDiagram().select();
                if (selected.length == 1) {
                  this.editShape();
                }
                 console.log('View button clicked!');
              }
            }
            
          ]
        },
        width: 280,
        height: 50,
        fill: "#E8F2FB",
        content: {
          //template: "#= dataItem.name #",
          fontSize: 14
        },
        //comment out large connector
        //connectorDefaults: {
        //  width: 15,
        //  height: 15,
        //  fill: {
        //    color: "#ffffff",
        //    opacity: 10
        //  },
        //  stroke: {
        //    color: "#000000",
        //    dashType: "solid"
        //  }
        //},
        //connectors: "#= dataItem.connectors #"
        connectors:
          [
            { name: "top" },
            { name: "bottom" },
            { name: "auto" },
            {
              name: "bottomLeft",
              position: function (shape) {
                {
                  var p = shape.bounds().bottom();
                  return shape._transformPoint(new kendo.dataviz.diagram.Point(p.x - 50, p.y));
                }
              },
            },
            {
              name: "topLeft",
              position: function (shape) {
                {
                  var p = shape.bounds().top();
                  return shape._transformPoint(new kendo.dataviz.diagram.Point(p.x - 50, p.y));
                }
              },
            },
            {
              name: "topRight",
              position: function (shape) {
                {
                  var p = shape.bounds().top();
                  return shape._transformPoint(new kendo.dataviz.diagram.Point(p.x + 50, p.y));
                }
              },
            },
            {
              name: "bottomRight",
              position: function (shape) {
                {
                  var p = shape.bounds().bottom();
                  return shape._transformPoint(new kendo.dataviz.diagram.Point(p.x + 50, p.y));
                }
              },
            }
          ],
      },
      connectionDefaults: {
        stroke: {
          color: "#586477",
          width: 2
        },
        editable: {
          tools: false
        },
        startCap: "FilledCircle",
        endCap: "ArrowEnd"
      },
      layout: false,
      dataBound: function (e) {
        console.log('onDataBound');
        this.bringIntoView(this.shapes);
      },
      zoomEnd: function (e) {
        console.log("Zoom End level changed to: " + e.zoom);
        kendo.jQuery("#zoom").getKendoSlider().value(e.zoom);
      },
      click: function (e) {
        //if (e.item instanceof kendo.dataviz.diagram.Shape)
        //  self.editShape();
        ////console.log(e.item.options.content ? e.item.options.content.text : "No content.");
        //else
        //  console.log("Clicked a connection.");
      },
      editable: {
        tools: [
          //  {
          //  type: "button",
          //  text: "Set Selected Content",
          //  click: function () {
          //    var selected = kendo.jQuery(self.diagramEl.nativeElement).getKendoDiagram().select();
          //    var content = kendo.jQuery("#content").val();
          //    for (var idx = 0; idx < selected.length; idx++) {
          //      selected[idx].content(content);
          //    }
          //  }
          //},
          //  {
          //  template: "<input id='content' class='k-textbox' value='Foo' />"
          //  },
          //  {
          //    template: '<input id="dropdownlist" />', overflow: "never"
          //  },
          // { template: "<label>SHAPE:</label><input id='shape' />" },
          {
            type: "button",
            id: "saveButton",
            spriteCssClass: "fa fa-save",
            text: "Save",
            click: function () { console.log('Save button clicked!'); }
          },
          { type: "separator" },
          {
            type: "button",
            spriteCssClass: "fa fa-play",
            text: "Play",
            attributes: { style: "float: right;" },
            click: function () { console.log('Play button clicked!'); }
          },
          { type: "separator" },
          { template: "<input id='zoom' />" }
        ]
      }
    });
    kendo.jQuery("#zoom").kendoSlider({
      increaseButtonTitle: "Right",
      decreaseButtonTitle: "Left",
      min: 0.1,
      max: 2,
      smallStep: 0.1,
      change: function (e) {
        console.log("Change :: new values are: " + e.value.toString().replace(",", " - "));
        var diagram = kendo.jQuery(self.diagramEl.nativeElement).getKendoDiagram();
        diagram.zoom(e.value);
      },
      tickPlacement: "none",
      value: 1
      // largeStep: 0.1
    });
    kendo.jQuery("#shape").kendoDropDownList({
      dataTextField: "text",
      dataValueField: "value",
      dataSource: [
        { text: "Rectangle", value: 0 },
        { text: "Rounded rectangle", value: 30 },
        { text: "Circle/Ellipse", value: 300 }
      ],
      change: function () {
        console.log('dropdown');
      }
    });
    kendo.jQuery(this.diagramEl.nativeElement).kendoDropTarget({
      drop: function(e) {
        console.log("drop");
      }
    });
    kendo.jQuery("#shapesPanelBar").kendoDraggable({
      filter: ".shapeItem",
      hint: function (element) {
        return element.clone();
      }
    });
  }
  getTextHeight(text) {
    kendo.JQuery("body").append("<span id='hintWidth' style='display:block;width:220px;word-wrap:break-word;font-size: 12px;font-family:sans-serif;'>" + text + "</span>");
    var width = kendo.JQuery("#hintWidth").width();
    var height = kendo.JQuery("#hintWidth").height();
    //alert('height' + height);
    kendo.JQuery("#hintWidth").remove();
    return height;
  }
  visualTemplate(options) {

    var dataviz = kendo.dataviz;
    var g = new dataviz.diagram.Group();
    var dataItem = options.dataItem;
    g.drawingElement.options.tooltip = {
      content: dataItem.toolTip,
      shared: true
    };
    //debugger;
    //options.x = 0;
    //options.y = 0;
    //debugger;
    //options.connectors = dataItem.connectors;
    //debugger;
    var arr = [];
    kendo.jQuery.each(options.connectors, function (index, connector) {
      kendo.jQuery.each(dataItem.shape.shapeConnectors, function (index, dataItemConnector) {
        if (dataItemConnector.name == connector.name) {
          arr.push(connector);
        }
      });
    });
    options.connectors = arr;
    var rectHeight = 50;
    var textHeight = 0;
    if (dataItem.comments != undefined && dataItem.commentsExpand == true) {
      textHeight = this.getTextHeight(dataItem.comments);
      if (textHeight + 35 > rectHeight) {
        rectHeight = textHeight + 35;
      }
    }
    if (dataItem.name == "Start") {
      var startCircle =
        g.append(new dataviz.diagram.Circle({
          radius: 30,
          stroke: {
            width: 2,
            color: "#586477"
          },
          fill: "#e8eff7"
        }));
      g.append(new dataviz.diagram.Circle({
        radius: 15,
        x: 15,
        y: 15,
        stroke: {
          width: 2,
          color: "#586477"
        },
        fill: "#2e5684"
      }));
    }
    else {
      g.append(new dataviz.diagram.Rectangle({
        width: 280,
        height: rectHeight,
        stroke: {
          color: "#b3B3B3",
          width: 2
        },
        fill: "#ffffff"
      }));

      g.append(new dataviz.diagram.Image({
        source: dataItem.shape.imageUrl,
        x: 10,
        y: 12,
        width: 24,
        height: 24
      }));
      g.append(new dataviz.diagram.TextBlock({
        text: dataItem.shapeDisplayName,
        x: 50,
        y: 18,
        fontSize: 14,
      }));
      g.append(new dataviz.diagram.Image({
        source: dataItem.statusImageUrl,
        x: 240,
        y: 10,
        width: 16,
        height: 16
      }));
      if (dataItem.comments != undefined && dataItem.comments != "" && dataItem.commentsExpand == true) {
        g.append(new dataviz.diagram.Image({
          source: '/ee_svg_sprite.svg#Images--icon-chevron-expanded',
          x: 260,
          y: 10,
          width: 9,
          height: 6
        }));
        //g.append(new kendo.dataviz.diagram.Path({
        //    width: 9,
        //    height: 6,
        //    x: 260,
        //    y: 15,
        //    data: "M4.5 3l3 3L9 4.5 4.5 0 0 4.5 1.5 6z",
        //    fill: "black"
        //}));
        var shapeCommentsWidth = 220;
        var layout = new dataviz.diagram.Layout(new dataviz.diagram.Rect(50, 35, shapeCommentsWidth, textHeight), {
          alignContent: "start",
          spacing: 4
        });
        g.append(layout);

        var texts = dataItem.comments.split(" ");
        for (var i = 0; i < texts.length; i++) {
          layout.append(new dataviz.diagram.TextBlock({
            text: texts[i],
            fontSize: 12
          }));
        }
        layout.reflow();
      }
      else if (dataItem.comments != undefined && dataItem.comments != "" && dataItem.commentsExpand == false) {
        //g.append(new kendo.dataviz.diagram.Path({
        //    width: 9,
        //    height: 6,
        //    x: 260,
        //    y: 15,
        //    data: "M4.5 3l-3-3L0 1.5 4.5 6 9 1.5 7.5 0z",
        //    fill: "black"
        //}));
        g.append(new dataviz.diagram.Image({
          source: '/ee_svg_sprite.svg#Images--icon-chevron-collapsed',
          x: 260,
          y: 15,
          width: 9,
          height: 6
        }));
      }
      else {
        g.append(new dataviz.diagram.Image({
          source: '/icon-none.svg',
          x: 260,
          y: 15,
          width: 16,
          height: 16
        }));
      }
    }

    return g;
  }

  onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Load Error', `Unable to retrieve diagram data from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }
  private diagramNodes() {
    const root = { name: '0', items: [] };
    this.addNodes(root, [3, 2, 2]);
    return [root];
  }

  private addNodes(root, levels) {
    if (levels.length > 0) {
      for (let i = 0; i < levels[0]; i++) {
        const node = { name: '0', items: [] };
        root.items.push(node);

        this.addNodes(node, levels.slice(1));
      }
    }
  }
  //////////////////////////////////////////
}
