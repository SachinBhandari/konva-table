import "./styles.css";
import konva from "konva";

let row, column;
const defaultDimensions = {
  cellHeight: 25,
  cellWidth: 35,
  minCellHeight: 5,
  minCellWidth: 10
};
const tableForm = document.querySelector("#table-form");

tableForm.addEventListener("submit", (e) => {
  e.preventDefault();
  row = Number(e.target.row.value);
  column = Number(e.target.column.value);
  if (!row || !column) return;
  drawTable();
});

const width = window.innerWidth;
const height = window.innerHeight;
const stageDimension = [width, height - tableForm.offsetHeight];

const stage = new konva.Stage({
  container: "container",
  width: stageDimension[0],
  height: stageDimension[1]
});
const layer = new konva.Layer();

const drawTable = () => {
  layer.destroy();
  const table = new konva.Group({
    x: 0,
    y: 0,
    draggable: true
  });
  const tableTf = new konva.Transformer({
    nodes: [table],
    keepRatio: true,
    ignoreStroke: true,
    rotateEnabled: false
  });

  const tableLineStrokeWidth = 2; // px
  const tableOriginOffset = 0; //px
  const tableOriginCoordinates = [tableOriginOffset, tableOriginOffset];
  const tableEndCoordinates = [
    tableOriginCoordinates[0] + defaultDimensions.cellWidth * column,
    tableOriginCoordinates[1] + defaultDimensions.cellHeight * row
  ];

  for (let i = 0; i < row + 1; i++) {
    const yCoordinate =
      tableOriginCoordinates[1] + defaultDimensions.cellHeight * i;

    const rowLine = new konva.Line({
      x: tableOriginCoordinates[0],
      y: yCoordinate,
      points: [0, 0, tableEndCoordinates[0], 0],
      id: `r${i}`,
      stroke: "black",
      strokeWidth: tableLineStrokeWidth,
      draggable: true,
      strokeScaleEnabled: false,
      dragBoundFunc: function (pos) {
        const tableYSclae = table.getAbsoluteScale().y;
        const tableYMoved = table.absolutePosition().y;
        const upperLineYPosition =
          tableYMoved + tableYSclae * table.find(`#r${i - 1}`)[0].y();
        const lowerLineYPosition =
          tableYMoved + tableYSclae * table.find(`#r${i + 1}`)[0].y();

        const resultantUpperCellHeight = pos.y - upperLineYPosition;
        const resultantLowerCellHeight = lowerLineYPosition - pos.y;

        if (
          resultantLowerCellHeight < defaultDimensions.cellHeight ||
          resultantUpperCellHeight < defaultDimensions.cellHeight
        ) {
          return {
            x: this.absolutePosition().x,
            y: this.absolutePosition().y
          };
        }

        return {
          x: this.absolutePosition().x,
          y: pos.y
        };
      }
    });
    table.add(rowLine);
    if (i === 0 || i === row) {
      rowLine.draggable(false);
      rowLine.on("dragmove", () => {
        document.body.style.cursor = "move";
      });
      rowLine.on("mouseover", () => {
        document.body.style.cursor = "move";
      });
      rowLine.on("mouseout", () => {
        document.body.style.cursor = "default";
      });
    } else {
      rowLine.on("dragmove", () => {
        document.body.style.cursor = "row-resize";
      });
      rowLine.on("mouseover", () => {
        document.body.style.cursor = "row-resize";
      });
      rowLine.on("mouseout", () => {
        document.body.style.cursor = "default";
      });
    }
  }

  for (let j = 0; j < column + 1; j++) {
    const xCoordinate =
      tableOriginCoordinates[0] + defaultDimensions.cellWidth * j;
    const columnLine = new konva.Line({
      x: xCoordinate,
      y: tableOriginCoordinates[1],
      points: [0, 0, 0, tableEndCoordinates[1]],
      id: `c${j}`,
      stroke: "black",
      strokeWidth: tableLineStrokeWidth,
      draggable: true,
      strokeScaleEnabled: false,
      dragBoundFunc: function (pos) {
        const tableXSclae = table.getAbsoluteScale().x;
        const tableXMoved = table.absolutePosition().x;
        const leftLineXPosition =
          tableXMoved + tableXSclae * table.find(`#c${j - 1}`)[0].x();
        const rightLineXPosition =
          tableXMoved + tableXSclae * table.find(`#c${j + 1}`)[0].x();

        const resultantLeftCellWidth = pos.x - leftLineXPosition;
        const resultantRightCellWidth = rightLineXPosition - pos.x;

        if (
          resultantLeftCellWidth < defaultDimensions.cellWidth ||
          resultantRightCellWidth < defaultDimensions.cellWidth
        ) {
          return {
            x: this.absolutePosition().x,
            y: this.absolutePosition().y
          };
        }

        return {
          x: pos.x,
          y: this.absolutePosition().y
        };
      }
    });
    table.add(columnLine);
    if (j === 0 || j === column) {
      columnLine.draggable(false);
      columnLine.on("dragmove", () => {
        document.body.style.cursor = "move";
      });
      columnLine.on("mouseover", () => {
        document.body.style.cursor = "move";
      });
      columnLine.on("mouseout", () => {
        document.body.style.cursor = "default";
      });
    } else {
      columnLine.on("dragmove", () => {
        document.body.style.cursor = "col-resize";
      });
      columnLine.on("mouseover", () => {
        document.body.style.cursor = "col-resize";
      });
      columnLine.on("mouseout", () => {
        document.body.style.cursor = "default";
      });
    }
  }
  layer.add(table);
  layer.add(tableTf);
  stage.add(layer);
};
