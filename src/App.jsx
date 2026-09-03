import React, { useEffect, useState } from 'react';
import './App.css';
import * as d3 from 'd3';

function App() {
  const INITIAL_ROWS = 5
  const INITIAL_COLS = 6

  const [rowsCount, setRowsCount] = useState(INITIAL_ROWS)
  const [colsCount, setColsCount] = useState(INITIAL_COLS)

  const [data, setData] = useState({ rows: [], cols: [] });
  const [matrix, setMatrix] = useState([]);

  const {rows, cols} = data;

  useEffect(() => {
    const dataGrid = getData(rowsCount, colsCount)
    setData(dataGrid)
    setMatrix(createMatrix(dataGrid.rows, dataGrid.cols))
  }, [rowsCount, colsCount])

  function handleRandomize() {
    const randRows = Math.floor(Math.random() * 10) + 3 // 3..12
    const randCols = Math.floor(Math.random() * 10) + 3 // 3..12
    setRowsCount(randRows)
    setColsCount(randCols)
  }

  function handleReset() {
    setRowsCount(INITIAL_ROWS)
    setColsCount(INITIAL_COLS)
  }

  function createMatrix(rows, cols) {
    let arr = [];

    rows.map((d) => {
      cols.map((v) => {
        var grid = {
          x: d, 
          y: v,
          product: d * v
        }
        arr.push(grid)
      })
    })

    return arr
  }

  return (
    <div className="App">
      <div className="App-header container card">
        <h1 className="App-title">The Multiplication Grid</h1>
        <p className="App-subtitle">An interactive multiplication visualization</p>
        <div className="App-actions">
          <button onClick={handleRandomize}>Randomize</button>
          <button className="secondary" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="app-grid container">
        <div className="panel card">
          <div className="grid">
            <Grid>
              <TopRow data={rows} />
              <LeftCol data={cols} />
              <Multiples data={matrix} />
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

function Grid({children}) {
  const [dimensions] = useState(createChartDimensions)

  return (
    <svg className="Chart" width={dimensions.width} height={dimensions.height}>
      <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
        {children}
      </g>
    </svg>
  )
}

function TopRow({data}) {
  return (
    <g className='Top-row'>
      <Numbers 
        data={data}
        orient="x"
      />
    </g>
  )
}

function LeftCol({data}) {
  return (
    <g className='Left-col'>
      <Numbers 
        data={data}
        orient="y"
      />
    </g>
  )
}

function Multiples({data}) {
  return (
    <g className='Multiples'>
      <Numbers 
        data={data}
        orient="grid"
      />
    </g>
  )
}

function Numbers({data, orient}) {
  if (orient === "y") {
    return (
      data.map((d, i) => (
        <text 
          key={`y-${i}`}
          transform='translate(-60, 60)'
          y={i * 60}
        >{d}</text>
      ))
    )
  }

  if (orient === "x") {
    return (
      data.map((d, i) => (
        <text 
          key={`x-${i}`}
          transform='translate(0, 0)'
          x={i * 60}
        >{d}</text>
      ))
    )
  }

  return (
    data.map((d) => (
      <text
        key={`${d.x}-${d.y}`}
        transform='translate(-60)'
        x={d.x * 60}
        y={d.y * 60}
      >
        {d.product}
      </text>
    ))
  )
  
}

function createChartDimensions() {
  let dimensions = {
    width: window.innerWidth * 0.8,
    height: window.innerWidth * 0.8,
    margin: {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80,
    },
  }

  return {
      ...dimensions,
      boundedWidth: dimensions.width - dimensions.margin.left - dimensions.margin.right,
      boundedHeight: dimensions.height - dimensions.margin.top - dimensions.margin.bottom
  }
}

function getData(horizontal, vertical) {
  let rows = Array.from(Array(horizontal), (_, i) => i + 1)
  let cols = Array.from(Array(vertical), (_, i) => i + 1)
  return {rows, cols}
}

export default App;