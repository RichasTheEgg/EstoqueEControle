"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./login.module.css"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Conectar com sua API de autenticação
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("user", JSON.stringify({ email, name: "Usuário" }))
        router.push("/dashboard")
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9M14 17H5M17 12H3" />
              <circle cx="17" cy="7" r="3" />
              <circle cx="7" cy="17" r="3" />
              <circle cx="17" cy="17" r="3" />
            </svg>
          </div>
          <h1 className={styles.title}>Sistema de Controle de Estoque</h1>
          <p className={styles.subtitle}>Entre com suas credenciais para acessar o sistema</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>
    </div>
  )
}
