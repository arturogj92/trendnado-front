import Image from 'next/image'

export enum LoadingMode { LIGHT, DARK, NORMAL }

export function Loading ({ mode = LoadingMode.NORMAL }) {
  // return (
  //     <>
  //         <Image src={'/loading.svg'} width={width} height={height} alt='loading'/>
  //     </>
  // )

  const calculateModeClass = (mode) => {
    switch (mode) {
      case LoadingMode.LIGHT: return 'light'
      case LoadingMode.DARK: return 'dark'
      default: return ''
    }
  }

  return (
    <div data-testid='loading' className={`spinner ${calculateModeClass(mode)}`} />
  )
}
