export default function Controls({ buttons = [], id = "" }: {
  buttons: Array<{label: string; onClick: () => void; className: string; style?: any}>;
  id?: string;
}) {
    return (
        <>
            {buttons.map((btn, i) => 
                <div className={btn.className} key={`${id}-${i}`}>
                    <button 
                        onClick={(e) => {
                            console.log('Controls button clicked:', btn.label, 'id:', id);
                            btn.onClick();
                        }}
                        style={btn.style}
                    >
                        {btn.label}
                    </button>
                </div>
            )}
        </>
    )
}
