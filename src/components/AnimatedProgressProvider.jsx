import React, { useEffect, useState } from 'react'
import { Animate } from 'react-move';

function AnimatedProgressProvider({
    valueStart = 0,
    valueEnd,
    duration,
    easingFunction,
    children
}) {
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        setIsAnimated(true);
    }, [duration]);
    return (
        <Animate
            start={() => ({
                value: valueStart
            })}
            update={() => ({
                value: [isAnimated ? valueEnd : valueStart],
                timing: {
                    duration: duration * 1000,
                    ease: easingFunction
                }
            })}
        >
            {({ value }) => children(value)}
        </Animate>
    )
}

export default AnimatedProgressProvider