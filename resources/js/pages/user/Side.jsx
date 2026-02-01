export default function Side({ title = '', isOpen, onClose, children }) {
    if (!isOpen) return null; 

    return (
        <div className="side active">
            <section>
                <div className="head">
                    <h2>{title}</h2>
                    <button
                        className="close"
                        onClick={() => {
                            document.body.style.overflow = '';
                            onClose?.();
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="body">
                    {children}
                </div>
            </section>
        </div>
    );
}
