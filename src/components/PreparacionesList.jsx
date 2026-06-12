import { useState } from 'react'
import styles from './PreparacionesList.module.css'

const COLUMNS = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'origen', label: 'Origen' },
  { key: 'comprobante', label: 'Comprobante' },
  { key: 'sucursal', label: 'Sucursal' },
  { key: 'deposito', label: 'Depósito' },
  { key: 'codigo', label: 'Código' },
  { key: 'razonSocial', label: 'Razón Social' },
  { key: 'preparador', label: 'Preparador' },
  { key: 'prioridad', label: 'Prioridad' },
  { key: 'estado', label: 'Estado' },
  { key: 'avance', label: 'Avance' },
  { key: 'transporte', label: 'Transporte' },
  { key: 'zona', label: 'Zona' },
  { key: 'localidad', label: 'Localidad' }
]

export default function PreparacionesList({ preparaciones, searchTerm, onSearchChange, onView, onEdit, onDelete, onCreate, onGenerateReport, onRowClick }) {
  const [openMenuId, setOpenMenuId] = useState(null)

  const formatCell = (preparacion, column) => {
    if (column.key === 'preparador') {
      return <span className={styles.verDetallePill}>Ver detalle</span>
    }
    if (column.key === 'comprobante') {
      return preparacion.numeroPreparacion ?? preparacion.comprobante ?? ''
    }
    const value = preparacion[column.key]
    if (column.key === 'avance') {
      return value === '' || value === null || value === undefined ? '' : `${value}%`
    }
    return value ?? ''
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.searchField}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar preparación"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
            aria-label="Buscar preparación"
          />
        </div>

        <div className={styles.toolbarActions}>
          <button type="button" className={styles.filterBtn} title="Filtros" aria-label="Filtros">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="21" x2="14" y1="4" y2="4" />
              <line x1="10" x2="3" y1="4" y2="4" />
              <line x1="21" x2="12" y1="12" y2="12" />
              <line x1="8" x2="3" y1="12" y2="12" />
              <line x1="21" x2="16" y1="20" y2="20" />
              <line x1="12" x2="3" y1="20" y2="20" />
              <line x1="14" x2="14" y1="2" y2="6" />
              <line x1="8" x2="8" y1="10" y2="14" />
              <line x1="16" x2="16" y1="18" y2="22" />
            </svg>
          </button>

          <button type="button" className={styles.newBtn} onClick={onCreate}>
            <svg className={styles.newIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva Preparación
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map(column => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>
                <svg className={styles.menuHeaderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Configuración">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 3 13.09H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {preparaciones.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className={styles.empty}>
                  No hay preparaciones para mostrar
                </td>
              </tr>
            ) : (
              preparaciones.map(preparacion => (
                <tr
                  key={preparacion.id}
                  className={styles.clickableRow}
                  onClick={() => onRowClick?.(preparacion)}
                >
                  {COLUMNS.map(column => (
                    <td key={column.key}>{formatCell(preparacion, column)}</td>
                  ))}
                  <td className={styles.menuCell} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.menuContainer}>
                      <button
                        className={styles.menuBtn}
                        onClick={() => setOpenMenuId(openMenuId === preparacion.id ? null : preparacion.id)}
                        title="Opciones"
                        aria-label={`Menú de opciones para ${preparacion.codigo || 'preparación'}`}
                      >
                        ⋮
                      </button>
                      {openMenuId === preparacion.id && (
                        <div className={styles.dropdown}>
                          <button
                            className={styles.dropdownItem}
                            onClick={() => {
                              onView(preparacion)
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
                              onEdit(preparacion)
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
                              onDelete(preparacion)
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
                          <button
                            className={styles.dropdownItem}
                            onClick={() => {
                              onGenerateReport(preparacion)
                              setOpenMenuId(null)
                            }}
                          >
                            <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                              <path d="M14 2v6h6" />
                              <path d="M16 13H8" />
                              <path d="M16 17H8" />
                              <path d="M10 9H8" />
                            </svg>
                            Generar Reporte
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
    </div>
  )
}
