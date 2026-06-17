import { useState, useRef, useEffect } from 'react'
import styles from './PrioridadesList.module.css'

const CONFIGURABLE_COLS = [
  { key: 'codigo',      label: 'Código' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'color',       label: 'Color' },
]

const DEFAULT_VISIBLE = Object.fromEntries(CONFIGURABLE_COLS.map(c => [c.key, true]))

const GEAR_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

export default function PrioridadesList({ prioridades, onCrear, onEditar, onEliminar }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [colsVisible, setColsVisible] = useState(DEFAULT_VISIBLE)
  const [colsMenuOpen, setColsMenuOpen] = useState(false)
  const gearRef = useRef(null)

  useEffect(() => {
    if (!colsMenuOpen) return
    const handler = (e) => {
      if (gearRef.current && !gearRef.current.contains(e.target)) setColsMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [colsMenuOpen])

  const toggleCol = (key) => setColsVisible(prev => ({ ...prev, [key]: !prev[key] }))
  const vis = (key) => colsVisible[key]

  const filtered = prioridades.filter(p =>
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.codigo).includes(searchTerm)
  )

  const closeMenu = () => setOpenMenuId(null)

  return (
    <div className={styles.wrapper} onClick={closeMenu}>

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.searchField}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            aria-label="Buscar prioridad"
          />
        </div>
        <button className={styles.createBtn} type="button" onClick={onCrear}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Crear Prioridad
        </button>
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {vis('codigo')      && <th className={styles.codeCol}>Código</th>}
              {vis('descripcion') && <th>Descripción</th>}
              {vis('color')       && <th className={styles.colorCol}>Color</th>}
              <th className={styles.menuCol} ref={gearRef}>
                <button
                  type="button"
                  className={styles.gearBtn}
                  onClick={e => { e.stopPropagation(); setColsMenuOpen(o => !o) }}
                  title="Configurar columnas"
                  aria-label="Configurar columnas visibles"
                  aria-expanded={colsMenuOpen}
                >
                  {GEAR_SVG}
                </button>
                {colsMenuOpen && (
                  <div className={styles.colsMenu} role="menu">
                    <div className={styles.colsMenuHeader}>Columnas visibles</div>
                    {CONFIGURABLE_COLS.map(col => (
                      <label key={col.key} className={styles.colsMenuItem}>
                        <input
                          type="checkbox"
                          checked={colsVisible[col.key]}
                          onChange={() => toggleCol(col.key)}
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={CONFIGURABLE_COLS.length + 1} className={styles.empty}>No se encontraron prioridades</td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p.id} className={openMenuId === p.id ? styles.rowActive : ''}>
                {vis('codigo')      && <td className={`${styles.codeCol} ${styles.codeCell}`}>{p.codigo}</td>}
                {vis('descripcion') && <td className={styles.descCell}>{p.descripcion}</td>}
                {vis('color')       && (
                  <td className={styles.colorCol}>
                    <span className={styles.colorPill} style={{ background: p.color }} aria-label={`Color ${p.color}`} />
                  </td>
                )}
                <td className={styles.menuCol} onClick={e => e.stopPropagation()}>
                  <div className={styles.menuContainer}>
                    <button
                      className={styles.menuBtn}
                      onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                      aria-label={`Opciones para ${p.descripcion}`}
                    >
                      ⋮
                    </button>
                    {openMenuId === p.id && (
                      <div className={styles.dropdown}>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => { onEditar(p); closeMenu() }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                          </svg>
                          Editar
                        </button>
                        <button
                          className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                          onClick={() => { onEliminar(p); closeMenu() }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
