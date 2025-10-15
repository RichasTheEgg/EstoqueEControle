"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import styles from "./sidebar.module.css"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Produtos", href: "/products", icon: "📦" },
  { name: "Movimentações", href: "/movements", icon: "🔄" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📊</span>
          <h1 className={styles.logoText}>Controle de Estoque</h1>
        </div>
      </div>

      <nav className={styles.nav}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <span className={styles.logoutIcon}>🚪</span>
          <span>Sair</span>
        </button>
      </div>
    </div>
  )
}
