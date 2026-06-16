import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Tabs from './components/Tabs'
import OperariosList from './components/OperariosList'
import OperarioPanel from './components/OperarioPanel'
import PreparacionesList from './components/PreparacionesList'
import PreparacionOrigenPanel from './components/PreparacionOrigenPanel'
import PreparacionDocumentoPanel from './components/PreparacionDocumentoPanel'
import PreparacionAreasPanel from './components/PreparacionAreasPanel'
import PreparacionVistaPanel from './components/PreparacionVistaPanel'
import PreparacionArticulosSinAreaPanel from './components/PreparacionArticulosSinAreaPanel'
import ControlPreparacionesList from './components/ControlPreparacionesList'
import { ORIGENES_CONFIG } from './data/preparacionDocumentos'
import { CONTROL_PREPARACIONES } from './data/controlPreparaciones'
import styles from './App.module.css'

const PEDIDO_VENTA_PANEL_WIDTH = 720
const AREAS_PANEL_WIDTH = 460
const ARTICULOS_SIN_AREA_PANEL_WIDTH = 520

const INITIAL_OPERARIOS = [
  { id: 1, code: '001', name: 'Juan Pérez', usuarioZeus: 'U001 - jperez', inicioActividades: '2020-03-02', fechaNacimiento: '1990-05-20', preparador: true, controlador: false, area: '01 - Depósito Central' },
  { id: 2, code: '002', name: 'María Gómez', usuarioZeus: 'U002 - mgomez', inicioActividades: '2019-11-15', fechaNacimiento: '1988-02-11', preparador: false, controlador: true, area: '' },
  { id: 3, code: '003', name: 'Carlos Fernández', usuarioZeus: 'U003 - cfernandez', inicioActividades: '2021-06-01', fechaNacimiento: '1995-09-30', preparador: true, controlador: true, area: '02 - Depósito Norte' },
  { id: 4, code: '004', name: 'Lucía Romero', usuarioZeus: 'U004 - lromero', inicioActividades: '2022-01-10', fechaNacimiento: '1992-12-05', preparador: false, controlador: true, area: '' },
  { id: 5, code: '005', name: 'Diego Sosa', usuarioZeus: 'U005 - dsosa', inicioActividades: '2018-08-22', fechaNacimiento: '1985-07-18', preparador: true, controlador: false, area: '03 - Depósito Sur' },
  { id: 6, code: '006', name: 'Ana Torres', usuarioZeus: 'U006 - atorres', inicioActividades: '2023-02-14', fechaNacimiento: '1998-04-23', preparador: true, controlador: true, area: '04 - Recepción' },
]

const INITIAL_PREPARACIONES = []

const INICIO_TAB = { id: 'inicio', label: 'Inicio', closable: false }

