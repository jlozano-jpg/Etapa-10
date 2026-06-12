import { useEffect, useState } from 'react'
import styles from './PreparacionVistaPanel.module.css'

const PRIORIDADES = ['Alta', 'Media', 'Baja']

export default function PreparacionVistaPanel({ preparacion, mode = 'view', operarios = [], onClose, onSave }) {
  const isEdit = mode === 'edit'
  const preparadores = operarios.filter(o => o.preparador)
  const formatPreparador = (p) => `${p.code} - ${p.name}`

  const [prioridad, setPrioridad] = useState(preparacion.prioridad ?? '')
  const [areasSolicitadas, setAreasSolicitadas] = useState(preparacion.areasSolicitadas ?? [])

  useEffect(() => {
    setPrioridad(preparacion.prioridad ?? '')
    setAreasSolicitadas(preparacion.areasSolicitadas ?? [])
  }, [preparacion])

  const comprobantes = preparacion.comprobantesIncluidos ?? (preparacion.comprobante ? [preparacion.comprobante] : [])
  const clientes = preparacion.clientes ?? []

  const handleChangeAreaPreparador = (area, value) => {
    setAreasSolicitadas(prev => prev.map(item => item.area === area ? { ...item, preparador: value } : item))
  }

  const handleSave = () => {
    const preparadorResumen = areasSolicitadas
      .map(item => `${item.area}: ${item.preparador}`)
      .join(' | ')

    onSave({
      ...preparacion,
      prioridad,
      areasSolicitadas,
      preparador: areasSolicitadas.length > 0 ? preparadorResumen : preparacion.preparador
    })
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.panel} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Editar preparación' : 'Detalle de preparación'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar panel" title="Cerrar (Esc)">✕</button>
        </div>

        <div className={styles.content}>
          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Número de preparación</span>
              <span className={styles.fieldValue}>{preparacion.numeroPreparacion ?? preparacion.codigo ?? '-'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Fecha</span>
              <span className={styles.fieldValue}>{preparacion.fecha || '-'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Metodología de pickeo</span>
              <span className={styles.fieldValue}>{preparacion.metodologiaPickeo ?? '-'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Modo de ejecución</span>
              <span className={styles.fieldValue}>{preparacion.modoEjecucion ?? '-'}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Prioridad</span>
              {isEdit ? (
                <select
                  className={styles.fieldSelect}
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value)}
                  aria-label="Prioridad"
                >
                  <option value="">Selecciona prioridad</option>
                  {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              ) : (
                <span className={styles.fieldValue}>{preparacion.prioridad || '-'}</span>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Áreas solicitadas</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Área</th>
                    <th>Preparador</th>
                    <th>Avance</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {areasSolicitadas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={styles.empty}>Sin áreas asignadas</td>
                    </tr>
                  ) : (
                    areasSolicitadas.map(item => (
                      <tr key={item.area}>
                        <td>{item.area}</td>
                        <td>
                          {isEdit ? (
                            <select
                              className={styles.fieldSelect}
                              value={item.preparador}
                              onChange={(e) => handleChangeAreaPreparador(item.area, e.target.value)}
                              aria-label={`Preparador para ${item.area}`}
                            >
                              {preparadores.map(p => (
                                <option key={p.id} value={formatPreparador(p)}>{formatPreparador(p)}</option>
                              ))}
                            </select>
                          ) : (
                            item.preparador
                          )}
                        </td>
                        <td>{item.avance ?? 0}%</td>
                        <td>{item.estado}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Detalle de artículos incluidos</h3>
            {clientes.length === 0 ? (
              <p className={styles.empty}>Sin artículos para mostrar</p>
            ) : (
              clientes.map((cliente, index) => (
                <div key={index} className={styles.clienteBlock}>
                  <div className={styles.clienteHeader}>
                    <span className={styles.clienteNombre}>Cliente: {cliente.razonSocial}</span>
                    <span className={styles.clienteComprobantes}>
                      Comprobantes incluidos: {(cliente.comprobantes ?? comprobantes).join(', ') || '-'}
                    </span>
                  </div>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cliente.items.map((item, itemIndex) => (
                          <tr key={itemIndex}>
                            <td>{item.codigo}</td>
                            <td>{item.descripcion}</td>
                            <td>{item.cantidad}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.footer}>
          {isEdit ? (
            <>
              <button className={styles.closeFooterBtn} onClick={onClose}>Cancelar</button>
              <button className={styles.saveFooterBtn} onClick={handleSave}>Guardar</button>
            </>
          ) : (
            <button className={styles.closeFooterBtn} onClick={onClose}>Cerrar</button>
          )}
        </div>
      </div>
    </>
  )
}
