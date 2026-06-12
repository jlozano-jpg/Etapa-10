import { useState, useRef, useEffect } from 'react'
import styles from './OperariosList.module.css'

export default function OperariosList({ operarios, searchTerm, onSearchChange, onView, onEdit, onDelete, onCreate }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [sortBy, setSortBy] = useState('code')
  const [sortDirection, setSortDirection] = useState('asc')
  const scrollContainerRef = useRef(null)

  const [columnWidths, setColumnWidths] = useState({ code: 100, name: 320 })
  const resizingRef = useRef(null)
  const onMoveRef = useRef(null)
  const onUpRef = useRef(null)

  useEffect(() => {
    return () => {
      if (onMoveRef.current) document.removeEventListener('mousemove', onMoveRef.current)
      if (onUpRef.current) document.removeEventListener('mouseup', onUpRef.current)
      document.body.style.userSelect = 'auto'
    }
  }, [])

  const initResize = (field, e) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = columnWidths[field]
    resizingRef.current = { field, startX, startWidth }

    onMoveRef.current = (ev) => {
      if (!resizingRef.current) return
      const { field: f, startX: sX, startWidth: sW } = resizingRef.current
      const delta = ev.clientX - sX
      setColumnWidths((prev) => ({ ...prev, [f]: Math.max(50, Math.round(sW + delta)) }))
    }

    onUpRef.current = () => {
      resizingRef.current = null
      if (onMoveRef.current) document.removeEventListener('mousemove', onMoveRef.current)
      if (onUpRef.current) document.removeEventListener('mouseup', onUpRef.current)
      document.body.style.userSelect = 'auto'
    }

    document.addEventListener('mousemove', onMoveRef.current)
    document.addEventListener('mouseup', onUpRef.current)
    document.body.style.userSelect = 'none'
  }

  const sortedOperarios = [...operarios].sort((a, b) => {
    if (sortBy === 'code') {
      return sortDirection === 'asc'
        ? String(a.code).localeCompare(String(b.code), 'es', { numeric: true })
        : String(b.code).localeCompare(String(a.code), 'es', { numeric: true })
    }

    if (sortBy === 'preparador' || sortBy === 'controlador') {
      const aVal = a[sortBy] ? 1 : 0
      const bVal = b[sortBy] ? 1 : 0
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }

    const result = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    return sortDirection === 'asc' ? result : -result
  })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(field)
    setSortDirection('asc')
  }

  const getSortIndicator = (field) => {
    if (sortBy !== field) {
      return '↕'
    }
    return sortDirection === 'asc' ? '▲' : '▼'
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Operadores de Stock</h1>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchField}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar operario"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
            autoFocus
            aria-label="Buscar operario"
          />
        </div>

        <button className={styles.newBtn} onClick={onCreate}>
          <svg className={styles.newIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo Operario
        </button>
      </div>

      <div className={styles.tableContainer} ref={scrollContainerRef}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: columnWidths.code }}>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className={`${styles.columnHeader} ${sortBy === 'code' ? styles.activeHeader : ''}`}
                    onClick={() => handleSort('code')}
                    aria-sort={sortBy === 'code' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    Código <span className={styles.sortIndicator}>{getSortIndicator('code')}</span>
                  </button>
                  <div
                    className={styles.resizer}
                    onMouseDown={(e) => initResize('code', e)}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Redimensionar columna código"
                  />
                </div>
              </th>
              <th style={{ width: columnWidths.name }}>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className={`${styles.columnHeader} ${sortBy === 'name' ? styles.activeHeader : ''}`}
                    onClick={() => handleSort('name')}
                    aria-sort={sortBy === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    Nombre <span className={styles.sortIndicator}>{getSortIndicator('name')}</span>
                  </button>
                  <div
                    className={styles.resizer}
                    onMouseDown={(e) => initResize('name', e)}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Redimensionar columna nombre"
                  />
                </div>
              </th>
              <th className={styles.statusHeader}>
                <button
                  type="button"
                  className={`${styles.columnHeader} ${sortBy === 'preparador' ? styles.activeHeader : ''}`}
                  onClick={() => handleSort('preparador')}
                  aria-sort={sortBy === 'preparador' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  Preparador <span className={styles.sortIndicator}>{getSortIndicator('preparador')}</span>
                </button>
              </th>
              <th className={styles.statusHeader}>
                <button
                  type="button"
                  className={`${styles.columnHeader} ${sortBy === 'controlador' ? styles.activeHeader : ''}`}
                  onClick={() => handleSort('controlador')}
                  aria-sort={sortBy === 'controlador' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  Controlador <span className={styles.sortIndicator}>{getSortIndicator('controlador')}</span>
                </button>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sortedOperarios.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.empty}>
                  No se encontraron operarios
                </td>
              </tr>
            ) : (
              sortedOperarios.map((operario) => (
                <tr
                  key={operario.id}
                  className={hoveredId === operario.id ? styles.rowHovered : ''}
                  onMouseEnter={() => setHoveredId(operario.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <td className={styles.code} style={{ width: columnWidths.code }}>{operario.code}</td>
                  <td className={styles.name} style={{ width: columnWidths.name }}>{operario.name}</td>
                  <td className={styles.statusCell}>
                    {operario.preparador ? (
                      <span className={styles.statusBadge}>Activo</span>
                    ) : (
                      <span className={styles.statusNo}>-</span>
                    )}
                  </td>
                  <td className={styles.statusCell}>
                    {operario.controlador ? (
                      <span className={styles.statusBadge}>Activo</span>
                    ) : (
                      <span className={styles.statusNo}>-</span>
                    )}
                  </td>
                  <td className={styles.menuCell}>
                    <div className={styles.menuContainer}>
                      <button
                        className={styles.menuBtn}
                        onClick={() => setOpenMenuId(openMenuId === operario.id ? null : operario.id)}
                        title="Opciones"
                        aria-label={`Menú de opciones para ${operario.name}`}
                      >
                        ⋮
                      </button>
                      {openMenuId === operario.id && (
                        <div className={styles.dropdown}>
                          <button
                            className={styles.dropdownItem}
                            onClick={() => {
                              onView(operario)
                              setOpenMenuId(null)
                            }}
                          >
                            <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            Visualizar
                          </button>
                          <button
                            className={styles.dropdownItem}
                            onClick={() => {
                              onEdit(operario)
                              setOpenMenuId(null)
                            }}
                          >
                            <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            className={`${styles.dropdownItem} ${styles.deleteItem}`}
                            onClick={() => {
                              onDelete(operario)
                              setOpenMenuId(null)
                            }}
                          >
                            <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M3 6h18" />
                              <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
                              <path d="M10 11v6M14 11v6" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <p>{sortedOperarios.length} operarios encontrados</p>
      </div>
    </div>
  )
}
