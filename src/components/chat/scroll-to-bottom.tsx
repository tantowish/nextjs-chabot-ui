import React, { useState, useEffect, forwardRef, Ref, RefObject } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Button } from "../ui/button";

type ScrollToBottomProps = {
    height?: number;
};

const ScrollToBottom = forwardRef<HTMLDivElement, ScrollToBottomProps>(({ height }, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [initialScroll, setInitialScroll] = useState<boolean>(false)

    const handleOnClick = () => {
        if (ref && 'current' in ref && ref.current) {
            ref.current.scrollTo({
                top: ref.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    const checkScrollPosition = () => {
        if (ref && 'current' in ref && ref.current) {
            const { scrollTop, scrollHeight, clientHeight } = ref.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
            setIsVisible(!isAtBottom);
        }
    };

    useEffect(() => {
        if (ref && 'current' in ref && ref.current && height) {
            if (!initialScroll) {
                setInitialScroll(true);
                handleOnClick();
            }
    
            const currentRef = ref.current;
            currentRef.addEventListener("scroll", checkScrollPosition);
            checkScrollPosition();
    
            return () => {
                currentRef.removeEventListener("scroll", checkScrollPosition);
            };
        }
    }, [ref, height, initialScroll]);

    return (
        <Button
            onClick={handleOnClick}
            className={`absolute h-auto p-2 bottom-36 md:bottom-32 hover:bg-[#383838] bg-[#383838] shadow-md z-40 rounded-full cursor-pointer transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 cursor-default'}`}
        >
            <FaArrowLeftLong className="-rotate-90" />
        </Button>
    );
});

ScrollToBottom.displayName = 'ScrollToBottom';
export default ScrollToBottom;
