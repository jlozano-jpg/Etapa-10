import { useState } from 'react'
import styles from './Sidebar.module.css'

const MENU_ITEMS = [
  {
    id: 'operarios-stock',
    label: 'Operadores de Stock'
  }
]

export default function Sidebar({ activeView, onSelectView }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <button
          className={styles.menuToggle}
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        {!collapsed && (
          <div className={styles.brand}>
            <span className={styles.logo} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26">
                <rect x="2" y="2" width="20" height="9" rx="2" fill="#8833B8" />
                <rect x="2" y="13" width="20" height="9" rx="2" fill="#6A00A7" />
              </svg>
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>ZEUS</span>
              <span className={styles.brandTag}>ERP &amp; POS</span>
            </span>
          </div>
        )}
      </div>

      <nav className={styles.menu} aria-label="Menú principal">
        {MENU_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.menuItem} ${activeView === item.id ? styles.menuItemActive : ''}`}
            onClick={() => onSelectView(item.id)}
            title={item.label}
            aria-current={activeView === item.id ? 'page' : undefined}
          >
            <span className={styles.menuLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
