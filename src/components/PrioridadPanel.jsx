import { useState, useRef } from 'react'
import styles from './PrioridadPanel.module.css'

export default function PrioridadPanel({ mode, prioridad, onSave, onCancel }) {
  const [form, setForm] = useState({
    id:          prioridad?.id          ?? null,
    codigo:      prioridad?.codigo      ?? '',
    descripcion: prioridad?.descripcion ?? '',
    color:       prioridad?.color       ?? '#D32F2F',
  })
  const [hexInput, setHexInput] = useState(prioridad?.color ?? '#D32F2F')
  const colorRef = useRef(null)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleColorChange = (e) => {
    const val = e.target.value
    setForm(f => ({ ...f, color: val }))
    setHexInput(val)
  }

  const handleHexInput = (e) => {
    const val = e.target.value
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setForm(f => ({ ...f, color: val }))
    }
  }

  const handleHexBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
      setHexInput(form.color)
    }
  }

  const handleSave = () => {
    if (!form.descripcion.trim()) return
    onSave({ ...form, codigo: Number(form.codigo) || form.codigo })
  }

  return (
    <div className={styles.panel} role="dialog" aria-modal="true">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <h2 className={styles.title}>{mode === 'create' ? 'Nueva Prioridad' : 'Editar Prioridad'}</h2>
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
          <label className={styles.label} htmlFor="pri-color">Color</label>
          <div
            className={styles.colorField}
            onClick={() => colorRef.current?.click()}
            title="Hacer clic para abrir el selector de color"
          >
            <input
              ref={colorRef}
              id="pri-color"
              type="color"
              className={styles.colorNative}
              value={form.color}
              onChange={handleColorChange}
              aria-label="Selector de color"
            />
            <input
              type="text"
              className={styles.colorHexInput}
              value={hexInput}
              onChange={handleHexInput}
              onBlur={handleHexBlur}
              onClick={e => e.stopPropagation()}
              maxLength={7}
              placeholder="#000000"
              aria-label="Código hexadecimal del color"
            />
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
