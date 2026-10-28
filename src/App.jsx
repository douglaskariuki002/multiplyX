import { useMemo, useState } from 'react'
import './App.css'

const INITIAL_ROWS = 5
const INITIAL_COLS = 6
const MIN_VALUE = 1
const MAX_VALUE = 12

function App() {
  const [rowsCount, setRowsCount] = useState(INITIAL_ROWS)
  const [colsCount, setColsCount] = useState(INITIAL_COLS)

  const rows = useMemo(() => getSequence(rowsCount), [rowsCount])
  const cols = useMemo(() => getSequence(colsCount), [colsCount])
  const matrix = useMemo(() => createMatrix(rows, cols), [rows, cols])

  const handleRowChange = (event) => {
    setRowsCount(clampNumber(Number(event.target.value), MIN_VALUE, MAX_VALUE))
  }

  const handleColChange = (event) => {
    setColsCount(clampNumber(Number(event.target.value), MIN_VALUE, MAX_VALUE))
  }

  const handleRandomize = () => {
    setRowsCount(makeRandomValue())
    setColsCount(makeRandomValue())
  }

  const handleReset = () => {
    setRowsCount(INITIAL_ROWS)
    setColsCount(INITIAL_COLS)
  }

  return (
    <div className="App">
      <div className="App-header container card">
        <h1 className="App-title">The Multiplication Grid</h1>
        <p className="App-subtitle">Choose the row and column values manually, or randomize them.</p>

        <div className="App-controls">
          <label className="control-field">
            <span>Rows</span>
            <input
              type="number"
              min={MIN_VALUE}
              max={MAX_VALUE}
              value={rowsCount}
              onChange={handleRowChange}
            />
          </label>

          <label className="control-field">
            <span>Columns</span>
            <input
              type="number"
              min={MIN_VALUE}
              max={MAX_VALUE}
              value={colsCount}
              onChange={handleColChange}
            />
          </label>
        </div>

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
  )
}

function Grid({ children }) {
  const [dimensions] = useState(createChartDimensions)

  return (
    <svg className="Chart" width={dimensions.width} height={dimensions.height}>
      <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
        {children}
      </g>
    </svg>
  )
}

function TopRow({ data }) {
  return (
    <g className="Top-row">
      <Numbers data={data} orient="x" />
    </g>
  )
}

function LeftCol({ data }) {
  return (
    <g className="Left-col">
      <Numbers data={data} orient="y" />
    </g>
  )
}

function Multiples({ data }) {
  return (
    <g className="Multiples">
      <Numbers data={data} orient="grid" />
    </g>
  )
}

function Numbers({ data, orient }) {
  if (orient === 'y') {
    return data.map((d, i) => (
      <text key={`y-${i}`} transform="translate(-60, 60)" y={i * 60}>
        {d}
      </text>
    ))
  }

  if (orient === 'x') {
    return data.map((d, i) => (
      <text key={`x-${i}`} transform="translate(0, 0)" x={i * 60}>
        {d}
      </text>
    ))
  }

  return data.map((d) => (
    <text
      key={`${d.x}-${d.y}`}
      transform="translate(-60)"
      x={d.x * 60}
      y={d.y * 60}
    >
      {d.product}
    </text>
  ))
}

function createChartDimensions() {
  const dimensions = {
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
    boundedHeight: dimensions.height - dimensions.margin.top - dimensions.margin.bottom,
  }
}

function getSequence(length) {
  return Array.from({ length }, (_, i) => i + 1)
}

function createMatrix(rows, cols) {
  const arr = []

  rows.forEach((rowValue) => {
    cols.forEach((colValue) => {
      arr.push({
        x: rowValue,
        y: colValue,
        product: rowValue * colValue,
      })
    })
  })

  return arr
}

function makeRandomValue() {
  return Math.floor(Math.random() * 10) + 3
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) {
    return min
  }

  return Math.min(Math.max(value, min), max)
}

export default App
