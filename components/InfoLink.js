import SvgIcon from './SvgIcon'
import Link from 'next/link'

export default function InfoLink({ subject, sameWindow, useName, useDescription, text }) {

    if (!subject || !subject.infoPageUrl) { return null }

    const hrefPath = subject.infoPageUrl

    let textContent = text || null
    if (useName) {textContent = subject.name}
    if (useDescription) {textContent = subject.description || subject.displayName || subject.name}


    if (sameWindow) {return (
        <Link href={hrefPath} onClick={event => event.stopPropagation()}>
            {textContent
                ? <span style={{cursor:'pointer', textDecoration:'underline'}}>{textContent}</span>
                : <SvgIcon iconName="questionMark" />
            }
        </Link>
    )}

    return (
        <a target="_blank" href={hrefPath} onClick={event => event.stopPropagation()} >
            {textContent
                ? <span>{textContent}</span>
                : <SvgIcon iconName="questionMark" />
            }
        </a>
    )

}