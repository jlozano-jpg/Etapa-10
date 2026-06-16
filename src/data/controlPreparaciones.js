export const CONTROL_PREPARACIONES = [
  {
    id: 1,
    fecha: '29/05/2026',
    comprobante: '00005724',
    sucursal: 'SUCURSAL CENTRAL',
    deposito: '10',
    codigo: '',
    razonSocial: '',
    preparador: '001 - Juan Pérez',
    controlador: '',
    prioridad: 1,
    estado: 'Control Pendiente',
    detalle: [
      {
        codigo: '00022',
        razonSocial: 'RETROBOROS SA',
        controlador: '',
        prioridad: '',
        estado: 'Control Pendiente',
        comprobantes: ['00005724'],
        items: [
          {
            codigoArticulo: 'ART-001', descripcion: 'TORNILLO HEXAGONAL 1/2"',
            cantidadPreparada: 100, stockDisponible: 450,
            ubicaciones: ['ESTANTE 1', 'ESTANTE 2', 'DEPOSITO A'],
            lotes: ['LOTE-2024-001', 'LOTE-2024-002']
          },
          {
            codigoArticulo: 'ART-002', descripcion: 'TUERCA AUTOBLOCANTE M12',
            cantidadPreparada: 50, stockDisponible: 220,
            ubicaciones: ['ESTANTE 3', 'DEPOSITO A'],
            lotes: ['LOTE-2024-003']
          },
          {
            codigoArticulo: 'ART-003', descripcion: 'ARANDELA PLANA 10mm',
            cantidadPreparada: 200, stockDisponible: 1100,
            ubicaciones: ['ESTANTE 1'],
            lotes: ['LOTE-2024-001', 'LOTE-2024-004']
          },
        ]
      },
      {
        codigo: '00017',
        razonSocial: 'SPECISM LUCAS',
        controlador: '',
        prioridad: '',
        estado: 'Control Pendiente',
        comprobantes: ['00005725'],
        items: [
          {
            codigoArticulo: 'ART-010', descripcion: 'CABLE UNIPOLAR 2.5mm',
            cantidadPreparada: 300, stockDisponible: 1500,
            ubicaciones: ['DEPOSITO B', 'DEPOSITO C'],
            lotes: ['LOTE-2024-010']
          },
          {
            codigoArticulo: 'ART-011', descripcion: 'DISYUNTOR TERMICA 16A',
            cantidadPreparada: 10, stockDisponible: 45,
            ubicaciones: ['ESTANTE 5'],
            lotes: []
          },
        ]
      }
    ]
  }
]
