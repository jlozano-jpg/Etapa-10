import { useState } from 'react'
import styles from './PrioridadPanel.module.css'

const PRESET_COLORS = [
  '#D32F2F', '#E65100', '#F9A825', '#FDD835',
  '#4CAF50', '#00897B', '#00CDCD', '#1565C0',
  '#6A00A7', '#8833B8', '#667F99', '#002955',
]

export default function PrioridadPanel({ mode, prioridad, onSave, onCancel }) {
  const [form, setForm] = useState({
    id:          prioridad?.id          ?? null,
    codigo:      prioridad?.codigo      ?? '',
    descripcion: prioridad?.descripcion ?? '',
    color:       prioridad?.color       ?? '#D32F2F',
  })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = () => {
    if (!form.descripcion.trim()) return
    onSave({ ...form, codigo: Number(form.codigo) || form.codigo })
  }

  const isCreate = mode === 'create'

  return (
    <div className={styles.panel} role="dialog" aria-modal="true">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <h2 className={styles.title}>{isCreate ? 'Nueva Prioridad' : 'Editar Prioridad'}</h2>
        <button className={styles.closeBtn} onClick={onCancel} aria-label="Cerrar panel">✕</button>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className={styles.body}>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="pri-codigo">Código</label>
          <input
            id="pri-codigo"
            type="number"
            className={styles.input}
            value={form.codigo}
            onChange={set('codigo')}
            placeholder="1"
            min="1"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="pri-desc">Descripción</label>
          <input
            id="pri-desc"
            type="text"
            className={styles.input}
            value={form.descripcion}
            onChange={set('descripcion')}
            placeholder="Ej: PRIORIDAD ALTA"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Color</label>

          <div className={styles.swatches}>
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`${styles.swatch} ${form.color === c ? styles.swatchActive : ''}`}
                style={{ background: c }}
                onClick={() => setForm(f => ({ ...f, color: c }))}
                aria-label={`Color ${c}`}
                title={c}
              />
            ))}
          </div>

          <div className={styles.colorRow}>
            <input
              type="color"
              className={styles.colorPicker}
              value={form.color}
              onChange={set('color')}
              aria-label="Elegir color personalizado"
              title="Color personalizado"
            />
            <span className={styles.colorPreview} style={{ background: form.color }} />
            <span className={styles.colorHex}>{form.color.toUpperCase()}</span>
          </div>
        </div>

      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div className={styles.footer}>
        <button className={styles.cancelBtn} onClick={onCancel} type="button">Cancelar</button>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          type="button"
          disabled={!form.descripcion.trim()}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
