import { redirect } from 'next/navigation'

export default function HomePage (props: any) {
  function isSubmit (props: any) {
    return Object.keys(props.searchParams).length !== 0
  }

  function isChecked () {
    return props.searchParams.isMocked !== 'on'
  }

  if (isSubmit(props)) {
    console.log('datos form:: ', props)

    // return redirect(`/analysis/${props.searchParams.creatorName}?isMocked=${isChecked()}`)
    return redirect(`/similar-accounts/${props.searchParams.creatorName}`)
  }

  return (
    <form>
      <input style={{ backgroundColor: 'grey' }} type='text' name='creatorName' />
      Real data - <input type='checkbox' name='isMocked' />
      <button type='submit'>Submit</button>
    </form>
  )
}
