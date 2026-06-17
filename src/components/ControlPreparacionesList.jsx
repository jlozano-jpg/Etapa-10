import { Fragment, useState } from 'react'
import styles from './ControlPreparacionesList.module.css'

const COLUMNS = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'comprobante', label: 'Comprobante' },
  { key: 'sucursal', label: 'Sucursal' },
  { key: 'deposito', label: 'Depósito' },
  { key: 'codigo', label: 'Código' },
  { key: 'razonSocial', label: 'Razón Social' },
  { key: 'preparador', label: 'Preparador' },
  { key: 'controlador', label: 'Controlador' },
  { key: 'prioridad', label: 'Prioridad' },
  { key: 'estado', label: 'Estado' }
]

const ESTADO_CLASS = {
  'Control en Proceso': 'estadoProceso',
  'Control Finalizado': 'estadoFinalizado',
  'Control Pendiente': 'estadoPendiente'
}

const resolvePrioridad = (valor, prioridades) => {
  if (valor == null || valor === '') return null
  const byCode = prioridades.find(p => String(p.codigo) === String(valor))
  if (byCode) return byCode
  const v = String(valor).toUpperCase()
  return prioridades.find(p => p.descripcion.toUpperCase().includes(v)) ?? null
}

export default function ControlPreparacionesList({ preparaciones, searchTerm, onSearchChange, onIniciarControl, onModificar, onLiberar, prioridades = [] }) {
  const [expandedId, setExpandedId] = useState(null)
  const [selectedKey, setSelectedKey] = useState(null)
  const [openMenuKey, setOpenMenuKey] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(current => current === id ? null : id)
  }

  const toggleSelect = (key) => {
    setSelectedKey(current => current === key ? null : key)
  }

  const renderPrioridad = (valor) => {
    const p = resolvePrioridad(valor, prioridades)
    if (!p) return null
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '3px 20px', borderRadius: '20px',
        border: `2px solid ${p.color}`, color: p.color,
        fontSize: '12px', fontWeight: '700', background: 'transparent', lineHeight: '1.4',
      }}>
        {p.codigo}
      </span>
    )
  }

  const renderEstado = (estado) => {
    const className = ESTADO_CLASS[estado]
    return <span className={className ? styles[className] : ''}>{estado}</span>
  }

  const getSelectedSeleccion = () => {
    if (!selectedKey) return null
    const [prepId, itemIndex] = selectedKey.split('-')
    const preparacion = preparaciones.find(p => String(p.id) === prepId)
    const item = preparacion?.detalle?.[Number(itemIndex)]
    return item ? { preparacion, item } : null
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.searchField}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar comprobante o razón social"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
            aria-label="Buscar control de preparación"
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

          <button
            type="button"
            className={styles.startBtn}
            disabled={selectedKey === null}
            onClick={() => onIniciarControl?.(getSelectedSeleccion())}
          >
            <svg className={styles.startIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Iniciar control
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
                  No hay preparaciones para controlar
                </td>
              </tr>
            ) : (
              preparaciones.map(preparacion => {
                const isExpanded = expandedId === preparacion.id
                const hasDetalle = preparacion.detalle && preparacion.detalle.length > 0

                return (
                  <Fragment key={preparacion.id}>
                    <tr className={styles.headerRow}>
                      <td className={styles.fechaCell}>
                        {hasDetalle && (
                          <button
                            type="button"
                            className={styles.expandBtn}
                            onClick={() => toggleExpand(preparacion.id)}
                            aria-label={isExpanded ? 'Ocultar detalle' : 'Ver detalle'}
                            aria-expanded={isExpanded}
                          >
                            <svg
                              className={isExpanded ? styles.expandIconOpen : styles.expandIcon}
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                        )}
                        {preparacion.fecha}
                      </td>
                      <td>{preparacion.comprobante}</td>
                      <td>{preparacion.sucursal}</td>
                      <td>{preparacion.deposito}</td>
                      <td>{preparacion.codigo}</td>
                      <td>{preparacion.razonSocial}</td>
                      <td>{preparacion.preparador}</td>
                      <td>{preparacion.controlador}</td>
                      <td>{renderPrioridad(preparacion.prioridad)}</td>
                      <td>{renderEstado(preparacion.estado)}</td>
                      <td className={styles.menuCell} />
                    </tr>
                    {isExpanded && hasDetalle && preparacion.detalle.map((item, index) => {
                      const key = `${preparacion.id}-${index}`
                      const isSelected = selectedKey === key
                      return (
                        <tr
                          key={index}
                          className={`${styles.detailRow} ${isSelected ? styles.detailRowSelected : ''}`}
                          onClick={() => toggleSelect(key)}
                        >
                          <td />
                          <td />
                          <td />
                          <td />
                          <td>{item.codigo}</td>
                          <td>{item.razonSocial}</td>
                          <td />
                          <td>{item.controlador}</td>
                          <td>{renderPrioridad(item.prioridad)}</td>
                          <td>{renderEstado(item.estado)}</td>
                          <td className={styles.menuCell} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.menuContainer}>
                              <button
                                className={styles.menuBtn}
                                onClick={() => setOpenMenuKey(openMenuKey === key ? null : key)}
                                title="Opciones"
                                aria-label={`Menú de opciones para ${item.codigo}`}
                              >
                                ⋮
                              </button>
                              {openMenuKey === key && (
                                <div className={styles.dropdown}>
                                  <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                      onModificar?.({ preparacion, item })
                                      setOpenMenuKey(null)
                                    }}
                                  >
                                    <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M12 20h9" />
                                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                    </svg>
                                    Modificar
                                  </button>
                                  <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                      onLiberar?.({ preparacion, item })
                                      setOpenMenuKey(null)
                                    }}
                                  >
                                    <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <rect x="3" y="11" width="18" height="11" rx="2" />
                                      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                                    </svg>
                                    Liberar Preparaciones
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
