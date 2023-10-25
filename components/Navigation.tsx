import Link from 'next/link'
import styles from './Navigation.module.css'

interface InternalLink {
    label: string,
    route: string
}

const internalLinks = [
  { label: 'Home', route: '/' },
  { label: 'About', route: '/about' },
  { label: 'Analysis', route: '/analysis/:creatorName?=isMocked' },
  { label: 'SimilarAccounts', route: '/similar-accounts/:creatorName' }
]

const renderLinks = () => (
  <>
    {internalLinks.map((link: InternalLink) => (
      <li key={link.route}>
        <Link href={link.route}>
          {link.label}
        </Link>
      </li>
    ))}
  </>
)

export function Navigation () {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navigation}>
          {renderLinks()}
        </ul>
      </nav>
    </header>
  )
}
