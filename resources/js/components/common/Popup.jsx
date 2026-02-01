import BgCard from "./BgCard";

export default function Popup({children}) {
    return (
        <div className="Popup" id="Popup">
            <BgCard tag='post'>
                <button onClick={()=> {
                    const popup = document.getElementById('Popup');
                    if (popup) {
                        popup.classList.remove('active');
                    }
                }}><i className="fa-solid fa-xmark"></i></button>
                {children}
            </BgCard>
        </div>
    )
}