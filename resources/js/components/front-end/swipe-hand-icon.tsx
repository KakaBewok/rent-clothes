import { motion } from 'framer-motion';

export default function SwipeHandIcon() {
    return (
        <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 64" className="h-20 w-20" preserveAspectRatio="xMidYMid meet">
            <defs>
                <clipPath id="__lottie_element_2">
                    <rect width="96" height="64" x="0" y="0" />
                </clipPath>
                <clipPath id="__lottie_element_4">
                    <path d="M0,0 L96,0 L96,64 L0,64z" />
                </clipPath>
            </defs>
            <g clipPath="url(#__lottie_element_2)">
                <g clipPath="url(#__lottie_element_4)">
                    <motion.g
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: [-2, -17, -2], rotate: [0, -4, 0] }}
                        transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                            repeat: Infinity,
                        }}
                        style={{ transformOrigin: 'center center' }}
                    >
                        <g transform="translate(66.39,32)">
                            <path fill="rgb(255,0,66)" fillOpacity="1" d="M0 0" />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fillOpacity="0"
                                stroke="rgb(0,0,0)"
                                strokeOpacity="1"
                                strokeWidth="2"
                                d=" M-8.038,-0.077 C-8.038,-0.077 -8.038,-23.994 -8.038,-23.994 C-8.038,-26.206 -6.247,-28 -4.038,-28 C-1.829,-28 -0.038,-26.206 -0.038,-23.994 C-0.038,-23.994 -0.038,-6.017 -0.038,-6.017 C-0.038,-6.017 8.147,-6.979 8.147,-1.931 C8.147,-1.931 13.878,-1.942 13.878,1.899 C13.878,1.899 21.962,5.953 11.962,20 C11.962,20 11.962,28 11.962,28 C11.962,28 -8.038,28 -8.038,28 C-8.038,28 -8.038,16.049 -8.038,16.049 C-8.038,16.049 -20.43,-2.614 -20.43,-2.614 C-21.961,-4.921 -20.311,-8.007 -17.546,-8.007 C-16.64,-8.007 -15.769,-7.652 -15.122,-7.017 C-15.122,-7.017 -8.038,-0.077 -8.038,-0.077z"
                            />
                        </g>
                    </motion.g>
                </g>
            </g>
        </motion.svg>
    );
}
