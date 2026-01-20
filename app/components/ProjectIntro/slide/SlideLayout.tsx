'use client';
import Controls from './controls/page';
import Footer from './footer/page';

/**
 * @description Renders a wrapper for a slide child, adding controls and a footer (if applicable)
 */
export default function SlideLayout({ containerClassNames="", controlButtons, footer, mobileWarning, children }: {
  containerClassNames?: string;
  controlButtons: Array<{key?: string; label: string; onClick: () => void; className: string; style?: any}>;
  footer?: any;
  mobileWarning?: string;
  children: React.ReactNode;
}) {
    return (
        <div className={`intro-slide-container ${containerClassNames}`}>
            <div className="intro-slide">
                {children}
                <Controls 
                    buttons={controlButtons} 
                    id="slide-controls"
                />
                {mobileWarning && (
                    <p className="font-[family-name:var(--font-roboto)] text-sm text-[#666666] text-center mt-2">
                        {mobileWarning}
                    </p>
                )}
                {footer && 
                    <Footer 
                        image={footer.image} 
                        items={footer.items} 
                    />
                }
            </div>
        </div>
    )
}
