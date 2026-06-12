import { useState } from 'react'
import styles from './PreparacionAreasPanel.module.css'

const AREA_DEPOSITO_MAP = {
  'Área 1': '01 - Depósito Central',
  'Área 2': '02 - Depósito Norte',
  'Área 3': '03 - Depósito Sur',
  'Área 4': '04 - Recepción'
}

export default function PreparacionAreasPanel({ pedido, operarios, numeroPreparacion, onBack, onCancel, onConfirm, rightOffset = 0 }) {
  const preparadores = operarios.filter(o => o.preparador)

  const areas = [...new Set(pedido.detalle.map(item => item.area))]

  const formatPreparador = (p) => `${p.code} - ${p.name}`

  const getDefaultPreparador = (area) => {
    const deposito = AREA_DEPOSITO_MAP[area]
    const match = preparadores.find(p => p.area === deposito)
    const elegido = match ?? preparadores[0]
    return elegido ? formatPreparador(elegido) : ''
  }

  const [asignaciones, setAsignaciones] = useState(() =>
    areas.reduce((acc, area) => {
      acc[area] = getDefaultPreparador(area)
      return acc
    }, {})
  )

  const handleChangePreparador = (area, value) => {
    setAsignaciones(prev => ({ ...prev, [area]: value }))
  }

  const handleConfirm = () => {
    onConfirm(asignaciones)
  }

  return (
    <>
      <div className={styles.panel} style={{ right: rightOffset }} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={onBack} aria-label="Volver" title="Volver">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h2 className={styles.title}>Asignación de preparadores</h2>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.pedidoBadge}>{numeroPreparacion}</span>
            <button className={styles.closeBtn} onClick={onCancel} aria-label="Cerrar panel" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.intro}>
            Se identificaron las siguientes áreas para la preparación del pedido. Asigná un preparador para cada una.
          </p>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Áreas solicitadas</th>
                  <th>Preparador</th>
                </tr>
              </thead>
              <tbody>
                {areas.map(area => (
                  <tr key={area}>
                    <td>{area}</td>
                    <td>
                      <select
                        className={styles.preparadorSelect}
                        value={asignaciones[area] ?? ''}
                        onChange={(e) => handleChangePreparador(area, e.target.value)}
                        aria-label={`Preparador para ${area}`}
                      >
                        {preparadores.map(p => <option key={p.id} value={formatPreparador(p)}>{formatPreparador(p)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>Continuar</button>
        </div>
      </div>
    </>
  )
}
