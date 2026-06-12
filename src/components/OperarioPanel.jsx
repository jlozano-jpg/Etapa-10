import { useState, useEffect, useRef } from 'react'
import styles from './OperarioPanel.module.css'

const AVAILABLE_USUARIOS = [
  'U001 - jperez',
  'U002 - mgomez',
  'U003 - cfernandez',
  'U004 - lromero',
  'U005 - dsosa',
  'U006 - atorres',
  'U007 - mlopez',
  'U008 - rgarcia'
]

const AVAILABLE_AREAS = [
  '01 - Depósito Central',
  '02 - Depósito Norte',
  '03 - Depósito Sur',
  '04 - Recepción',
  '05 - Expedición'
]

export default function OperarioPanel({ mode, operario, onSave, onCancel }) {
  const [formData, setFormData] = useState(() => ({ ...operario }))
  const [hasChanges, setHasChanges] = useState(false)
  const firstInputRef = useRef(null)

  useEffect(() => {
    setFormData({ ...operario })
    setHasChanges(false)
  }, [operario])

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [mode])

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      setHasChanges(true)
      return updated
    })
  }

  const handleCheckChange = (field) => {
    handleChange(field, !formData[field])
  }

  const handleSave = () => {
    if (!String(formData.code ?? '').trim()) {
      alert('El código es requerido')
      return
    }
    if (!formData.usuarioZeus) {
      alert('El usuario ZEUS ERP & POS es requerido')
      return
    }
    if (!formData.preparador && !formData.controlador) {
      alert('Debe seleccionar al menos un rol: Preparador o Controlador')
      return
    }
    onSave(formData)
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('Hay cambios sin guardar. ¿Descartar cambios?')) {
        onCancel()
      }
    } else {
      onCancel()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.ctrlKey && e.key === 'Enter') {
      handleSave()
    }
  }

  const titles = {
    view: 'Ver Operario',
    edit: 'Editar Operario',
    create: 'Nuevo Operario'
  }

  return (
    <>
      <div className={styles.overlay} onClick={handleCancel} aria-hidden="true" />
      <div className={styles.panel} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>{titles[mode]}</h2>
          <button
            className={styles.closeBtn}
            onClick={handleCancel}
            aria-label="Cerrar panel"
            title="Cerrar (Esc)"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Código *</label>
            <input
              ref={mode === 'create' ? firstInputRef : undefined}
              type="text"
              value={formData.code ?? ''}
              onChange={(e) => handleChange('code', e.target.value)}
              disabled={mode === 'view' || mode === 'edit'}
              onKeyDown={handleKeyDown}
              className={styles.input}
              aria-label="Código"
            />
            {mode !== 'create' && <p className={styles.helperText}>No editable</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Usuario ZEUS ERP &amp; POS *</label>
            <select
              ref={mode !== 'create' ? firstInputRef : undefined}
              value={formData.usuarioZeus ?? ''}
              onChange={(e) => handleChange('usuarioZeus', e.target.value)}
              disabled={mode === 'view'}
              onKeyDown={handleKeyDown}
              className={styles.select}
              aria-label="Usuario ZEUS ERP y POS"
            >
              <option value="">Seleccionar usuario...</option>
              {AVAILABLE_USUARIOS.map(usuario => (
                <option key={usuario} value={usuario}>{usuario}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre</label>
            <input
              type="text"
              value={formData.name ?? ''}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={mode === 'view'}
              onKeyDown={handleKeyDown}
              className={styles.input}
              aria-label="Nombre"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Inicio de Actividades</label>
            <input
              type="date"
              value={formData.inicioActividades ?? ''}
              onChange={(e) => handleChange('inicioActividades', e.target.value)}
              disabled={mode === 'view'}
              onKeyDown={handleKeyDown}
              className={styles.input}
              aria-label="Inicio de actividades"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Fecha de Nacimiento</label>
            <input
              type="date"
              value={formData.fechaNacimiento ?? ''}
              onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
              disabled={mode === 'view'}
              onKeyDown={handleKeyDown}
              className={styles.input}
              aria-label="Fecha de nacimiento"
            />
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Roles *</h3>

            <label className={styles.toggleGroup}>
              <input
                type="checkbox"
                checked={formData.preparador ?? false}
                onChange={() => handleCheckChange('preparador')}
                disabled={mode === 'view'}
                className={styles.toggleInput}
                aria-label="Preparador"
              />
              <span className={styles.toggleSwitch} aria-hidden="true" />
              <span className={styles.toggleLabel}>Preparador</span>
            </label>

            <label className={styles.toggleGroup}>
              <input
                type="checkbox"
                checked={formData.controlador ?? false}
                onChange={() => handleCheckChange('controlador')}
                disabled={mode === 'view'}
                className={styles.toggleInput}
                aria-label="Controlador"
              />
              <span className={styles.toggleSwitch} aria-hidden="true" />
              <span className={styles.toggleLabel}>Controlador</span>
            </label>

            <div className={styles.formGroup}>
              <label className={styles.label}>Área</label>
              <select
                value={formData.area ?? ''}
                onChange={(e) => handleChange('area', e.target.value)}
                disabled={mode === 'view' || !formData.preparador}
                onKeyDown={handleKeyDown}
                className={styles.select}
                aria-label="Área"
              >
                <option value="">Seleccionar área...</option>
                {AVAILABLE_AREAS.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
              <p className={styles.helperText}>Disponible al activar el rol Preparador</p>
            </div>
          </div>
        </div>

        {(mode === 'edit' || mode === 'create') && (
          <div className={styles.footer}>
            <button
              className={`${styles.btn} ${styles.cancelBtn}`}
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              className={`${styles.btn} ${styles.saveBtn}`}
              onClick={handleSave}
            >
              {mode === 'create' ? 'Guardar' : 'Actualizar'}
            </button>
          </div>
        )}

        {mode === 'view' && (
          <div className={styles.footer}>
            <button
              className={`${styles.btn} ${styles.closeViewBtn}`}
              onClick={handleCancel}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </>
  )
}
