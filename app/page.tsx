import { redirect } from 'next/navigation'
import './globals.css'

export default function HomePage (props: any) {
  function isSubmit (props: any) {
    return Object.keys(props.searchParams).length !== 0
  }

  function isChecked () {
    return props.searchParams.isMocked !== 'on'
  }

  if (isSubmit(props)) {
    console.log('datos form:: ', props)
    return redirect(`/similar-accounts/${props.searchParams.creatorName}`)
  }

  return (
    <>
      <h2 className='description'>
        🪄 Descubre el contenido que <span className='hightlight-purple'> realmente funciona </span> en tu nicho gracias a la IA
      </h2>
      <form>
        <div className='search-block'>
          <div className='instagram-input-container'>
            <span className='at' role='img'>@</span>
            <input type='text' id='instagram-account' name='creatorName' className='search' placeholder='Introduce tu cuenta de instagram' />
            <button className='search-btn' type='submit'><span className='emoji' role='img' aria-label='lupa'>🔎</span></button>
          </div>
        </div>
      </form>
      <h2 className='description'>
        Encuentra, analiza e inspírate con los mejores reels y videos de Instagram.
        Todo personalizado para ti.
      </h2>
    </>
  )
}
