import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';

function ProgressBar(props) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [barWidth, setBarWidth] = useState(0);
    const ref = useRef(null);
    const width = props.now;
    const styleprops = {
        width: barWidth.toString().concat('%')
    }
    

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
            setBarWidth(width);
          });
        }
      }, [isIntersecting, width]);

    return (
        <div className="progressBar-wrapper" ref={ref}>
            <div 
                className="progressBar"
                aria-valuenow={width}
                aria-valuemin="0"
                aria-valuemax="100"
                style={styleprops}
            />
        </div>
    );
    
}

ProgressBar.propTypes = {
    now: PropTypes.number,
}

export default ProgressBar;