export default function App() {
  const [operarios, setOperarios] = useState(INITIAL_OPERARIOS)
  const [selectedOperario, setSelectedOperario] = useState(null)
  const [panelMode, setPanelMode] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeView, setActiveView] = useState('operarios-stock')

  const [preparaciones, setPreparaciones] = useState(INITIAL_PREPARACIONES)
  const [preparacionSearchTerm, setPreparacionSearchTerm] = useState('')
  const [showPreparacionOrigenModal, setShowPreparacionOrigenModal] = useState(false)
  const [showDocumentoPanel, setShowDocumentoPanel] = useState(false)
  const [showArticulosSinAreaPanel, setShowArticulosSinAreaPanel] = useState(false)
  const [articulosSinArea, setArticulosSinArea] = useState([])
  const [showAreasPanel, setShowAreasPanel] = useState(false)
  const [selectedOrigenId, setSelectedOrigenId] = useState(null)
  const [pedidoVentaSeleccion, setPedidoVentaSeleccion] = useState(null)
  const [preparacionVista, setPreparacionVista] = useState(null)
  const [preparacionVistaMode, setPreparacionVistaMode] = useState('view')

  const [controlPreparaciones] = useState(CONTROL_PREPARACIONES)
  const [controlPreparacionesSearchTerm, setControlPreparacionesSearchTerm] = useState('')

  const [tabs, setTabs] = useState([INICIO_TAB])
  const [activeTab, setActiveTab] = useState('inicio')

  const filteredOperarios = operarios.filter(o =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(o.code).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const nextPreparacionId = preparaciones.length > 0 ? Math.max(...preparaciones.map(p => p.id)) + 1 : 1
  const nextNumeroPreparacion = String(nextPreparacionId).padStart(4, '0')

  const filteredPreparaciones = preparaciones.filter(p =>
    String(p.codigo ?? '').toLowerCase().includes(preparacionSearchTerm.toLowerCase()) ||
    String(p.razonSocial ?? '').toLowerCase().includes(preparacionSearchTerm.toLowerCase()) ||
    String(p.comprobante ?? '').toLowerCase().includes(preparacionSearchTerm.toLowerCase())
  )

  const filteredControlPreparaciones = controlPreparaciones.filter(p => {
    const term = controlPreparacionesSearchTerm.toLowerCase()
    const matchesPrincipal =
      String(p.comprobante ?? '').toLowerCase().includes(term) ||
      String(p.razonSocial ?? '').toLowerCase().includes(term) ||
      String(p.preparador ?? '').toLowerCase().includes(term)
    const matchesDetalle = (p.detalle ?? []).some(item =>
      String(item.codigo ?? '').toLowerCase().includes(term) ||
      String(item.razonSocial ?? '').toLowerCase().includes(term)
    )
    return matchesPrincipal || matchesDetalle
  })

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

  const handleDeleteOperario = (operario) => {
    if (confirm(`¿Eliminar al operario ${operario.name || operario.code}?`)) {
      setOperarios(operarios.filter(o => o.id !== operario.id))
    }
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

  const handleViewDetallePreparacion = (preparacion) => {
    setPreparacionVista(preparacion)
    setPreparacionVistaMode('view')
  }

  const handleEditDetallePreparacion = (preparacion) => {
    setPreparacionVista(preparacion)
    setPreparacionVistaMode('edit')
  }

  const handleCloseDetallePreparacion = () => {
    setPreparacionVista(null)
  }

  const handleSaveDetallePreparacion = (updatedPreparacion) => {
    setPreparaciones(preparaciones.map(p => p.id === updatedPreparacion.id ? updatedPreparacion : p))
    setPreparacionVista(null)
  }

  const handleCreatePreparacion = () => {
    setShowPreparacionOrigenModal(true)
  }

  const handleSelectPreparacionOrigen = (origen) => {
    if (!ORIGENES_CONFIG[origen.id]) return

    setSelectedOrigenId(origen.id)
    setShowDocumentoPanel(true)
  }

  const handleCancelPreparacionOrigen = () => {
    setShowPreparacionOrigenModal(false)
    setShowDocumentoPanel(false)
    setShowArticulosSinAreaPanel(false)
    setArticulosSinArea([])
    setShowAreasPanel(false)
    setSelectedOrigenId(null)
    setPedidoVentaSeleccion(null)
  }

  const handleBackFromDocumento = () => {
    setShowDocumentoPanel(false)
  }

  const buildNuevaPreparacion = ({ pedido, prioridad, deposito, metodologiaPickeo, modoEjecucion, origenLabel }, preparador, areasSolicitadas) => {
    const nextId = preparaciones.length > 0 ? Math.max(...preparaciones.map(p => p.id)) + 1 : 1

    return {
      id: nextId,
      numeroPreparacion: String(nextId).padStart(4, '0'),
      fecha: pedido.fecha.replaceAll('/', '-'),
      origen: origenLabel,
      comprobante: pedido.pedido,
      comprobantesIncluidos: [pedido.pedido],
      sucursal: '1',
      deposito,
      codigo: pedido.pedido,
      razonSocial: pedido.razonSocial,
      preparador,
      prioridad,
      estado: 'Pendiente',
      avance: 0,
      transporte: '',
      zona: '',
      localidad: '',
      metodologiaPickeo,
      modoEjecucion,
      areasSolicitadas,
      clientes: [
        {
          razonSocial: pedido.razonSocial,
          comprobantes: [pedido.pedido],
          items: pedido.detalle.map(item => ({
            codigo: item.codigoProducto,
            descripcion: item.descripcion,
            cantidad: item.cantidad
          }))
        }
      ]
    }
  }

  const handleConfirmDocumento = (seleccion) => {
    const seleccionConOrigen = { ...seleccion, origenLabel: ORIGENES_CONFIG[selectedOrigenId].badgeLabel }

    if (seleccion.modoEjecucion === 'Picking por Zonas') {
      const sinArea = seleccion.pedido.detalle
        .filter(item => !item.area)
        .map(item => ({ codigoArticulo: item.codigoProducto, descripcion: item.descripcion, ubicacion: item.ubicacion ?? '' }))

      setPedidoVentaSeleccion(seleccionConOrigen)

      if (sinArea.length > 0) {
        setArticulosSinArea(sinArea)
        setShowArticulosSinAreaPanel(true)
      } else {
        setShowAreasPanel(true)
      }
      return
    }

    const nuevaPreparacion = buildNuevaPreparacion(seleccionConOrigen, seleccion.preparador, [])
    setPreparaciones([...preparaciones, nuevaPreparacion])

    setShowDocumentoPanel(false)
    setShowPreparacionOrigenModal(false)
    setSelectedOrigenId(null)
    setPedidoVentaSeleccion(null)
  }

  const handleBackFromArticulosSinArea = () => {
    setShowArticulosSinAreaPanel(false)
  }

  const handleContinuarArticulosSinArea = () => {
    setShowAreasPanel(true)
  }

  const handleBackFromAreas = () => {
    setShowAreasPanel(false)
  }

  const handleConfirmAreas = (asignaciones) => {
    const preparador = Object.entries(asignaciones)
      .map(([area, prep]) => `${area}: ${prep}`)
      .join(' | ')

    const areasSolicitadas = Object.entries(asignaciones).map(([area, prep]) => ({
      area,
      preparador: prep,
      avance: 0,
      estado: 'Pendiente'
    }))

    const nuevaPreparacion = buildNuevaPreparacion(pedidoVentaSeleccion, preparador, areasSolicitadas)
    setPreparaciones([...preparaciones, nuevaPreparacion])

    setShowAreasPanel(false)
    setShowArticulosSinAreaPanel(false)
    setArticulosSinArea([])
    setShowDocumentoPanel(false)
    setShowPreparacionOrigenModal(false)
    setSelectedOrigenId(null)
    setPedidoVentaSeleccion(null)
  }

  const handleDeletePreparacion = (preparacion) => {
    if (confirm(`¿Eliminar la preparación ${preparacion.codigo || ''}?`)) {
      setPreparaciones(preparaciones.filter(p => p.id !== preparacion.id))
    }
  }

  const handleGenerateReport = (preparacion) => {
    alert(`Generando reporte para la preparación ${preparacion.codigo || preparacion.id}...`)
  }

  const handleIniciarControl = (seleccion) => {
    if (!seleccion) return
    alert(`Iniciando control para ${seleccion.item.codigo} - ${seleccion.item.razonSocial}...`)
  }

  const handleModificarControl = ({ item }) => {
    alert(`Modificar control de ${item.codigo} - ${item.razonSocial}...`)
  }

  const handleLiberarControl = ({ item }) => {
    alert(`Liberando preparación ${item.codigo} - ${item.razonSocial}...`)
  }

  const handleNavigate = (viewId) => {
    setActiveView(viewId)

    if (viewId === 'operarios-stock') {
      setActiveTab('inicio')
      return
    }

    if (viewId === 'preparacion') {
      setTabs(prev => prev.some(tab => tab.id === 'preparacion')
        ? prev
        : [...prev, { id: 'preparacion', label: 'Preparación', closable: true }])
      setActiveTab('preparacion')
      return
    }

    if (viewId === 'control-preparaciones') {
      setTabs(prev => prev.some(tab => tab.id === 'control-preparaciones')
        ? prev
        : [...prev, { id: 'control-preparaciones', label: 'Control de Preparaciones', closable: true }])
      setActiveTab('control-preparaciones')
    }
  }

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId)
    setActiveView(tabId === 'inicio' ? 'operarios-stock' : tabId)
  }

  const handleCloseTab = (tabId) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId))
    if (activeTab === tabId) {
      setActiveTab('inicio')
      setActiveView('operarios-stock')
    }
  }

  return (
    <div className={styles.app}>
      <Sidebar activeView={activeView} onSelectView={handleNavigate} />
      <div className={styles.container}>
        <Tabs tabs={tabs} activeTab={activeTab} onSelectTab={handleSelectTab} onCloseTab={handleCloseTab} />

        {activeTab === 'inicio' && (
          <OperariosList
            operarios={filteredOperarios}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onView={handleViewOperario}
            onEdit={handleEditOperario}
            onDelete={handleDeleteOperario}
            onCreate={handleCreateOperario}
          />
        )}

        {activeTab === 'preparacion' && (
          <PreparacionesList
            preparaciones={filteredPreparaciones}
            searchTerm={preparacionSearchTerm}
            onSearchChange={setPreparacionSearchTerm}
            onView={handleViewDetallePreparacion}
            onCreate={handleCreatePreparacion}
            onEdit={handleEditDetallePreparacion}
            onDelete={handleDeletePreparacion}
            onGenerateReport={handleGenerateReport}
            onRowClick={handleViewDetallePreparacion}
          />
        )}

        {activeTab === 'control-preparaciones' && (
          <ControlPreparacionesList
            preparaciones={filteredControlPreparaciones}
            searchTerm={controlPreparacionesSearchTerm}
            onSearchChange={setControlPreparacionesSearchTerm}
            onIniciarControl={handleIniciarControl}
            onModificar={handleModificarControl}
            onLiberar={handleLiberarControl}
          />
        )}
      </div>

      {panelMode && (
        <OperarioPanel
          mode={panelMode}
          operario={selectedOperario}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {showDocumentoPanel && (
        <PreparacionDocumentoPanel
          origenId={selectedOrigenId}
          onBack={handleBackFromDocumento}
          onCancel={handleCancelPreparacionOrigen}
          onConfirm={handleConfirmDocumento}
          rightOffset={showAreasPanel ? AREAS_PANEL_WIDTH + ARTICULOS_SIN_AREA_PANEL_WIDTH : (showArticulosSinAreaPanel ? ARTICULOS_SIN_AREA_PANEL_WIDTH : 0)}
          inactive={showAreasPanel || showArticulosSinAreaPanel}
        />
      )}

      {showArticulosSinAreaPanel && (
        <PreparacionArticulosSinAreaPanel
          articulosSinArea={articulosSinArea}
          onBack={handleBackFromArticulosSinArea}
          onCancel={handleCancelPreparacionOrigen}
          onContinuar={handleContinuarArticulosSinArea}
          rightOffset={showAreasPanel ? AREAS_PANEL_WIDTH : 0}
          inactive={showAreasPanel}
        />
      )}

      {showAreasPanel && pedidoVentaSeleccion && (
        <PreparacionAreasPanel
          pedido={pedidoVentaSeleccion.pedido}
          operarios={operarios}
          numeroPreparacion={nextNumeroPreparacion}
          onBack={handleBackFromAreas}
          onCancel={handleCancelPreparacionOrigen}
          onConfirm={handleConfirmAreas}
        />
      )}

      {showPreparacionOrigenModal && (
        <PreparacionOrigenPanel
          onSelect={handleSelectPreparacionOrigen}
          onCancel={handleCancelPreparacionOrigen}
          rightOffset={showAreasPanel ? AREAS_PANEL_WIDTH + ARTICULOS_SIN_AREA_PANEL_WIDTH + PEDIDO_VENTA_PANEL_WIDTH : (showArticulosSinAreaPanel ? ARTICULOS_SIN_AREA_PANEL_WIDTH + PEDIDO_VENTA_PANEL_WIDTH : (showDocumentoPanel ? PEDIDO_VENTA_PANEL_WIDTH : 0))}
          activeOriginId={(showDocumentoPanel || showArticulosSinAreaPanel || showAreasPanel) ? selectedOrigenId : null}
          inactive={showDocumentoPanel || showArticulosSinAreaPanel || showAreasPanel}
        />
      )}

      {preparacionVista && (
        <PreparacionVistaPanel
          preparacion={preparacionVista}
          mode={preparacionVistaMode}
          operarios={operarios}
          onClose={handleCloseDetallePreparacion}
          onSave={handleSaveDetallePreparacion}
        />
      )}
    </div>
  )
}
