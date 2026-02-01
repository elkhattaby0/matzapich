export default function BgCard({children, tag=''}) {
    return (
        <div className={`BgCard ${tag}`}>
            {children}
        </div>
    )
}