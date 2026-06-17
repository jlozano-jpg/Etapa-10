import { useState, useRef } from 'react'
import styles from './DespachoList.module.css'

const INICIAL = [
  { id: 1, fecha: '02/06/2026', numeroPreparacion: 38, remito: '0001-30', codigo: '0002', razonSocial: 'CHRCER S.A.',       prioridad: 'Alta', transporte: '', zona: '', localidad: 'BAHIA BLANCA', orden: 1 },
  { id: 2, fecha: '02/06/2026', numeroPreparacion: 40, remito: '0001-31', codigo: '0004', razonSocial: 'MARIANO LOPEZ',      prioridad: 'Alta', transporte: '', zona: '', localidad: 'MAR DEL PLATA', orden: 2 },
  { id: 3, fecha: '02/06/2026', numeroPreparacion: 41, remito: '0001-32', codigo: '0001', razonSocial: 'CONSUMIDOR FINAL',   prioridad: 'Alta', transporte: '', zona: '', localidad: 'MAR DEL PLATA', orden: 3 },
  { id: 4, fecha: '03/06/2026', numeroPreparacion: 42, remito: '0001-33', codigo: '0004', razonSocial: 'MARIANO LOPEZ',      prioridad: 'Alta', transporte: '', zona: '', localidad: 'MAR DEL PLATA', orden: 4 },
]

const resolvePrioridad = (valor, prioridades) => {
  if (valor == null || valor === '') return null
  const byCode = prioridades.find(p => String(p.codigo) === String(valor))
  if (byCode) return byCode
  const v = String(valor).toUpperCase()
  return prioridades.find(p => p.descripcion.toUpperCase().includes(v)) ?? null
}

export default function DespachoList({ onRotulos, onImprimirHojaRuta, prioridades = [] }) {
  const [items, setItems] = useState(INICIAL)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [bultos, setBultos] = useState(
    () => INICIAL.reduce((acc, item) => { acc[item.id] = ''; return acc }, {})
  )
  const [dragOverId, setDragOverId] = useState(null)
  const dragId = useRef(null)

  const filtered = items.filter(item =>
    item.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.numeroPreparacion).includes(searchTerm) ||
    item.remito.includes(searchTerm) ||
    item.codigo.includes(searchTerm)
  )

  const allSelected = filtered.length > 0 && filtered.every(i => selectedIds.has(i.id))

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () =>
    setSelectedIds(allSelected ? new Set() : new Set(filtered.map(i => i.id)))

  const handleDragStart = (id) => { dragId.current = id }

  const handleDragOver = (e, id) => {
    e.preventDefault()
    setDragOverId(id)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const from = dragId.current
    const to = dragOverId
    if (!from || from === to) { dragId.current = null; setDragOverId(null); return }
    const next = [...items]
    const fi = next.findIndex(i => i.id === from)
    const ti = next.findIndex(i => i.id === to)
    const [moved] = next.splice(fi, 1)
    next.splice(ti, 0, moved)
    setItems(next.map((item, idx) => ({ ...item, orden: idx + 1 })))
    dragId.current = null
    setDragOverId(null)
  }

  const handleDragEnd = () => { dragId.current = null; setDragOverId(null) }

  return (
    <div className={styles.wrapper}>

      {/* ── Toolbar ────────────────────────────────────────────── */}
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
            aria-label="Buscar despacho"
          />
        </div>
        <div className={styles.toolbarRight}>
          <button className={styles.filterBtn} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/>
              <line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/>
              <line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/>
              <line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/>
              <line x1="16" x2="16" y1="18" y2="22"/>
            </svg>
            Filtros
          </button>
          <button className={styles.refreshBtn} type="button" aria-label="Actualizar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
          </button>
          <div className={styles.toolbarSep} />
          <button className={styles.rotulosBtn} type="button" onClick={onRotulos}>Rótulos</button>
          <button className={styles.imprimirBtn} type="button" onClick={onImprimirHojaRuta}>Imprimir hoja de ruta</button>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkCol}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Seleccionar todos" />
              </th>
              <th className={styles.handleCol}></th>
              <th>Fecha</th>
              <th>Número de preparación</th>
              <th>Remito</th>
              <th>Código</th>
              <th>Razón Social</th>
              <th>Prioridad</th>
              <th>Transporte</th>
              <th>Zona</th>
              <th>Localidad</th>
              <th className={styles.bultoCol}>Bulto</th>
              <th className={styles.ordenCol}>Orden</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={13} className={styles.empty}>No se encontraron registros</td>
              </tr>
            ) : filtered.map(item => (
              <tr
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={e => handleDragOver(e, item.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={[
                  selectedIds.has(item.id) ? styles.rowSelected : '',
                  dragOverId === item.id ? styles.rowDragOver : ''
                ].join(' ')}
              >
                <td className={styles.checkCol}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    aria-label={`Seleccionar ${item.razonSocial}`}
                  />
                </td>
                <td className={styles.handleCol}>
                  <span className={styles.dragHandle} title="Arrastrar para reordenar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="3" y1="8" x2="21" y2="8"/>
                      <line x1="3" y1="12" x2="21" y2="12"/>
                      <line x1="3" y1="16" x2="21" y2="16"/>
                    </svg>
                  </span>
                </td>
                <td>{item.fecha}</td>
                <td>{item.numeroPreparacion}</td>
                <td>{item.remito}</td>
                <td className={styles.codeCell}>{item.codigo}</td>
                <td>{item.razonSocial}</td>
                <td>
                  {(() => {
                    const p = resolvePrioridad(item.prioridad, prioridades)
                    if (!p) return item.prioridad ?? null
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
                  })()}
                </td>
                <td>{item.transporte}</td>
                <td>{item.zona}</td>
                <td>{item.localidad}</td>
                <td className={styles.bultoCol}>
                  <input
                    type="number"
                    className={styles.bultoInput}
                    value={bultos[item.id] ?? ''}
                    onChange={e => setBultos(p => ({ ...p, [item.id]: e.target.value }))}
                    min="0"
                    placeholder="0"
                    aria-label={`Bulto ${item.remito}`}
                  />
                </td>
                <td className={styles.ordenCol}>{item.orden}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
