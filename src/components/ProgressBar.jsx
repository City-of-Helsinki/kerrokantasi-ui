import React, {useState, useRef, useEffect} from 'react';

function ProgressBar(props) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const [barWidth, setBarWidth] = useState(0);
    const styleprops = {
        width: barWidth + '%'
    }
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [isIntersecting])

    useEffect(() => {
        if (isIntersecting) {
          ref.current.querySelectorAll("div").forEach((el) => {
            el.classList.add("in-viewport");
            setBarWidth(props.now);
          });
        }
      }, [isIntersecting]);

    return (
        <div className="progressBar-wrapper" ref={ref}>
            <div 
                className="progressBar"
                aria-valuenow={props.now}
                aria-valuemin="0"
                aria-valuemax="100"
                style={styleprops}>
            </div>
        </div>
    );
}

export default ProgressBar;