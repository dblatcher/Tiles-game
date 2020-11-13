import SvgIcon from './SvgIcon'

export default function InfoLink({subject}){

    if (!subject || !subject.infoPageUrl) {return null}

    const hrefPath = subject.infoPageUrl


    return (
        <a target="_blank" href={hrefPath} onClick={event => event.stopPropagation()}
        style={{textDecoration: '1px solid'}}>
            <SvgIcon iconName="questionMark"/>
        </a>
    )

}