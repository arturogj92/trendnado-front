import Image from "next/image";

export function Loading ({}) {

    return (
        <>
            <Image src={'/loading.svg'} width={200} height={200} alt='loading'/>
        </>
    )
}
