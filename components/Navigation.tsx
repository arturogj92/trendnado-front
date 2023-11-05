import Link from 'next/link'
import styles from './Navigation.module.css'

interface InternalLink {
    label: string,
    route: string
}

const internalLinks = [
  { label: 'HOME', route: '/' },
  { label: 'ABOUT', route: '/about' },
  { label: 'ANALYSIS', route: '/analysis/:creatorName?=isMocked' }
]

const renderLinks = () => (
  <>
    {internalLinks.map((link: InternalLink) => (
      <li key={link.route}>
        <Link href={link.route}>
          <span className={styles.linktext}>{link.label}</span>
        </Link>
      </li>
    ))}
  </>
)

export function Navigation () {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <h1 className={styles.title}> TRENDNADO </h1>
        <ul className={styles.navigation}>
          {renderLinks()}
        </ul>
      </nav>
    </header>
  )
}
