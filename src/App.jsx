import { useState } from 'react'
import OperariosList from './components/OperariosList'
import OperarioPanel from './components/OperarioPanel'
import styles from './App.module.css'

const INITIAL_OPERARIOS = [
  { id: 1, code: '001', name: 'Juan Pérez', usuarioZeus: 'U001 - jperez', inicioActividades: '2020-03-02', fechaNacimiento: '1990-05-20', preparador: true, controlador: false, area: '01 - Depósito Central' },
  { id: 2, code: '002', name: 'María Gómez', usuarioZeus: 'U002 - mgomez', inicioActividades: '2019-11-15', fechaNacimiento: '1988-02-11', preparador: false, controlador: true, area: '' },
  { id: 3, code: '003', name: 'Carlos Fernández', usuarioZeus: 'U003 - cfernandez', inicioActividades: '2021-06-01', fechaNacimiento: '1995-09-30', preparador: true, controlador: true, area: '02 - Depósito Norte' },
  { id: 4, code: '004', name: 'Lucía Romero', usuarioZeus: 'U004 - lromero', inicioActividades: '2022-01-10', fechaNacimiento: '1992-12-05', preparador: false, controlador: true, area: '' },
  { id: 5, code: '005', name: 'Diego Sosa', usuarioZeus: 'U005 - dsosa', inicioActividades: '2018-08-22', fechaNacimiento: '1985-07-18', preparador: true, controlador: false, area: '03 - Depósito Sur' },
  { id: 6, code: '006', name: 'Ana Torres', usuarioZeus: 'U006 - atorres', inicioActividades: '2023-02-14', fechaNacimiento: '1998-04-23', preparador: true, controlador: true, area: '04 - Recepción' },
]

export default function App() {
  const [operarios, setOperarios] = useState(INITIAL_OPERARIOS)
  const [selectedOperario, setSelectedOperario] = useState(null)
  const [panelMode, setPanelMode] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOperarios = operarios.filter(o =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(o.code).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewOperario = (operario) => {
    setSelectedOperario(operario)
    setPanelMode('view')
  }

  const handleEditOperario = (operario) => {
    setSelectedOperario({ ...operario })
    setPanelMode('edit')
  }

  const handleCreateOperario = () => {
    setSelectedOperario({
      code: '',
      usuarioZeus: '',
      name: '',
      inicioActividades: '',
      fechaNacimiento: '',
      preparador: false,
      controlador: false,
      area: ''
    })
    setPanelMode('create')
  }

  const handleSave = (updatedOperario) => {
    if (panelMode === 'edit') {
      setOperarios(operarios.map(o => o.id === updatedOperario.id ? updatedOperario : o))
    } else if (panelMode === 'create') {
      const nextId = operarios.length > 0 ? Math.max(...operarios.map(o => o.id)) + 1 : 1
      setOperarios([...operarios, { ...updatedOperario, id: nextId }])
    }
    closePanelAndResetSearch()
  }

  const handleCancel = () => {
    closePanelAndResetSearch()
  }

  const closePanelAndResetSearch = () => {
    setSelectedOperario(null)
    setPanelMode(null)
    setSearchTerm('')
  }

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <OperariosList
          operarios={filteredOperarios}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onView={handleViewOperario}
          onEdit={handleEditOperario}
          onCreate={handleCreateOperario}
        />
      </div>

      {panelMode && (
        <OperarioPanel
          mode={panelMode}
          operario={selectedOperario}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
